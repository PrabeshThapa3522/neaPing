import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import serverRoutes from './routes/serverRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { createAdminUser } from './utils/createAdminUser.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start server
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nea-server-monitor');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create admin user on first run
    await createAdminUser();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});