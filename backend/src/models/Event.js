import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  eventType: {
    type: String,
    enum: ['conference', 'workshop', 'webinar', 'meetup', 'seminar', 'other'],
    default: 'webinar'
  },
  category: {
    type: String,
    enum: ['technology', 'business', 'education', 'health', 'entertainment', 'other'],
    default: 'technology'
  },
  coverImage: {
    type: String,
    default: null // Cloudinary URL
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  maxAttendees: {
    type: Number,
    default: null // null means unlimited
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0 // 0 means free
  },
  currency: {
    type: String,
    default: 'USD'
  },
  isLive: {
    type: Boolean,
    default: false
  },
  liveStreamUrl: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    type: {
      type: String,
      enum: ['online', 'physical', 'hybrid'],
      default: 'online'
    },
    venue: String,
    address: String,
    city: String,
    country: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
eventSchema.index({ organizer: 1, status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ category: 1, status: 1 });

// Validate end date is after start date
eventSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  if (!this.maxAttendees) return false;
  return this.currentAttendees >= this.maxAttendees;
});

// Virtual for checking if event has started
eventSchema.virtual('hasStarted').get(function() {
  return new Date() >= this.startDate;
});

// Virtual for checking if event has ended
eventSchema.virtual('hasEnded').get(function() {
  return new Date() > this.endDate;
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
