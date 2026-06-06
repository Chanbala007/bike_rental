from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import schemas, models
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.BikeResponse])
def get_bikes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all bikes"""
    bikes = db.query(models.Bike).offset(skip).limit(limit).all()
    return bikes

@router.get("/{bike_id}", response_model=schemas.BikeResponse)
def get_bike(bike_id: int, db: Session = Depends(get_db)):
    """Get a single bike by ID"""
    bike = db.query(models.Bike).filter(models.Bike.id == bike_id).first()
    if not bike:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bike with id {bike_id} not found"
        )
    return bike

@router.post("/", response_model=schemas.BikeResponse, status_code=status.HTTP_201_CREATED)
def create_bike(bike: schemas.BikeCreate, db: Session = Depends(get_db)):
    """Create a new bike"""
    try:
        db_bike = models.Bike(**bike.dict())
        db.add(db_bike)
        db.commit()
        db.refresh(db_bike)
        return db_bike
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating bike: {str(e)}"
        )

@router.put("/{bike_id}", response_model=schemas.BikeResponse)
def update_bike(bike_id: int, bike_update: schemas.BikeUpdate, db: Session = Depends(get_db)):
    """Update a bike"""
    db_bike = db.query(models.Bike).filter(models.Bike.id == bike_id).first()
    if not db_bike:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bike with id {bike_id} not found"
        )
    
    # Update only provided fields
    update_data = bike_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_bike, field, value)
    
    db.commit()
    db.refresh(db_bike)
    return db_bike

@router.delete("/{bike_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bike(bike_id: int, db: Session = Depends(get_db)):
    """Delete a bike"""
    db_bike = db.query(models.Bike).filter(models.Bike.id == bike_id).first()
    if not db_bike:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bike with id {bike_id} not found"
        )
    
    db.delete(db_bike)
    db.commit()
    return None

@router.get("/status/{status}", response_model=List[schemas.BikeResponse])
def get_bikes_by_status(status: str, db: Session = Depends(get_db)):
    """Get bikes by status (available/unavailable)"""
    bikes = db.query(models.Bike).filter(models.Bike.status == status).all()
    return bikes

