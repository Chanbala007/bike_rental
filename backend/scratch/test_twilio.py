import os
from twilio.rest import Client
from dotenv import load_dotenv

# Load .env from current directory
load_dotenv('d:/nattu/bike-rental/backend/.env')

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
whatsapp_number = os.getenv("TWILIO_WHATSAPP_NUMBER")
sms_number = os.getenv("TWILIO_SMS_NUMBER")

print(f"SID: {account_sid}")
print(f"Token: {auth_token[:5]}...")
print(f"SMS Number: {sms_number}")

client = Client(account_sid, auth_token)

try:
    print("\nAttempting to send test SMS to +916384788089...")
    message = client.messages.create(
        from_=sms_number,
        body="Test message from RetroBikes backend script.",
        to="+916384788089"
    )
    print(f"✅ Success! SID: {message.sid}")
except Exception as e:
    print(f"❌ Failed: {str(e)}")
