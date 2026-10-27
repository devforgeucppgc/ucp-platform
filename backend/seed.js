const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AuthService = require('./src/modules/auth/auth.service');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminData = {
      fullName: 'Default Admin',
      email: 'admin@ucp.com',
      password: 'admin123',
      role: 'super-admin',
      isActive: true,
    };

    console.log('Creating default admin user...');
    const admin = await AuthService.registerAdmin(adminData);
    console.log('Admin user created successfully:');
    console.log(admin);

  } catch (error) {
    if (error.message === 'DUPLICATE_RESOURCE') {
      console.log('Admin user with that email already exists.');
    } else {
      console.error('Error seeding admin:', error.message);
    }
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedAdmin();
