"""
Migration script to add customer_id column to bookings table
Run this once to update the database schema
"""
from app.database import engine
from sqlalchemy import text

def migrate_customer_id():
    """Add customer_id column to bookings table if it doesn't exist"""
    try:
        with engine.connect() as conn:
            # Check if column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'bookings' AND column_name = 'customer_id'
            """))
            row = result.fetchone()
            
            if not row:
                print("Adding customer_id column to bookings table...")
                conn.execute(text("ALTER TABLE bookings ADD COLUMN customer_id INTEGER"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id)"))
                conn.commit()
                print("✅ Successfully added customer_id column to bookings table")
            else:
                print("✅ customer_id column already exists in bookings table")
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        raise

if __name__ == "__main__":
    migrate_customer_id()

