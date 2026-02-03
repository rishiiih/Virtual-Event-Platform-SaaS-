import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const updateIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const registrations = db.collection('registrations');

    // Drop the old unique index
    try {
      await registrations.dropIndex('event_1_attendee_1');
      console.log('✅ Dropped old unique index');
    } catch (error) {
      console.log('ℹ️  Old index not found or already dropped');
    }

    // Create new partial index (only for active statuses)
    await registrations.createIndex(
      { event: 1, attendee: 1 },
      {
        unique: true,
        partialFilterExpression: { 
          status: { $in: ['registered', 'attended', 'no-show'] }
        }
      }
    );
    console.log('✅ Created new partial unique index (excludes cancelled registrations)');

    await mongoose.connection.close();
    console.log('✅ Index update complete!');
  } catch (error) {
    console.error('❌ Error updating index:', error);
    process.exit(1);
  }
};

updateIndex();
