import mongoose from 'mongoose';
// Import required models
import User from './user';
import Room from './room';
import Company from './company';

const connectDb = () => {
  // Test DB Settings
  if (process.env.TEST_DATABASE_URL) {
    return mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  // Production DB settings
  if (process.env.DATABASE_URL) {
    return mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }
};

const models = { User, Room, Company };

export { connectDb };

export default models;
