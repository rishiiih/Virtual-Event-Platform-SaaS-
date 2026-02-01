import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// Load environment variables
dotenv.config();

const fixAttendeeCount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all events
    const events = await Event.find({});
    
    console.log(`📊 Found ${events.length} events to check`);
    let fixedCount = 0;

    // Update each event's currentAttendees based on actual completed registrations
    for (const event of events) {
      // Count completed registrations for this event
      const actualAttendees = await Registration.countDocuments({
        event: event._id,
        paymentStatus: 'completed',
        status: { $ne: 'cancelled' }
      });

      if (event.currentAttendees !== actualAttendees) {
        const oldCount = event.currentAttendees;
        event.currentAttendees = actualAttendees;
        await event.save();
        console.log(`✅ Fixed event: ${event.title} (${oldCount} → ${actualAttendees})`);
        fixedCount++;
      }
    }

    if (fixedCount === 0) {
      console.log('\n✨ All events already have correct attendee counts!');
    } else {
      console.log(`\n🎉 Fixed ${fixedCount} events!`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixAttendeeCount();
