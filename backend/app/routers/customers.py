from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app import schemas, models
from app.database import get_db
from app.routers.auth import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[schemas.CustomerAdminResponse])
def get_customers(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    """Get all customers with their rental stats (Admin only)"""
    # Join with bookings to get counts and sums
    customers = db.query(models.Customer).all()
    
    results = []
    for customer in customers:
        # Get count of bookings
        booking_stats = db.query(
            func.count(models.Booking.id).label("count"),
            func.sum(models.Booking.total_price).label("total_price_sum")
        ).filter(models.Booking.customer_id == customer.id).first()
        
        total_spent = (booking_stats.total_price_sum or 0.0)
        
        # Create response object
        cust_admin = schemas.CustomerAdminResponse(
            **customer.__dict__,
            total_bookings=booking_stats.count or 0,
            total_spent=total_spent
        )
        results.append(cust_admin)
        
    return results

@router.get("/phone/{phone}", response_model=schemas.CustomerResponse)
def get_customer_by_phone(phone: str, db: Session = Depends(get_db)):
    """Get customer by phone number"""
    customer = db.query(models.Customer).filter(models.Customer.phone == phone).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with phone {phone} not found"
        )
    return customer

@router.post("/", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    """Create a new customer"""
    # Check if customer with this phone already exists
    existing = db.query(models.Customer).filter(models.Customer.phone == customer.phone).first()
    if existing:
        return existing  # Return existing customer instead of creating duplicate
    
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@router.get("/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Get a customer by ID"""
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with id {customer_id} not found"
        )
    return customer

@router.put("/{customer_id}", response_model=schemas.CustomerResponse)
def update_customer(customer_id: int, customer_update: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    """Update a customer"""
    db_customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not db_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with id {customer_id} not found"
        )
    
    update_data = customer_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_customer, key, value)
    
    db.commit()
    db.refresh(db_customer)
    return db_customer
