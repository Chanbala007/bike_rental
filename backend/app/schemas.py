from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Bike Schemas
class BikeBase(BaseModel):
    name: str
    engine_cc: str
    price_per_day: float
    image_url: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = "bike"
    status: str = "available"
    features: Optional[str] = None  # JSON string or comma-separated

class BikeCreate(BikeBase):
    pass

class BikeUpdate(BaseModel):
    name: Optional[str] = None
    engine_cc: Optional[str] = None
    price_per_day: Optional[float] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    features: Optional[str] = None

class BikeResponse(BikeBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Customer Schemas
class CustomerBase(BaseModel):
    first_name: str
    last_name: str
    phone: str
    email: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None

class CustomerResponse(CustomerBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CustomerAdminResponse(CustomerResponse):
    total_bookings: int = 0
    total_spent: float = 0.0

# Booking Schemas
class BookingBase(BaseModel):
    bike_id: int
    customer_id: Optional[int] = None  # Reference to customer if exists
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    pickup_date: datetime
    pickup_time: str
    drop_date: datetime
    drop_time: str
    location: str
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    total_price: float
    booking_source: Optional[str] = 'online'

class BookingCreate(BookingBase):
    pass

class WalkInBookingCreate(BookingBase):
    status: Optional[str] = 'confirmed'
    mark_bike_unavailable: Optional[bool] = True

class BookingResponse(BookingBase):
    id: int
    status: str
    booking_source: Optional[str] = 'online'
    picked_at: Optional[datetime] = None
    returned_at: Optional[datetime] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Gallery Schemas
class GalleryImageBase(BaseModel):
    image_url: str
    caption: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True

class GalleryImageCreate(GalleryImageBase):
    pass

class GalleryImageUpdate(BaseModel):
    caption: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

class GalleryImageResponse(GalleryImageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
