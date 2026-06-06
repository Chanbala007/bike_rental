from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[schemas.GalleryImageResponse])
def get_gallery_images(db: Session = Depends(get_db)):
    """
    Get all active gallery images, sorted by sort_order. Public endpoint.
    """
    images = db.query(models.GalleryImage)\
        .filter(models.GalleryImage.is_active == True)\
        .order_by(models.GalleryImage.sort_order.asc(), models.GalleryImage.id.desc())\
        .all()
    return images

@router.get("/all", response_model=List[schemas.GalleryImageResponse])
def get_all_gallery_images(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """
    Get all gallery images (including inactive). Admin only.
    """
    images = db.query(models.GalleryImage)\
        .order_by(models.GalleryImage.sort_order.asc(), models.GalleryImage.id.desc())\
        .all()
    return images

@router.post("/", response_model=schemas.GalleryImageResponse)
def create_gallery_image(image: schemas.GalleryImageCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """
    Upload a new gallery image. Admin only.
    """
    db_image = models.GalleryImage(**image.model_dump())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

@router.patch("/{image_id}/status", response_model=schemas.GalleryImageResponse)
def toggle_image_status(image_id: int, status_update: schemas.GalleryImageUpdate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """
    Toggle is_active status of an image. Admin only.
    """
    db_image = db.query(models.GalleryImage).filter(models.GalleryImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    if status_update.is_active is not None:
        db_image.is_active = status_update.is_active
    
    if status_update.caption is not None:
        db_image.caption = status_update.caption
        
    if status_update.sort_order is not None:
        db_image.sort_order = status_update.sort_order
        
    db.commit()
    db.refresh(db_image)
    return db_image

@router.delete("/{image_id}")
def delete_gallery_image(image_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """
    Delete a gallery image. Admin only.
    """
    db_image = db.query(models.GalleryImage).filter(models.GalleryImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    db.delete(db_image)
    db.commit()
    return {"message": "Image deleted successfully"}
