import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';

// Load environment variables
dotenv.config();

const fixAttendeeCount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all events with negative currentAttendees
    const events = await Event.find({ currentAttendees: { $lt: 0 } });
    
    console.log(`Found ${events.length} events with negative attendee count`);

    // Update each event to 0
    for (const event of events) {
      event.currentAttendees = 0;
      await event.save();
      console.log(`✅ Fixed event: ${event.title} (${event._id})`);
    }

    console.log('\n🎉 All events fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixAttendeeCount();
