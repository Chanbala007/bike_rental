# Razorpay Setup for Development (No Live Website Required)

## Quick Setup Guide for Local Development

If your website is not live yet, you can still use Razorpay in **Test Mode** for development and testing.

## Step-by-Step Setup

### 1. During Razorpay Onboarding

When Razorpay asks for your website URL:

**Option A: Skip for Now (Recommended)**
- Click **"Add later"** button
- This allows you to proceed without providing a website URL
- You can add it later when your website is live

**Option B: Use Localhost**
- Enter: `http://localhost:5173`
- This is your local development server URL
- Works perfectly for testing

**Option C: Use Placeholder**
- Enter: `https://example.com` or any placeholder URL
- You can update this later in Settings

### 2. Get Test API Keys

1. After completing onboarding (or skipping website URL), go to:
   - **Settings** → **API Keys** → **Generate Test Keys**

2. Copy your keys:
   - **Key ID**: `rzp_test_xxxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Configure Your Backend

Add to `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Test Payment Flow

1. Start your development servers:
   ```bash
   # Backend
   cd backend
   python run.py
   
   # Frontend
   npm run dev
   ```

2. Go through booking process:
   - Add bike to cart
   - Select dates
   - Enter location
   - Register/login with phone
   - Click "Proceed to Pay"

3. Use Razorpay Test Cards (try in order):
   
   **Best Option - Indian Test Card:**
   - **Card Number**: `5267 3181 8797 5449`
   - **Expiry**: `12/25` (any future date)
   - **CVV**: `123` (any 3 digits)
   - **Name**: Any name
   
   **Alternative:**
   - **Card Number**: `5104 0600 0000 0008`
   - **Expiry**: `12/25`
   - **CVV**: `123`
   - **Name**: Any name
   
   **If you get "International cards not supported" error:**
   - Use the Indian test cards above (Option 1 or 2)
   - The `4111 1111 1111 1111` card sometimes triggers this error

4. Payment will process successfully in test mode!

## Important Points

✅ **Test Mode Works Without Live Website**
- You can develop and test everything locally
- No need to deploy your website
- No real money is charged

✅ **Update Website URL Later**
- When your website is live, you can:
  1. Go to Razorpay Dashboard → Settings
  2. Update your website URL
  3. Complete KYC verification (for live mode)

✅ **Switch to Live Mode When Ready**
- Only after your website is deployed
- Complete KYC verification
- Generate Live API Keys
- Update your `.env` file with live keys

## Common Questions

**Q: Can I test payments without a live website?**  
A: Yes! Test mode works perfectly with localhost or no website URL.

**Q: What happens if I click "Add later"?**  
A: You can proceed with onboarding and add the website URL later. Test mode will still work.

**Q: When do I need a live website?**  
A: Only when you want to accept real payments (Live Mode). For development, test mode is sufficient.

**Q: Can I change the website URL later?**  
A: Yes, you can update it anytime in Razorpay Dashboard → Settings.

## Next Steps

1. Complete Razorpay onboarding (skip website URL or use localhost)
2. Get test API keys
3. Configure backend `.env` file
4. Test payment flow with test cards
5. When website is live, update URL and switch to live mode

---

**You're all set!** You can now develop and test the payment integration without needing a live website. 🚀

