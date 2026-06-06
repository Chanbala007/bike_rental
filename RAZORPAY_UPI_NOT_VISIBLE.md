# UPI Not Showing in Razorpay Dashboard - Solutions

## Problem: No UPI Option in Payment Configuration

If you don't see UPI options (Google Pay, PhonePe, Paytm UPI) in your Razorpay Payment Configuration, here are the solutions:

## Solution 1: Complete Account Activation

UPI is often only available after account activation:

1. **Check Account Status**
   - Go to **Account & Settings** → **Account Details**
   - Look for activation status
   - Complete any pending verification steps

2. **Complete KYC**
   - UPI requires full KYC verification
   - Go to **Account & Settings** → **KYC Details**
   - Complete all required documents

3. **Activate Account**
   - Look for "Activate Account" button
   - Complete the activation process
   - Wait for approval (usually 24-48 hours)

## Solution 2: Contact Razorpay Support

If UPI is still not visible:

1. **Email Support**
   - Email: support@razorpay.com
   - Subject: "Enable UPI Payment Method"
   - Include your account details

2. **Live Chat**
   - Click "Help & Support" button (bottom right)
   - Request UPI activation

3. **What to Ask**
   - "I need to enable UPI payment method (Google Pay, PhonePe, Paytm UPI)"
   - "My account is in test mode, can I enable UPI for testing?"
   - "What are the requirements to enable UPI?"

## Solution 3: Check Test Mode Limitations

**Important**: In Test Mode, UPI might have limited availability:

- Some UPI apps may not work in test mode
- You might need to switch to Live Mode (after activation)
- Test UPI IDs might be required

## Solution 4: Alternative - Use UPI Intent Flow

Even if UPI doesn't appear in dashboard, you can enable it via code:

### Update BookingSummary.jsx

Add UPI-specific configuration:

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
  
  // UPI Intent Flow (works even if not in dashboard)
  upi: {
    flow: 'intent', // or 'collect'
  },
  
  handler: async function (response) {
    // ... payment handler
  },
  // ... rest of options
}
```

## Solution 5: Check Payment Methods API

You can check which payment methods are available via API:

1. **Test Endpoint** (in your backend):
   ```python
   # Add this to payments.py
   @router.get("/available-methods")
   def get_available_methods():
       # This will show what's enabled in your account
       # Check Razorpay API docs for this endpoint
   ```

## Solution 6: Use Alternative Payment Methods

While waiting for UPI activation:

1. **Cards**: Already working (test cards available)
2. **Netbanking**: Enable in Payment Configuration
3. **Wallets**: Paytm Wallet, Mobikwik (different from UPI)
4. **Pay Later**: EMI options

## Why UPI Might Not Be Visible

1. **Account Not Activated**: UPI requires activated account
2. **KYC Incomplete**: Full KYC needed for UPI
3. **Test Mode**: Limited UPI in test mode
4. **Account Type**: Some account types don't support UPI initially
5. **Regional Restrictions**: UPI availability varies by region

## Quick Checklist

- [ ] Account activated?
- [ ] KYC completed?
- [ ] Contacted Razorpay support?
- [ ] Checked if UPI appears after activation?
- [ ] Tried enabling via code (UPI Intent flow)?

## Recommended Action

1. **First**: Complete account activation and KYC
2. **Then**: Contact Razorpay support to enable UPI
3. **Meanwhile**: Use cards, netbanking, or wallets for testing
4. **After Activation**: UPI should appear in Payment Configuration

## Test Mode Workaround

For testing purposes, you can:
- Use test cards (already working)
- Use netbanking test mode
- Use wallet options available
- Wait for UPI activation for production

## Need Immediate Help?

- **Razorpay Support**: support@razorpay.com
- **Live Chat**: Click "Help & Support" in dashboard
- **Documentation**: https://razorpay.com/docs/payments/payment-methods/upi/

