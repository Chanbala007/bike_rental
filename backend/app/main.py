from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import bikes, bookings, customers, payments

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bike Rental API",
    description="Backend API for Bike Rental Application",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(bikes.router, prefix="/api/bikes", tags=["bikes"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(customers.router, prefix="/api/customers", tags=["customers"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])
from app.routers import auth
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
from app.routers import gallery
app.include_router(gallery.router, prefix="/api/gallery", tags=["gallery"])

@app.get("/")
async def root():
    return {"message": "Bike Rental API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

