-- Fix image_url column to support base64 images
-- Run this in pgAdmin or psql

ALTER TABLE bikes 
ALTER COLUMN image_url TYPE TEXT;

