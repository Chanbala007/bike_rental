from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class Bike(Base):
    __tablename__ = "bikes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    engine_cc = Column(String(50), nullable=False)
    price_per_day = Column(Float, nullable=False)
    image_url = Column(Text)  # Changed to Text to support base64 images
    description = Column(Text)
    category = Column(String(50), default="bike")  # bike, scooter
    status = Column(String(20), default="available")  # available, unavailable
    features = Column(Text)  # JSON string or comma-separated
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False, unique=True, index=True)
    email = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    bike_id = Column(Integer, nullable=False, index=True)
    customer_id = Column(Integer, nullable=True, index=True)  # Reference to customer (nullable for backward compatibility)
    customer_name = Column(String(255), nullable=False)  # Keep for backward compatibility
    customer_email = Column(String(255))
    customer_phone = Column(String(20))
    pickup_date = Column(DateTime(timezone=True), nullable=False)
    pickup_time = Column(String(10), nullable=False)
    drop_date = Column(DateTime(timezone=True), nullable=False)
    drop_time = Column(String(10), nullable=False)
    location = Column(Text, nullable=False)
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    total_price = Column(Float, nullable=False)
    status = Column(String(20), default="pending")  # pending, confirmed, picked, completed, cancelled
    booking_source = Column(String(20), default="online")  # online, walk_in
    picked_at = Column(DateTime(timezone=True), nullable=True)
    returned_at = Column(DateTime(timezone=True), nullable=True)
    razorpay_order_id = Column(String(100), nullable=True)
    razorpay_payment_id = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(Text, nullable=False)   # base64 image data
    caption = Column(String(255))
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
