# Stripe Payment Integration Setup Guide

## Overview
This guide explains how to set up and test the Stripe payment integration for paid events.

## Features Implemented
- ✅ Stripe Checkout Session for secure payments
- ✅ Payment webhook handling for automatic registration confirmation
- ✅ Payment success and cancel pages
- ✅ Payment history tracking
- ✅ Support for both free and paid events
- ✅ Automatic attendee count increment on successful payment

## Setup Instructions

### 1. Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Navigate to Developers > API keys

### 2. Get Your API Keys
You'll need two keys:
- **Publishable key**: starts with `pk_test_`
- **Secret key**: starts with `sk_test_`

### 3. Configure Backend Environment Variables

Add these to your `backend/.env` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Install Dependencies

**Backend:**
```bash
cd backend
npm install stripe
```

The frontend doesn't need the Stripe SDK since we're using Stripe Checkout (hosted).

### 5. Set Up Webhook (for Production)

For local development, you can use Stripe CLI:

```bash
# Install Stripe CLI
# Windows (using Chocolatey):
choco install stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/payment/webhook
```

Copy the webhook signing secret (starts with `whsec_`) and add it to your `.env` file.

## How It Works

### Payment Flow

1. **User clicks "Register Now"** on a paid event
2. **Frontend calls** `POST /api/payment/create-checkout-session`
3. **Backend creates**:
   - A pending registration in the database
   - A Stripe Checkout Session
4. **User is redirected** to Stripe's hosted checkout page
5. **User completes payment** on Stripe
6. **Stripe sends webhook** to `POST /api/payment/webhook`
7. **Backend updates**:
   - Registration status to "registered"
   - Payment status to "completed"
   - Event's currentAttendees count
8. **User is redirected** to `/payment/success` with confirmation

### File Structure

```
backend/
├── controllers/
│   └── paymentController.js      # Payment logic
├── routes/
│   └── paymentRoutes.js          # Payment endpoints
└── models/
    └── Registration.js           # Updated with Stripe fields

frontend/
├── pages/
│   ├── PaymentSuccessPage.jsx   # Success confirmation
│   └── PaymentCancelPage.jsx    # Cancellation page
├── utils/
│   └── paymentApi.js             # Payment API calls
└── App.jsx                       # Routes added
```

## API Endpoints

### Create Checkout Session
```
POST /api/payment/create-checkout-session
Body: { eventId: "event_id_here" }
Response: { sessionId, url }
```

### Verify Payment
```
GET /api/payment/verify/:sessionId
Response: { session, registration }
```

### Get Payment History
```
GET /api/payment/history
Response: { payments: [...] }
```

### Cancel Pending Payment
```
DELETE /api/payment/cancel/:registrationId
Response: { success: true }
```

### Webhook Handler
```
POST /api/payment/webhook
Headers: { stripe-signature }
Body: Stripe event object (raw)
```

## Testing the Integration

### Test Mode Cards (Stripe provides these)

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Declined Payment:**
- Card: `4000 0000 0000 0002`

**Requires Authentication (3D Secure):**
- Card: `4000 0025 0000 3155`

### Testing Flow

1. **Create a paid event**
   - Set price > 0 (e.g., $50)
   - Publish the event

2. **Register for the event**
   - Click "Register Now"
   - You'll be redirected to Stripe Checkout

3. **Complete payment**
   - Use test card: `4242 4242 4242 4242`
   - Enter any future expiry date
   - Enter any CVC code

4. **Verify success**
   - You should be redirected to `/payment/success`
   - Check the database - registration should show:
     - `paymentStatus: "completed"`
     - `status: "registered"`
     - `stripeSessionId` populated
   - Event's `currentAttendees` should increment

5. **Test cancellation**
   - Start checkout process
   - Click back/cancel button
   - Should redirect to `/payment/cancel`
   - Pending registration should be cleaned up

## Webhook Events Handled

- `checkout.session.completed` - Updates registration and attendee count
- `payment_intent.succeeded` - Logs successful payment
- `payment_intent.payment_failed` - Reverts to pending status

## Production Deployment

### On Render:

1. **Add environment variables:**
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

2. **Set up webhook endpoint:**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Click "Add endpoint"
   - URL: `https://your-backend-url.onrender.com/api/payment/webhook`
   - Events to send:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the webhook signing secret to your environment variables

3. **Deploy and test** with real test mode cards

## Security Notes

- ✅ Payment processing happens on Stripe's secure servers
- ✅ We never store credit card information
- ✅ Webhook signature verification prevents tampering
- ✅ User authentication required before checkout
- ✅ Event organizer verification for payment history

## Troubleshooting

**Webhook not working?**
- Check webhook secret is correct
- Ensure raw body parsing for webhook route
- Check Stripe Dashboard > Developers > Webhooks for failed events

**Payment successful but registration not updated?**
- Check webhook is receiving events
- Check server logs for errors
- Verify metadata is correctly set in checkout session

**Test card declined?**
- Make sure you're using test mode keys (`sk_test_`, not `sk_live_`)
- Try the standard test card: `4242 4242 4242 4242`

## Future Enhancements

- [ ] Refund handling
- [ ] Partial payments/deposits
- [ ] Discount codes
- [ ] Group registration discounts
- [ ] Payment installments
- [ ] Multiple currency support
- [ ] Invoice generation
- [ ] Email receipts

## Support

For Stripe-specific questions, check:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
