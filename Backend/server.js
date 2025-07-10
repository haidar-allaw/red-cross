// server.js (or index.js)
import dotenv from 'dotenv';
dotenv.config();                // ← must be first!

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import UserRouter from './routes/auth.routes.js';
import MedicalCenterRouter from './routes/center.routes.js';
import locationRoutes from './routes/location.routes.js';
import bloodRoutes from './routes/blood.routes.js';
import path from 'path';

const app = express();

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'Backend', 'uploads')));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_CONNECTION_STRING;

console.log('Mongo URI:', MONGO_URI);
app.use(cors());
app.use(express.json());
app.use('/api/users', UserRouter);
app.use('/api/centers', MedicalCenterRouter);
app.use('/api/locations', locationRoutes);
app.use('/api/blood', bloodRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅  Server listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  });
