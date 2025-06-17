// server.js (or index.js)
import dotenv from 'dotenv';
dotenv.config();                // ← must be first!

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import UserRouter from './routes/auth.routes.js';

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_CONNECTION_STRING;

console.log('Mongo URI:', MONGO_URI);
app.use(cors());
app.use(express.json());
app.use('/api/users', UserRouter);

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
