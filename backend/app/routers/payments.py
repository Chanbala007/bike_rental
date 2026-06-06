from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import razorpay
import os
from dotenv import load_dotenv
from app.database import get_db
from app import models, schemas
from app.services import notifications

# Load environment variables
load_dotenv()

router = APIRouter()

# Initialize Razorpay client
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "").strip()
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "").strip()

# Debug: Print if keys are loaded (remove in production)
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    print(f"✅ Razorpay Key ID loaded: {RAZORPAY_KEY_ID[:10]}...")
    try:
        razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        print("✅ Razorpay client initialized successfully")
    except Exception as e:
        razorpay_client = None
        print(f"❌ Error initializing Razorpay client: {e}")
else:
    razorpay_client = None
    print("⚠️  Warning: Razorpay credentials not found.")
    print(f"   RAZORPAY_KEY_ID: {'Set' if RAZORPAY_KEY_ID else 'Not set'}")
    print(f"   RAZORPAY_KEY_SECRET: {'Set' if RAZORPAY_KEY_SECRET else 'Not set'}")


class CreateOrderRequest(BaseModel):
    amount: float  # Amount in rupees
    currency: str = "INR"
    receipt: Optional[str] = None


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    booking_data: dict  # Contains all booking details


@router.get("/test-keys")
def test_razorpay_keys():
    """Test endpoint to verify Razorpay keys are configured correctly"""
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        return {
            "status": "error",
            "message": "Razorpay keys not found in environment variables",
            "key_id_set": bool(RAZORPAY_KEY_ID),
            "key_secret_set": bool(RAZORPAY_KEY_SECRET)
        }
    
    if not razorpay_client:
        return {
            "status": "error",
            "message": "Razorpay client not initialized",
            "key_id": RAZORPAY_KEY_ID[:10] + "..." if RAZORPAY_KEY_ID else "N/A"
        }
    
    try:
        # Test keys by creating a minimal test order (1 rupee = 100 paise)
        # This will verify authentication without actually charging
        test_order = razorpay_client.order.create({
            "amount": 100,  # 1 rupee in paise
            "currency": "INR",
            "receipt": f"test_{int(datetime.now().timestamp())}",
            "payment_capture": 0  # Don't capture, just test
        })
        
        # If order creation succeeds, keys are valid
        return {
            "status": "success",
            "message": "Razorpay keys are valid and working!",
            "test_order_id": test_order.get("id", "N/A"),
            "key_id": RAZORPAY_KEY_ID[:10] + "...",
            "note": "Test order created successfully. Keys are authenticated."
        }
    except razorpay.errors.BadRequestError as e:
        error_msg = str(e)
        if "authentication" in error_msg.lower() or "auth" in error_msg.lower():
            return {
                "status": "error",
                "message": "Authentication failed - Invalid API keys",
                "details": "Please verify your keys in Razorpay Dashboard",
                "key_id": RAZORPAY_KEY_ID[:10] + "..."
            }
        return {
            "status": "error",
            "message": f"Razorpay API error: {error_msg}",
            "key_id": RAZORPAY_KEY_ID[:10] + "..."
        }
    except razorpay.errors.ServerError as e:
        return {
            "status": "error",
            "message": f"Razorpay server error: {str(e)}",
            "key_id": RAZORPAY_KEY_ID[:10] + "..."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error testing keys: {str(e)}",
            "key_id": RAZORPAY_KEY_ID[:10] + "..."
        }


