# Razorpay Payment Integration Setup Guide

This guide will help you set up Razorpay payment gateway for the bike rental application.

## Prerequisites

1. A Razorpay account (Sign up at https://razorpay.com/)
2. Access to Razorpay Dashboard

## Step 1: Get Razorpay API Keys

1. **Log in to Razorpay Dashboard**
   - Go to https://dashboard.razorpay.com/
   - Log in with your account

2. **Complete Onboarding (If Required)**
   - If you see the onboarding page asking for website URL:
     - **Option 1**: Click "Add later" to skip for now (recommended for development)
     - **Option 2**: Enter `http://localhost:5173` (your local development URL)
     - **Option 3**: Enter a placeholder like `https://example.com` (you can update later)
   - Complete other basic details as required
   - You can always update the website URL later in Settings

3. **Get Test/Live Keys**
   - For **Testing**: Go to Settings → API Keys → Generate Test Keys
   - For **Production**: Go to Settings → API Keys → Generate Live Keys (only after website is live)
   - You'll get:
     - **Key ID** (e.g., `rzp_test_xxxxxxxxxxxxx`)
     - **Key Secret** (e.g., `xxxxxxxxxxxxxxxxxxxxxxxx`)

## Step 2: Configure Backend Environment Variables

1. **Open or create** `backend/.env` file:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/bike_rental

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

2. **Replace the values** with your actual Razorpay keys:
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret

## Step 3: Install Dependencies

### Backend
```bash
cd backend
pip install -r requirements.txt
```

This will install the `razorpay` Python package.

### Frontend
```bash
npm install
```

This will install the `razorpay` React package.

## Step 4: Restart Backend Server

After adding the environment variables, restart your backend server:

```bash
cd backend
python run.py
```

Or if using uvicorn directly:
```bash
uvicorn app.main:app --reload --port 8000
```

## Step 5: Test the Integration

1. **Start both servers:**
   - Backend: `http://localhost:8000`
   - Frontend: `http://localhost:5173`

2. **Test Payment Flow:**
   - Go through the booking process
   - On the Booking Summary page, click "Proceed to Pay"
   - Use Razorpay test cards (choose one that works):
     
     **Option 1: Indian Test Card (Recommended)**
     - **Card Number**: `5267 3181 8797 5449`
     - **Expiry**: Any future date (e.g., `12/25`)
     - **CVV**: Any 3 digits (e.g., `123`)
     - **Name**: Any name
     
     **Option 2: Alternative Indian Test Card**
     - **Card Number**: `5104 0600 0000 0008`
     - **Expiry**: Any future date (e.g., `12/25`)
     - **CVV**: Any 3 digits (e.g., `123`)
     - **Name**: Any name
     
     **Option 3: If above don't work, try:**
     - **Card Number**: `4111 1111 1111 1111`
     - **Expiry**: `12/25`
     - **CVV**: `123`
     - **Name**: Any name
     - **Note**: If you get "International cards not supported", use Option 1 or 2 instead

3. **Verify:**
   - Payment should process successfully
   - Booking should be created in database
   - You should be redirected to success page

## Important Notes

### Test Mode vs Live Mode

- **Test Mode**: 
  - Use test keys and test cards. No real money is charged.
  - **No live website required** - perfect for development
  - Works with `localhost` and any local development URL
  - You can test the entire payment flow without deploying

- **Live Mode**: 
  - Use live keys. Real money will be charged.
  - **Requires a live website** - Razorpay needs to verify your domain
  - Only switch to live mode when your website is deployed and ready for production

### Website URL for Development

- **For Development/Testing**: 
  - You can use `http://localhost:5173` (your Vite dev server)
  - Or click "Add later" during onboarding
  - Test mode works perfectly without a live website

- **For Production**: 
  - You'll need to provide your actual domain (e.g., `https://yourdomain.com`)
  - Razorpay will verify the domain before enabling live payments

### Security

⚠️ **Never commit your `.env` file to version control!**

- Add `backend/.env` to `.gitignore`
- Keep your Key Secret secure
- Never expose keys in frontend code

### Webhook Setup (Optional, for Production)

For production, set up webhooks to handle payment status updates:

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`

## Troubleshooting

### Error: "Payment service is not configured"

- Check that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in `backend/.env`
- Restart the backend server after adding environment variables

### Error: "Invalid signature"

- Make sure you're using the correct Key ID and Secret
- Ensure keys match (test keys with test mode, live keys with live mode)

### Payment modal not opening

- Check browser console for errors
- Ensure Razorpay script is loaded: `https://checkout.razorpay.com/v1/checkout.js`
- Check network tab for API call errors

### Payment succeeds but booking not created

- Check backend logs for errors
- Verify database connection
- Check that booking data is being sent correctly

## Support

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com

