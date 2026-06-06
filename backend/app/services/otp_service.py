from abc import ABC, abstractmethod
import os
from typing import Optional

class OTPProvider(ABC):
    @abstractmethod
    def send_otp(self, phone: str, otp: str, channel: str = "sms") -> None:
        """Send OTP to the given phone number via specified channel"""
        pass

class ConsoleOTPProvider(OTPProvider):
    def send_otp(self, phone: str, otp: str, channel: str = "sms") -> None:
        print(f"\n{'='*30}\n🔐 DEV OTP [{channel.upper()}] for {phone}: {otp}\n{'='*30}\n")

class TwilioWhatsAppProvider(OTPProvider):
    def __init__(self):
        try:
            from twilio.rest import Client
            self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
            self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
            self.whatsapp_number = os.getenv("TWILIO_WHATSAPP_NUMBER") # e.g., 'whatsapp:+14155238886'
            self.sms_number = os.getenv("TWILIO_SMS_NUMBER") # e.g., '+18777804236'
            
            if not all([self.account_sid, self.auth_token, self.whatsapp_number]):
                print("⚠️ Twilio credentials missing from environment variables")
                # In prod, you might want to raise an error here
                
            self.client = Client(self.account_sid, self.auth_token)
        except ImportError:
            print("⚠️ Twilio library not installed. Please install with `pip install twilio`")
            self.client = None

    def send_otp(self, phone: str, otp: str, channel: str = "sms") -> None:
        if not self.client:
            print(f"⚠️ Twilio client not initialized. Falling back to console: OTP for {phone} is {otp}")
            return

        try:
            # Ensure phone has country code. Assuming India (+91) if missing for now
            if not phone.startswith('+'):
                formatted_phone = f"+91{phone}" 
            else:
                formatted_phone = phone

            # Formatting based on channel
            if channel == "whatsapp":
                recipient = f"whatsapp:{formatted_phone}"
                sender = self.whatsapp_number
            else:
                recipient = formatted_phone
                sender = self.sms_number or self.whatsapp_number.replace("whatsapp:", "")

            message = self.client.messages.create(
                from_=sender,
                body=f"Your Bike Rental OTP is: {otp}. Valid for 5 minutes.",
                to=recipient
            )
            print(f"✅ OTP sent via {channel.upper()} to {formatted_phone}: {message.sid}")
        except Exception as e:
            print(f"❌ Failed to send OTP: {str(e)}")
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail=f"Twilio Error: {str(e)}")

def get_otp_provider() -> OTPProvider:
    provider_type = os.getenv("OTP_PROVIDER", "console").lower()
    
    if provider_type == "twilio_whatsapp":
        return TwilioWhatsAppProvider()
    else:
        return ConsoleOTPProvider()
