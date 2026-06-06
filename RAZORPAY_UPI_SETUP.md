# How to Enable UPI Payments in Razorpay

UPI payment options (GPay, PhonePe, Paytm, etc.) need to be enabled in your Razorpay Dashboard. **Important: UPI is NOT under "Wallets" - it's a separate payment method.**

## Step 1: Enable UPI in Razorpay Dashboard

1. **Log in to Razorpay Dashboard**
   - Go to https://dashboard.razorpay.com/
   - Log in with your account

2. **Navigate to Payment Configuration**
   - Click **Account & Settings** (gear icon) in the left sidebar
   - Click **Payment Configuration** tab
   - You should see cards for: Cards, Netbanking, Wallets, PayLater

3. **Look for UPI Section**
   - UPI might appear as a separate card (if your account has it enabled)
   - OR it might be under **"Cards"** configuration
   - OR you may need to activate your account first

4. **If UPI Card is Not Visible:**
   - **Complete Account Activation/KYC**: UPI often requires account activation
   - **Contact Razorpay Support**: UPI might need to be enabled by Razorpay support
   - **Check Account Status**: Some payment methods are only available after account verification

4. **Enable Specific UPI Apps (Optional)**
   - Under UPI, you can enable/disable specific apps:
     - Google Pay
     - PhonePe
     - Paytm
     - BHIM UPI
     - Others

5. **Save Changes**
   - Click **Save** or **Update** to apply changes

## Step 2: Verify Payment Methods

After enabling UPI:

1. **Check Payment Methods Status**
   - In Dashboard → Settings → Payment Methods
   - Verify UPI shows as "Enabled" or "Active"

2. **Test in Your App**
   - Go through the payment flow
   - UPI options should now appear in the Razorpay checkout

## Step 3: Code Configuration (Optional)

If you want to explicitly enable UPI in your code, you can modify the Razorpay options:

### Current Implementation

The payment options are set in `src/pages/BookingSummary.jsx`. Currently, we're using default Razorpay options which respect your dashboard settings.

### To Force Enable UPI (if needed)

You can add UPI-specific configuration:

```javascript
const options = {
  key: key_id,
  amount: orderResponse.amount,
  currency: orderResponse.currency,
  name: 'Bike Rental',
  description: `Booking for ${bike.name}`,
  order_id: order_id,
  
  // Enable UPI explicitly
  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
  },
  
  // Or specify which UPI apps to show
  upi: {
    flow: 'collect', // or 'intent'
    vpa: '', // Optional: pre-fill VPA
  },
  
  handler: async function (response) {
    // ... payment handler
  },
  // ... rest of options
}
```

## Common Issues

### Issue 1: UPI Still Not Showing

**Possible Causes:**
- UPI not enabled in dashboard
- Account verification incomplete
- Test mode limitations (some UPI apps may not work in test mode)

**Solutions:**
1. Double-check dashboard settings
2. Complete KYC verification if required
3. Try in live mode (after going live)

### Issue 2: Only Some UPI Apps Showing

**Solution:**
- In Razorpay Dashboard → Settings → Payment Methods → UPI
- Enable the specific apps you want (GPay, PhonePe, Paytm, etc.)

### Issue 3: UPI Works in Dashboard but Not in App

**Solution:**
- Clear browser cache
- Check if you're using the correct API keys (test vs live)
- Verify the Razorpay script is loading correctly

## Test Mode vs Live Mode

### Test Mode
- UPI may have limited functionality
- Some UPI apps might not work in test mode
- Use test UPI IDs if available

### Live Mode
- Full UPI functionality
- All enabled UPI apps work
- Real transactions

## UPI Test IDs (for Test Mode)

If available in test mode, you can use:
- **Test UPI ID**: `success@razorpay` or `failure@razorpay`
- Check Razorpay documentation for current test UPI IDs

## Additional Payment Methods

You can also enable:
- **Netbanking**: Bank transfers
- **Wallets**: Paytm, Mobikwik, etc.
- **Cards**: Credit/Debit cards
- **Pay Later**: EMI options

All of these are configured in the same **Settings → Payment Methods** section.

## Need Help?

- Razorpay Support: support@razorpay.com
- Razorpay Docs: https://razorpay.com/docs/payments/payment-methods/upi/
- Check your Razorpay Dashboard for payment method status

