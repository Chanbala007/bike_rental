"""
Migration script to change image_url column from VARCHAR(500) to TEXT
Run this once to fix the database schema
"""
from app.database import engine
from sqlalchemy import text

def migrate_image_column():
    """Alter image_url column to TEXT to support base64 images"""
    try:
        with engine.connect() as conn:
            # Check if column exists and is VARCHAR
            result = conn.execute(text("""
                SELECT data_type, character_maximum_length 
                FROM information_schema.columns 
                WHERE table_name = 'bikes' AND column_name = 'image_url'
            """))
            row = result.fetchone()
            
            if row:
                data_type, max_length = row
                if data_type == 'character varying' and max_length == 500:
                    print("Altering image_url column from VARCHAR(500) to TEXT...")
                    conn.execute(text("ALTER TABLE bikes ALTER COLUMN image_url TYPE TEXT"))
                    conn.commit()
                    print("✅ Successfully migrated image_url column to TEXT")
                else:
                    print(f"Column already migrated or different type: {data_type}")
            else:
                print("Column image_url not found. Table might not exist yet.")
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        raise

if __name__ == "__main__":
    migrate_image_column()

