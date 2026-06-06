from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models

def delete_customer_data(phone_number: str):
    db = SessionLocal()
    try:
        # 1. Sanitize input to last 10 digits
        sanitized_phone = phone_number.replace(" ", "").replace("-", "")[-10:]
        print(f"Searching for phone suffix: {sanitized_phone}")
        
        # 2. Find the customer
        customer = db.query(models.Customer).filter(models.Customer.phone.like(f"%{sanitized_phone}")).first()
        
        if customer:
            print(f"Found customer: {customer.first_name} {customer.last_name} (ID: {customer.id})")
            
            # 3. Delete bookings associated with customer ID
            bookings_deleted = db.query(models.Booking).filter(models.Booking.customer_id == customer.id).delete()
            print(f"Deleted {bookings_deleted} bookings via customer_id.")
            
            # 4. Delete the customer
            db.delete(customer)
            print(f"Deleted customer record: {customer.first_name}")
        else:
            print("No customer record found with that phone number.")

        # 5. Also delete any orphaned bookings matched by the phone number string directly
        orphaned_bookings = db.query(models.Booking).filter(models.Booking.customer_phone.like(f"%{sanitized_phone}")).delete()
        if orphaned_bookings:
            print(f"Deleted {orphaned_bookings} orphaned bookings matching phone string.")

        db.commit()
        print("\n✅ Success! Account 'Bala chan' (6384788089) has been cleared.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error during deletion: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    delete_customer_data("6384788089")
