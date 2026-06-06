# Razorpay Test vs Live API Credentials - Complete Guide

## Understanding Test vs Live Mode

### Test Mode (Current Setup)
- **Purpose**: Development and testing
- **Money**: No real money involved
- **When to use**: During development, testing, local development
- **Credentials**: Start with `rzp_test_...`
- **Status**: You're currently using this ✅

### Live Mode (Production)
- **Purpose**: Real transactions with real money
- **Money**: Real money is charged and transferred
- **When to use**: When your website is live and ready for customers
- **Credentials**: Start with `rzp_live_...`
- **Status**: Only use after going live

## How to Get Live API Credentials

### Step 1: Complete Account Activation

1. **Log in to Razorpay Dashboard**
   - Go to https://dashboard.razorpay.com/
   - Make sure you're logged in

2. **Complete KYC/Verification**
   - Go to **Account & Settings** → **KYC Details**
   - Submit all required documents:
     - Business registration documents
     - Bank account details
     - Identity proof
     - Address proof
   - Wait for approval (usually 24-48 hours)

3. **Activate Your Account**
   - Complete all verification steps
   - Razorpay will review and activate your account
   - You'll receive email confirmation when activated

### Step 2: Switch to Live Mode

1. **In Razorpay Dashboard**
   - Look for the orange banner: "You are currently in test mode"
   - Click **"Enable Live Mode →"** button
   - OR go to **Account & Settings** → **Account Details**
   - Toggle "Test Mode" OFF (switch to Live Mode)

2. **Complete Live Mode Setup**
   - You may need to:
     - Add bank account details
     - Complete additional verification
     - Accept terms and conditions

### Step 3: Get Live API Keys

1. **Navigate to API Keys**
   - Go to **Settings** → **API Keys**
   - OR **Account & Settings** → **API Keys**

2. **Generate Live Keys**
   - You'll see two sections:
     - **Test Keys** (what you're using now)
     - **Live Keys** (for production)
   - Click **"Generate Live Keys"** or **"Create Live Key"**
   - Copy your Live Key ID and Secret:
     - **Live Key ID**: `rzp_live_xxxxxxxxxxxxx`
     - **Live Key Secret**: `xxxxxxxxxxxxxxxxxxxxxxxx`

3. **Save Securely**
   - ⚠️ **IMPORTANT**: Never commit live keys to version control
   - Store them securely
   - Use environment variables

## When to Use Test vs Live Credentials

### ✅ Use TEST Credentials When:
- ✅ Developing locally (`localhost`)
- ✅ Testing the application
- ✅ Learning/experimenting
- ✅ Website is not live yet
- ✅ No real customers yet
- ✅ **Current situation** - You should keep using test credentials

### ✅ Use LIVE Credentials When:
- ✅ Website is deployed and live
- ✅ Real customers will make payments
- ✅ Ready to accept real money
- ✅ Account is fully activated
- ✅ KYC is completed
- ✅ You want real transactions

## Can You Use Live Credentials in Local Development?

### ⚠️ **NOT RECOMMENDED**

**Why not:**
- Real money will be charged
- Real transactions will be created
- You'll be charged Razorpay fees
- Difficult to test without spending money
- Risk of accidental charges

**Better approach:**
- Use **Test credentials** for local development
- Use **Live credentials** only on production server
- Switch based on environment (dev vs production)

## Recommended Setup

### Development Environment (Local)
```env
# backend/.env (Development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### Production Environment (Live Server)
```env
# backend/.env (Production)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

## Environment-Based Configuration

You can set up your app to automatically use the right credentials:

### Backend (.env)
```env
# Development
ENVIRONMENT=development
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Production (on live server)
ENVIRONMENT=production
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### Frontend (.env)
```env
# Development
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:8000/api

# Production
VITE_ENVIRONMENT=production
VITE_API_URL=https://yourdomain.com/api
```

## Current Recommendation for You

### ✅ **Keep Using Test Credentials**

**Why:**
- You're still in development
- Website is not live yet
- Testing and learning
- No real customers yet
- No real money needed

**When to switch to Live:**
- ✅ Website is deployed and live
- ✅ Real customers will use it
- ✅ Account is activated
- ✅ KYC is completed
- ✅ Ready to accept real payments

## Steps to Get Live Credentials (For Future)

1. **Complete Account Activation**
   - Finish KYC verification
   - Wait for approval

2. **Enable Live Mode**
   - Click "Enable Live Mode" in dashboard
   - Complete setup steps

3. **Generate Live Keys**
   - Settings → API Keys → Generate Live Keys
   - Copy and save securely

4. **Update Production Environment**
   - Add live keys to production server `.env`
   - Never commit to git
   - Keep test keys for development

## Security Best Practices

### ✅ DO:
- ✅ Use test keys for development
- ✅ Use live keys only in production
- ✅ Store keys in environment variables
- ✅ Never commit keys to git
- ✅ Use different keys for dev/prod
- ✅ Rotate keys if compromised

### ❌ DON'T:
- ❌ Use live keys in local development
- ❌ Commit API keys to git
- ❌ Share keys publicly
- ❌ Use same keys for dev/prod
- ❌ Hardcode keys in code

## Summary

**For Now (Development):**
- ✅ Keep using **Test credentials** (`rzp_test_...`)
- ✅ Continue developing locally
- ✅ Test with test cards
- ✅ No need for live credentials yet

**For Later (Production):**
- ✅ Complete account activation
- ✅ Get live credentials
- ✅ Use only on live server
- ✅ Keep test credentials for dev

## Quick Answer

**Q: Should I get live credentials now?**
**A: No, keep using test credentials for development. Get live credentials only when your website is live and ready for real customers.**

**Q: Can I use live credentials locally?**
**A: Not recommended. You'll be charged real money. Use test credentials for local development.**

**Q: When should I switch to live?**
**A: Only when your website is deployed, account is activated, and you're ready to accept real payments from customers.**

