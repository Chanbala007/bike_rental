-- Add customer_id column to bookings table
-- Run this in pgAdmin or psql

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS customer_id INTEGER;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);

-- Add foreign key constraint (optional, but recommended)
-- ALTER TABLE bookings 
-- ADD CONSTRAINT fk_bookings_customer 
-- FOREIGN KEY (customer_id) REFERENCES customers(id);

