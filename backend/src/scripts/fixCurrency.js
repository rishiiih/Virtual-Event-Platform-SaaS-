import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';

// Load environment variables
dotenv.config();

const fixCurrency = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Find all events with USD currency or no currency set
    const eventsToUpdate = await Event.find({
      $or: [
        { currency: 'USD' },
        { currency: { $exists: false } },
        { currency: null }
      ]
    });

    console.log(`📊 Found ${eventsToUpdate.length} events with incorrect currency`);

    if (eventsToUpdate.length === 0) {
      console.log('✅ All events already have INR currency');
      process.exit(0);
    }

    // Update all events to INR
    const result = await Event.updateMany(
      {
        $or: [
          { currency: 'USD' },
          { currency: { $exists: false } },
          { currency: null }
        ]
      },
      {
        $set: { currency: 'INR' }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} events to INR currency`);

    // Show sample of updated events
    const updatedEvents = await Event.find({ currency: 'INR' })
      .select('title price currency')
      .limit(5);
    
    console.log('\n📋 Sample of updated events:');
    updatedEvents.forEach(event => {
      console.log(`  - ${event.title}: ₹${event.price} (${event.currency})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing currency:', error);
    process.exit(1);
  }
};

fixCurrency();
