"""
Script to seed initial bike data into the database
Run this after setting up the database
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Bike
import json

def seed_bikes():
    db = SessionLocal()
    try:
        # Check if bikes already exist
        existing = db.query(Bike).count()
        if existing > 0:
            print(f"Database already has {existing} bikes. Skipping seed.")
            return

        bikes_data = [
            {
                "name": "Royal Enfield Classic 350",
                "engine_cc": "350cc",
                "price_per_day": 800.0,
                "image_url": "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&h=600&fit=crop",
                "description": "Classic cruiser with timeless design. Perfect for long rides along the coast.",
                "status": "available",
                "features": json.dumps(["ABS", "Fuel Injection", "LED Lights", "Comfortable Seating"])
            },
            {
                "name": "Yamaha MT-15",
                "engine_cc": "155cc",
                "price_per_day": 600.0,
                "image_url": "https://images.unsplash.com/photo-1558980664-1a0cf9a3e9a5?w=800&h=600&fit=crop",
                "description": "Sporty and agile. Great for city rides and short trips.",
                "status": "available",
                "features": json.dumps(["ABS", "Digital Display", "LED Headlight", "Sporty Design"])
            },
            {
                "name": "Honda CB Shine",
                "engine_cc": "125cc",
                "price_per_day": 400.0,
                "image_url": "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&h=600&fit=crop",
                "description": "Reliable and fuel-efficient. Ideal for daily commuting.",
                "status": "available",
                "features": json.dumps(["Fuel Efficient", "Easy Handling", "Comfortable", "Low Maintenance"])
            },
            {
                "name": "Bajaj Pulsar 200",
                "engine_cc": "200cc",
                "price_per_day": 550.0,
                "image_url": "https://images.unsplash.com/photo-1558980664-1a0cf9a3e9a5?w=800&h=600&fit=crop",
                "description": "Powerful and stylish. Perfect for adventure enthusiasts.",
                "status": "unavailable",
                "features": json.dumps(["Powerful Engine", "Digital Console", "LED Tail Light", "Sporty Look"])
            },
            {
                "name": "TVS Apache RTR 160",
                "engine_cc": "160cc",
                "price_per_day": 500.0,
                "image_url": "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&h=600&fit=crop",
                "description": "Racing DNA with street performance. Built for speed lovers.",
                "status": "available",
                "features": json.dumps(["Racing DNA", "ABS", "Digital Speedometer", "Aggressive Styling"])
            },
            {
                "name": "Hero Splendor Plus",
                "engine_cc": "100cc",
                "price_per_day": 350.0,
                "image_url": "https://images.unsplash.com/photo-1558980664-1a0cf9a3e9a5?w=800&h=600&fit=crop",
                "description": "Economical and reliable. Best for budget-conscious riders.",
                "status": "available",
                "features": json.dumps(["Ultra Fuel Efficient", "Low Cost", "Easy Maintenance", "Comfortable"])
            }
        ]

        for bike_data in bikes_data:
            bike = Bike(**bike_data)
            db.add(bike)

        db.commit()
        print(f"Successfully seeded {len(bikes_data)} bikes into the database!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_bikes()

