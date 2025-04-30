import User from '../models/userModel.js';

export const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        isAdmin: true,
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};