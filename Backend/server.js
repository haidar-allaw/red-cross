import dotenv from 'dotenv';        // loads process.env
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import UserRouter from './routes/user.routes.js'
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_CONNECTION_STRING;

app.use(cors());
app.use(express.json());

app.use('/api/users',UserRouter)
// Connect to MongoDB, then start listening
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅  Server listening at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  });
