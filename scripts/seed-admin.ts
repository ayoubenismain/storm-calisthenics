import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const email = process.env.ADMIN_SEED_EMAIL || 'admin@stormbarz.com';
    const password = process.env.ADMIN_SEED_PASSWORD || 'stormadmin123';

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = new User({
      name: 'Storm Admin',
      email,
      passwordHash,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
