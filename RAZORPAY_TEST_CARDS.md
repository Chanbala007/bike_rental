# Razorpay Test Cards for Indian Accounts

## Issue: "International cards are not supported"

If you're getting this error, it means the test card you're using is being treated as an international card. Use Indian test cards instead.

## ✅ Recommended Test Cards (Indian)

### Card 1: Visa (Recommended)
- **Card Number**: `5267 3181 8797 5449`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3 digits (e.g., `123`)
- **Name**: Any name
- **Type**: Visa (Indian)

### Card 2: Mastercard
- **Card Number**: `5104 0600 0000 0008`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3 digits (e.g., `123`)
- **Name**: Any name
- **Type**: Mastercard (Indian)

### Card 3: RuPay
- **Card Number**: `6074 8200 0000 0001`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3 digits (e.g., `123`)
- **Name**: Any name
- **Type**: RuPay (Indian)

## ❌ Avoid These (May Cause Issues)

- `4111 1111 1111 1111` - Sometimes treated as international
- Any card starting with `4` (Visa) may trigger international card error

## How to Use

1. Click "Proceed to Pay" on Booking Summary
2. Razorpay checkout opens
3. Enter one of the Indian test cards above
4. Enter any future expiry date
5. Enter any 3-digit CVV
6. Enter any name
7. Click "Pay"

## Payment Methods in Test Mode

You can also test with:
- **Netbanking**: Select any bank (test mode)
- **UPI**: Use test UPI IDs
- **Wallet**: Test wallet options

## Troubleshooting

### Still Getting "International Cards Not Supported"?

1. **Check your Razorpay account settings:**
   - Go to Razorpay Dashboard → Settings → Payment Methods
   - Make sure "International Cards" is enabled (if you want to test with international cards)
   - For Indian accounts, use Indian test cards instead

2. **Try different payment methods:**
   - Use Netbanking instead of cards
   - Use UPI if available
   - Use "Pay Later" option for testing

3. **Verify account type:**
   - Make sure you're using Test Mode keys
   - Check that your Razorpay account is set up for Indian payments

## Success Indicators

✅ Payment successful = You'll see:
- "Payment successful" message
- Redirect to booking success page
- Booking created in database

❌ Payment failed = You'll see:
- Error message in Razorpay modal
- Payment error in console
- No booking created

## Notes

- All test cards work in **Test Mode only**
- No real money is charged
- Test cards may vary based on your Razorpay account configuration
- If one card doesn't work, try another from the list above

