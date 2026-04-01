import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const dbUrl =
      process.env.DATABASE_URL ||
      'mongodb://localhost:27017/nashzero';

    console.log(`Connecting to MongoDB at ${dbUrl}...`);

    await mongoose.connect(dbUrl);

    console.log('✓ MongoDB connected successfully');
  } catch (error: any) {
    console.error('✗ Database connection error:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error: any) {
    console.error('✗ Disconnect error:', error.message);
  }
};
