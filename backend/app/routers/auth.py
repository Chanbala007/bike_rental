from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from app.database import get_db
from app import models
import random
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey12345")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days login persistence

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

# Simple OTP store (In-memory, replace with Redis in prod)
otp_store = {}

class OTPRequest(BaseModel):
    phone: str
    channel: str = "sms"  # sms or whatsapp

class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    phone: str
    email: Optional[str] = None
    is_new_user: bool = False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(response: Response, token: str = None, db: Session = Depends(get_db)):
    """
    Get current user from cookie token
    Note: For 'depends', we usually extract from request.cookies. But here let's simplify.
    FastAPI doesn't automatically get cookie in Depends(oauth2_scheme).
    We'll assume the cookie key is 'auth_token'.
    """
    # This dependency will be used in routers. 
    # For now, we will handle cookie extraction in the path operation or use a reusable dependency.
    pass 

from fastapi import Cookie

async def get_user_from_cookie(auth_token: Optional[str] = Cookie(None), db: Session = Depends(get_db)):
    if not auth_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(auth_token, SECRET_KEY, algorithms=[ALGORITHM])
        phone: str = payload.get("sub")
        if phone is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user = db.query(models.Customer).filter(models.Customer.phone == phone).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


from app.services.otp_service import get_otp_provider

# ... imports ...

@router.post("/send-otp")
def send_otp(request: OTPRequest):
    """
    Generate and send OTP via configured provider
    """
    phone = request.phone.replace(" ", "").replace("-", "")[-10:] # Basic Sanitization
    
    if len(phone) != 10 or not phone.isdigit():
        raise HTTPException(status_code=400, detail="Invalid phone number")

    # Test Login Bypass for Cashfree KYC
    if phone == "9999999999":
        otp = "123456"
        expiry = datetime.utcnow() + timedelta(minutes=60)
        otp_store[phone] = {"otp": otp, "expiry": expiry}
        return {"message": "OTP sent successfully"}

    otp = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=5)
    
    otp_store[phone] = {"otp": otp, "expiry": expiry}
    
    # Use the OTP Service Provider
    provider = get_otp_provider()
    provider.send_otp(phone, otp, channel=request.channel)
    
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp")
def verify_otp(request: OTPVerifyRequest, response: Response, db: Session = Depends(get_db)):
    """
    Verify OTP, login/register, and set HTTP-only cookie
    """
    phone = request.phone.replace(" ", "").replace("-", "")[-10:]
    
    stored = otp_store.get(phone)
    
    if not stored:
        raise HTTPException(status_code=400, detail="OTP not sent or expired")
    
    if datetime.utcnow() > stored["expiry"]:
        del otp_store[phone]
        raise HTTPException(status_code=400, detail="OTP expired")
        
    if stored["otp"] != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    # OTP Valid - Clear it
    del otp_store[phone]
    
    # Check User
    user = db.query(models.Customer).filter(models.Customer.phone == phone).first()
    is_new_user = False
    
    if not user:
        is_new_user = True
        # Register simplified user
        user = models.Customer(
            first_name="Guest",
            last_name="User",
            phone=phone,
            email=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # Generate Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.phone}, expires_delta=access_token_expires
    )
    
    # Set Cookie
    response.set_cookie(
        key="auth_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="none",
        secure=True
    )
    
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "email": user.email,
            "is_new_user": is_new_user
        }
    }

@router.get("/me")
def read_users_me(current_user: models.Customer = Depends(get_user_from_cookie)):
    return {
        "id": current_user.id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "phone": current_user.phone,
        "email": current_user.email
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("auth_token")
    return {"message": "Logged out successfully"}

# --- Admin Authentication ---

class AdminLoginRequest(BaseModel):
    username: str
    password: str

async def get_current_admin(admin_token: Optional[str] = Cookie(None)):
    if not admin_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated as admin")
    try:
        payload = jwt.decode(admin_token, SECRET_KEY, algorithms=[ALGORITHM])
        role: str = payload.get("role")
        if role != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient privileges")
        return {"username": payload.get("sub")}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin token")

@router.post("/admin/login")
def admin_login(request: AdminLoginRequest, response: Response):
    if request.username == ADMIN_USERNAME and request.password == ADMIN_PASSWORD:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        # Create token specifically with role: admin
        access_token = create_access_token(
            data={"sub": request.username, "role": "admin"},
            expires_delta=access_token_expires
        )
        response.set_cookie(
            key="admin_token",
            value=access_token,
            httponly=True,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            samesite="none",
            secure=True
        )
        return {"message": "Admin login successful", "role": "admin"}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

@router.get("/admin/me")
def read_admin_me(current_admin = Depends(get_current_admin)):
    return current_admin

@router.post("/admin/logout")
def admin_logout(response: Response):
    response.delete_cookie("admin_token")
    return {"message": "Admin logged out successfully"}
