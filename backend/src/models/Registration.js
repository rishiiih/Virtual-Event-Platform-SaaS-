import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled', 'attended', 'no-show'],
    default: 'registered'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded', 'free'],
    default: 'free'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  transactionId: {
    type: String
  },
  stripeSessionId: {
    type: String
  },
  stripePaymentIntentId: {
    type: String
  },
  checkInTime: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate active registrations
// Partial index only applies to non-cancelled registrations, allowing re-registration
registrationSchema.index(
  { event: 1, attendee: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { 
      status: { $in: ['registered', 'attended', 'no-show'] }
    }
  }
);

// Index for queries
registrationSchema.index({ attendee: 1, status: 1 });
registrationSchema.index({ event: 1, status: 1 });

// Virtual to check if registration is active
registrationSchema.virtual('isActive').get(function() {
  return this.status === 'registered';
});

// Ensure virtuals are included in JSON output
registrationSchema.set('toJSON', { virtuals: true });
registrationSchema.set('toObject', { virtuals: true });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