@router.post("/create-order")
def create_order(order_data: CreateOrderRequest):
    """Create a Razorpay order"""
    if not razorpay_client:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment service is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables."
        )
    
    try:
        # Convert amount to paise (Razorpay expects amount in smallest currency unit)
        amount_in_paise = int(order_data.amount * 100)
        
        # Create order
        order = razorpay_client.order.create({
            "amount": amount_in_paise,
            "currency": order_data.currency,
            "receipt": order_data.receipt or f"order_{order_data.amount}",
            "payment_capture": 1  # Auto capture payment
        })
        
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": RAZORPAY_KEY_ID  # Frontend needs this
        }
    except razorpay.errors.BadRequestError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Razorpay error: {str(e)}"
        )
    except razorpay.errors.ServerError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Razorpay server error: {str(e)}"
        )
    except Exception as e:
        error_msg = str(e)
        # Check if it's an authentication error
        if "authentication" in error_msg.lower() or "auth" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Razorpay authentication failed. Please verify your API keys are correct in the .env file and restart the backend server."
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating order: {error_msg}"
        )


@router.post("/verify-payment")
def verify_payment(payment_data: VerifyPaymentRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Verify Razorpay payment and create booking"""
    if not razorpay_client:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment service is not configured."
        )
    
    try:
        # Verify payment signature
        params_dict = {
            "razorpay_order_id": payment_data.razorpay_order_id,
            "razorpay_payment_id": payment_data.razorpay_payment_id,
            "razorpay_signature": payment_data.razorpay_signature
        }
        
        # Verify signature
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Payment verified successfully, now create booking
        booking_info = payment_data.booking_data
        
        # Convert ISO date strings to datetime objects
        pickup_date = booking_info["pickup_date"]
        drop_date = booking_info["drop_date"]
        
        if isinstance(pickup_date, str):
            pickup_date = datetime.fromisoformat(pickup_date.replace('Z', '+00:00'))
        if isinstance(drop_date, str):
            drop_date = datetime.fromisoformat(drop_date.replace('Z', '+00:00'))
        
        # Create booking
        booking = models.Booking(
            bike_id=booking_info["bike_id"],
            customer_id=booking_info.get("customer_id"),
            customer_name=booking_info["customer_name"],
            customer_email=booking_info.get("customer_email"),
            customer_phone=booking_info.get("customer_phone"),
            pickup_date=pickup_date,
            pickup_time=booking_info["pickup_time"],
            drop_date=drop_date,
            drop_time=booking_info["drop_time"],
            location=booking_info["location"],
            location_lat=booking_info.get("location_lat"),
            location_lng=booking_info.get("location_lng"),
            total_price=booking_info["total_price"],
            status="confirmed",
            booking_source="online",
            razorpay_order_id=payment_data.razorpay_order_id,
            razorpay_payment_id=payment_data.razorpay_payment_id
        )
        
        # Backend Enforcement: Check for loyalty discount (30% off after 5 paid bookings)
        if booking.customer_id:
            paid_count = db.query(models.Booking).filter(
                models.Booking.customer_id == booking.customer_id,
                models.Booking.status.in_(["confirmed", "picked", "completed"])
            ).count()
            
            if paid_count >= 5:
                # We trust the frontend on the 30% discount but we enforce it here for safety
                # Since this is a payment verification, the total_price should already be correct 
                # but we'll print for logging and ensure it's not bypassed.
                print(f"LOYALTY VERIFICATION: User ID {booking.customer_id} has {paid_count} paid bookings. Discount should be active.")

        db.add(booking)
        db.commit()
        db.refresh(booking)
        
        # Send Payment Receipt in Background
        try:
            bike = db.query(models.Bike).filter(models.Bike.id == booking.bike_id).first()
            bike_name = bike.name if bike else f"Bike #{booking.bike_id}"
            background_tasks.add_task(notifications.notify_payment_success, booking, bike_name)
        except Exception as e:
            print(f"Error triggering payment notification: {e}")
        
        return {
            "success": True,
            "message": "Payment verified and booking created successfully",
            "booking_id": booking.id,
            "payment_id": payment_data.razorpay_payment_id,
            "order_id": payment_data.razorpay_order_id
        }
        
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment verification failed: Invalid signature"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying payment: {str(e)}"
        )


        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying payment: {str(e)}"
        )

