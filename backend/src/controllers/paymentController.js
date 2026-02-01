import Razorpay from 'razorpay';
import crypto from 'crypto';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// Lazy initialization function
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('❌ Razorpay credentials not found');
    console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
    console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');
    return null;
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully');
    return instance;
  } catch (error) {
    console.error('❌ Razorpay initialization failed:', error.message);
    return null;
  }
};

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured. Please contact support.'
      });
    }

    const { eventId } = req.body;
    const userId = req.user._id;

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is free
    if (event.price === 0) {
      return res.status(400).json({
        success: false,
        message: 'This event is free, no payment required'
      });
    }

    // Check if already registered with completed payment
    const existingRegistration = await Registration.findOne({
      event: eventId,
      attendee: userId,
      paymentStatus: 'completed',
      status: { $ne: 'cancelled' } // Exclude cancelled registrations
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Delete any old pending or cancelled registrations for this user and event
    await Registration.deleteMany({
      event: eventId,
      attendee: userId,
      $or: [
        { paymentStatus: 'pending' },
        { status: 'cancelled' }
      ]
    });

    // Check if event is full
    if (event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Create pending registration
    const registration = await Registration.create({
      event: eventId,
      attendee: userId,
      paymentStatus: 'pending',
      paymentAmount: event.price
    });

    // Convert price to paise (Razorpay uses smallest currency unit)
    const amount = Math.round(event.price * 100);

    console.log('💰 Creating Razorpay order:', {
      eventTitle: event.title,
      price: event.price,
      currency: event.currency,
      amount: amount
    });

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount,
      currency: event.currency || 'INR',
      receipt: `receipt_${registration._id}`,
      notes: {
        eventId: eventId.toString(),
        userId: userId.toString(),
        registrationId: registration._id.toString(),
        eventTitle: event.title
      }
    });

    // Update registration with order ID
    registration.transactionId = order.id;
    await registration.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        registration: {
          id: registration._id,
          eventTitle: event.title
        },
        userDetails: {
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Verify Payment Signature
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      registrationId 
    } = req.body;

    // Create signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Find and update registration
    const registration = await Registration.findById(registrationId)
      .populate('event', 'title startDate location imageUrl')
      .populate('attendee', 'name email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Update registration status
    registration.paymentStatus = 'completed';
    registration.status = 'registered';
    registration.stripePaymentIntentId = razorpay_payment_id;
    await registration.save();

    // Increment event attendee count
    await Event.findByIdAndUpdate(registration.event._id, {
      $inc: { currentAttendees: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        registration,
        paymentId: razorpay_payment_id
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

// Razorpay Webhook Handler
export const handleWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const webhookSignature = req.headers['x-razorpay-signature'];

  try {
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    // Handle different events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;

      default:
        console.log(`Unhandled event type ${event}`);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Handle successful payment
const handlePaymentCaptured = async (payment) => {
  try {
    const orderId = payment.order_id;
    const paymentId = payment.id;

    // Find registration by order ID
    const registration = await Registration.findOne({ 
      transactionId: orderId 
    });

    if (registration && registration.paymentStatus !== 'completed') {
      registration.paymentStatus = 'completed';
      registration.status = 'registered';
      registration.stripePaymentIntentId = paymentId;
      await registration.save();

      // Increment event attendee count
      await Event.findByIdAndUpdate(registration.event, {
        $inc: { currentAttendees: 1 }
      });

      console.log('Payment captured for registration:', registration._id);
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

// Handle failed payment
const handlePaymentFailed = async (payment) => {
  try {
    const orderId = payment.order_id;

    const registration = await Registration.findOne({ 
      transactionId: orderId 
    });

    if (registration) {
      console.log('Payment failed for registration:', registration._id);
      // Keep status as pending or delete registration after some time
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

// Get user's payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const payments = await Registration.find({
      attendee: userId,
      paymentStatus: 'completed'
    })
      .populate('event', 'title startDate imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        payments,
        count: payments.length
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
};

// Cancel pending payment
export const cancelPayment = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const userId = req.user._id;

    const registration = await Registration.findOne({
      _id: registrationId,
      attendee: userId,
      paymentStatus: 'pending'
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Pending payment not found'
      });
    }

    // Delete the pending registration
    await Registration.findByIdAndDelete(registrationId);

    res.status(200).json({
      success: true,
      message: 'Payment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel payment',
      error: error.message
    });
  }
};
