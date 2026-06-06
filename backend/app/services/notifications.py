import os
import resend
from twilio.rest import Client
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load credentials from environment
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886") # Default Twilio Sandbox number

# Initialize clients if keys are present
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

def send_whatsapp(to_number, message):
    """Utility to send WhatsApp via Twilio"""
    if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN]):
        logger.warning("Twilio credentials missing. Skipping WhatsApp.")
        return False
    
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        # Twilio WhatsApp requires numbers in E.164 format and prefixed with 'whatsapp:'
        formatted_to = f"whatsapp:{to_number}" if not to_number.startswith("whatsapp:") else to_number
        
        msg = client.messages.create(
            from_=TWILIO_WHATSAPP_NUMBER,
            body=message,
            to=formatted_to
        )
        logger.info(f"WhatsApp sent: {msg.sid}")
        return True
    except Exception as e:
        logger.error(f"Failed to send WhatsApp: {e}")
        return False

def send_email(to_email, subject, html_content):
    """Utility to send Email via Resend"""
    if not RESEND_API_KEY:
        logger.warning("Resend API key missing. Skipping Email.")
        return False
    
    try:
        # Note: If using a free domain, 'to' must be the verified email
        params = {
            "from": "Retro Bikes <onboarding@resend.dev>",
            "to": [to_email],
            "subject": subject,
            "html": html_content
        }
        resend.Emails.send(params)
        logger.info(f"Email sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send Email: {e}")
        return False

def notify_booking_received(booking, bike_name):
    """Send confirmation that we received the booking request"""
    pickup_str = booking.pickup_date.strftime("%d %b %Y") if hasattr(booking.pickup_date, "strftime") else str(booking.pickup_date)
    
    # --- WhatsApp Content ---
    wa_message = (
        f"✅ *Booking Received!* \n\n"
        f"Hi {booking.customer_name},\n"
        f"We've received your booking for the *{bike_name}*.\n\n"
        f"📅 *Pickup:* {pickup_str} at {booking.pickup_time}\n"
        f"📍 *Location:* {booking.location}\n"
        f"💰 *Total:* ₹{booking.total_price}\n\n"
        f"We'll see you soon! Contact us if you have any questions."
    )
    
    # --- Email Content ---
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #f29325;">Booking Confirmed! 🏍️</h2>
        <p>Hi <strong>{booking.customer_name}</strong>,</p>
        <p>Thank you for choosing Retro Bikes. Your booking for the <strong>{bike_name}</strong> is confirmed.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Booking ID:</strong> #{booking.id}</p>
            <p style="margin: 5px 0;"><strong>Pickup:</strong> {pickup_str} at {booking.pickup_time}</p>
            <p style="margin: 5px 0;"><strong>Bike:</strong> {bike_name}</p>
        </div>
        <p><strong>Total Price:</strong> ₹{booking.total_price}</p>
        <p>Location: {booking.location}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">© 2026 Retro Bikes Pondicherry</p>
    </div>
    """
    
    if booking.customer_phone:
        send_whatsapp(booking.customer_phone, wa_message)
    if booking.customer_email:
        send_email(booking.customer_email, "Booking Confirmation - Retro Bikes", html_content)

def notify_payment_success(booking, bike_name):
    """Send the successful payment receipt (Bill)"""
    txn_id = booking.razorpay_payment_id if booking.razorpay_payment_id else "Manual Payment (Admin)"
    
    # --- WhatsApp Content ---
    wa_message = (
        f"🧾 *Payment Successful!* \n\n"
        f"Hi {booking.customer_name},\n"
        f"Your payment for Booking #{booking.id} has been received.\n\n"
        f"🏍️ *Bike:* {bike_name}\n"
        f"💳 *Transaction ID:* {txn_id}\n"
        f"💰 *Amount Paid:* ₹{booking.total_price}\n\n"
        f"Thank you for your business!"
    )
    
    # --- Email Content ---
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #fff;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4CAF50; margin: 0;">Payment Receipt</h1>
            <p style="color: #666;">Booking #{booking.id}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0;"><strong>Item</strong></td>
                <td style="padding: 10px 0; text-align: right;"><strong>Amount</strong></td>
            </tr>
            <tr>
                <td style="padding: 15px 0;">Rental for {bike_name}</td>
                <td style="padding: 15px 0; text-align: right;">₹{booking.total_price}</td>
            </tr>
            <tr style="border-top: 2px solid #333;">
                <td style="padding: 15px 0;"><strong>Total Paid</strong></td>
                <td style="padding: 15px 0; text-align: right; font-size: 20px; color: #333;"><strong>₹{booking.total_price}</strong></td>
            </tr>
        </table>
        <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #166534;">Payment Reference: {txn_id}</p>
        </div>
        <p style="margin-top: 30px; text-align: center; font-size: 14px; color: #888;">Thank you for riding with Retro Bikes!</p>
    </div>
    """
    
    if booking.customer_phone:
        send_whatsapp(booking.customer_phone, wa_message)
    if booking.customer_email:
        send_email(booking.customer_email, "Payment Receipt - Retro Bikes", html_content)
