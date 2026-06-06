# Razorpay Authentication Error - Troubleshooting Guide

## Error: "Authentication failed"

If you're getting an "Authentication failed" error when trying to create a payment order, follow these steps:

## Step 1: Verify Keys Are Loaded

1. **Check your backend terminal** when you start the server. You should see:
   ```
   ✅ Razorpay Key ID loaded: rzp_test_S...
   ✅ Razorpay client initialized successfully
   ```

2. **If you see warnings**, the keys aren't being loaded. Check:
   - Is your `.env` file in the `backend/` folder?
   - Are the variable names exactly: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`?
   - Did you restart the backend server after adding the keys?

## Step 2: Test Your Keys

1. **Visit the test endpoint** in your browser:
   ```
   http://localhost:8000/api/payments/test-keys
   ```

2. **Check the response:**
   - ✅ `"status": "success"` = Keys are valid
   - ❌ `"status": "error"` = Keys are invalid or account not activated

## Step 3: Verify Key Format

Your keys should look like:

**Key ID:**
- Test: `rzp_test_xxxxxxxxxxxxx` (starts with `rzp_test_`)
- Live: `rzp_live_xxxxxxxxxxxxx` (starts with `rzp_live_`)

**Key Secret:**
- A long string of random characters (usually 32+ characters)

## Step 4: Common Issues & Solutions

### Issue 1: Keys Not Found
**Symptoms:** Backend shows "Razorpay credentials not found"

**Solution:**
1. Check `.env` file is in `backend/` folder
2. Verify no extra spaces: `RAZORPAY_KEY_ID=rzp_test_xxx` (not `RAZORPAY_KEY_ID = rzp_test_xxx`)
3. Make sure there are no quotes around values
4. Restart backend server

### Issue 2: Authentication Failed
**Symptoms:** Error 401 or "Authentication failed"

**Solutions:**
1. **Verify keys are correct:**
   - Go to Razorpay Dashboard → Settings → API Keys
   - Regenerate keys if needed
   - Copy them exactly (no extra spaces)

2. **Check account status:**
   - Make sure your Razorpay account is activated
   - Complete onboarding if required
   - For test mode, you might need to complete basic details

3. **Key mismatch:**
   - Make sure you're using **Test Keys** for test mode
   - Don't mix test and live keys

4. **Restart backend:**
   - After updating `.env`, always restart the backend server
   - Environment variables are loaded at startup

### Issue 3: Account Not Activated
**Symptoms:** Keys load but authentication fails

**Solution:**
1. Complete Razorpay onboarding:
   - Go to Razorpay Dashboard
   - Complete all required steps
   - You can skip website URL for now (use "Add later")

2. Wait for activation:
   - Sometimes accounts need a few minutes to activate
   - Check your email for activation confirmation

## Step 5: Quick Test

Run this in your browser console or Postman:

```bash
# Test endpoint
GET http://localhost:8000/api/payments/test-keys

# Expected success response:
{
  "status": "success",
  "message": "Razorpay keys are valid",
  "account_id": "...",
  "key_id": "rzp_test_S..."
}
```

## Step 6: Verify .env File Format

Your `backend/.env` should look like this:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bike_rental_db
RAZORPAY_KEY_ID=rzp_test_S8Pr6tSBXnDzXHn
RAZORPAY_KEY_SECRET=rf7m0rJaVBjfzPeAM50rBUpC
```

**Important:**
- No spaces around `=`
- No quotes around values
- No trailing spaces
- Each variable on a new line

## Still Not Working?

1. **Double-check Razorpay Dashboard:**
   - Log in to https://dashboard.razorpay.com/
   - Go to Settings → API Keys
   - Verify keys match your `.env` file

2. **Regenerate Keys:**
   - In Razorpay Dashboard, delete old keys
   - Generate new test keys
   - Update `.env` file
   - Restart backend

3. **Check Backend Logs:**
   - Look for error messages when server starts
   - Check for any Python import errors

4. **Test with curl:**
   ```bash
   curl http://localhost:8000/api/payments/test-keys
   ```

## Need More Help?

- Razorpay Support: support@razorpay.com
- Razorpay Docs: https://razorpay.com/docs/
- Check backend terminal for detailed error messages

