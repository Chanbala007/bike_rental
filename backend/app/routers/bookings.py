from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from app import schemas, models
from app.database import get_db
from app.routers.auth import get_user_from_cookie, get_current_admin
from app.routers.payments import razorpay_client
from datetime import datetime, timedelta, timezone
from app.services import notifications

router = APIRouter()

@router.get("/", response_model=List[schemas.BookingResponse])
def get_bookings(customer_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all bookings, optionally filtered by customer_id"""
    query = db.query(models.Booking)
    if customer_id is not None:
        query = query.filter(models.Booking.customer_id == customer_id)
    
    bookings = query.order_by(models.Booking.created_at.desc()).offset(skip).limit(limit).all()
    return bookings

@router.get("/admin/stats")
def get_admin_stats(timeframe: str = 'today', db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    """Get dynamic admin statistics based on timeframe"""
    query = db.query(models.Booking)
    
    if timeframe != 'all':
        now = datetime.utcnow()
        if timeframe == 'today':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif timeframe == '1week':
            start_date = now - timedelta(days=7)
        elif timeframe == '1month':
            start_date = now - timedelta(days=30)
        elif timeframe == '1year':
            start_date = now - timedelta(days=365)
        else:
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            
        query = query.filter(models.Booking.created_at >= start_date)
        
    bookings = query.all()
    total_revenue = sum(b.total_price for b in bookings if b.total_price)
    
    return {
        "bookings_count": len(bookings),
        "revenue": total_revenue
    }

@router.get("/my/bookings")
def get_my_bookings(current_user: models.Customer = Depends(get_user_from_cookie), db: Session = Depends(get_db)):
    """Get bookings for the currently authenticated user"""
    bookings = db.query(models.Booking).filter(models.Booking.customer_id == current_user.id).order_by(models.Booking.created_at.desc()).all()
    
    # Custom response to include bike details easily
    result = []
    for b in bookings:
        bike = db.query(models.Bike).filter(models.Bike.id == b.bike_id).first()
        b_dict = {c.name: getattr(b, c.name) for c in b.__table__.columns}
        if bike:
            b_dict['bike'] = {c.name: getattr(bike, c.name) for c in bike.__table__.columns}
        result.append(b_dict)
        
    return result

@router.get("/my/count")
def get_my_booking_count(current_user: models.Customer = Depends(get_user_from_cookie), db: Session = Depends(get_db)):
    """Count of PAID bookings for the current user (confirmed, picked, completed)"""
    count = db.query(models.Booking).filter(
        models.Booking.customer_id == current_user.id,
        models.Booking.status.in_(["confirmed", "picked", "completed"])
    ).count()
    return {"count": count}

@router.get("/{booking_id}", response_model=schemas.BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """Get a single booking by ID"""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found"
        )
    return booking

@router.post("/", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking: schemas.BookingCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Create a new booking"""
    # Verify bike exists
    bike = db.query(models.Bike).filter(models.Bike.id == booking.bike_id).first()
    if not bike:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bike with id {booking.bike_id} not found"
        )
    
    db_booking = models.Booking(**booking.dict())
    
    # Backend Enforcement: Check for loyalty discount (30% off after 5 paid bookings)
    if db_booking.customer_id:
        paid_count = db.query(models.Booking).filter(
            models.Booking.customer_id == db_booking.customer_id,
            models.Booking.status.in_(["confirmed", "picked", "completed"])
        ).count()
        
        if paid_count >= 5:
            # Apply 30% discount if not already applied (or as safeguard)
            original_price = db_booking.total_price
            # We assume the frontend might send the full price, so we recalculate
            # To be safe, we only reduce if it's currently at or near the full price
            # But the user wants it to be consistent, so let's just enforce it
            db_booking.total_price = original_price * 0.7
            print(f"LOYALTY DISCOUNT APPLIED: {original_price} -> {db_booking.total_price}")

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    # Send Notification in Background
    background_tasks.add_task(notifications.notify_booking_received, db_booking, bike.name)
    
    return db_booking


@router.post("/admin/walk-in", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_walk_in_booking(
    booking: schemas.WalkInBookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    """Admin-only: Create a walk-in booking and optionally mark the bike as unavailable"""
    bike = db.query(models.Bike).filter(models.Bike.id == booking.bike_id).first()
    if not bike:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bike with id {booking.bike_id} not found"
        )

    booking_data = booking.dict(exclude={"mark_bike_unavailable", "status", "booking_source"})
    db_booking = models.Booking(
        **booking_data,
        status=booking.status or "confirmed",
        booking_source="walk_in"
    )
    db.add(db_booking)

    # Mark bike unavailable if requested
    if booking.mark_bike_unavailable:
        bike.status = "unavailable"

    db.commit()
    db.refresh(db_booking)

    # Send Notification in Background
    background_tasks.add_task(notifications.notify_booking_received, db_booking, bike.name)

    return db_booking


@router.put("/{booking_id}/pick", response_model=schemas.BookingResponse)
def pick_booking(booking_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Mark a booking as picked up"""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status != "confirmed":
        raise HTTPException(status_code=400, detail="Only confirmed bookings can be picked up")
    
    booking.status = "picked"
    booking.picked_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(booking)
    return booking

@router.put("/{booking_id}/return", response_model=schemas.BookingResponse)
def return_booking(booking_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Mark a booking as returned"""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status != "picked":
        raise HTTPException(status_code=400, detail="Only picked up bikes can be returned")
    
    bike = db.query(models.Bike).filter(models.Bike.id == booking.bike_id).first()
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")

    now = datetime.now(timezone.utc)
    booking.status = "completed"
    booking.returned_at = now
    
    # Make bike available again
    bike.status = "available"
    
    db.commit()
    db.refresh(booking)
    return booking

@router.post("/notify-delivery")
def notify_delivery(data: dict):
    """Notify admin about a delivery request (Simulated)"""
    # In a real app, this might send an SMS or Email
    print(f"DELIVERY NOTIFICATION: {data}")
    return {"message": "Admin notified successfully"}

@router.put("/{booking_id}/confirm-payment", response_model=schemas.BookingResponse)
def confirm_payment(booking_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Manually confirm payment for a booking (Pending -> Confirmed)"""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending bookings can be confirmed manually")
    
    booking.status = "confirmed"
    
    # Send bill/receipt notification
    bike = db.query(models.Bike).filter(models.Bike.id == booking.bike_id).first()
    bike_name = bike.name if bike else "Bike"
    background_tasks.add_task(notifications.notify_payment_success, booking, bike_name)
    
    db.commit()
    db.refresh(booking)
    return booking

@router.patch("/{booking_id}/location")
def update_booking_location(booking_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Update the location field for a specific booking"""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if "location" not in data:
        raise HTTPException(status_code=400, detail="Location field is required")
        
    booking.location = data["location"]
    db.commit()
    db.refresh(booking)
    return booking
