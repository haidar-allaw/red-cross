// routes/auth.routes.js
import express from 'express';
import { signup, login, getUserCount } from '../controllers/user.controller.js';

const router = express.Router();

// POST /api/users/signup
router.post('/signup', signup);

// POST /api/users/login
router.post('/login', login);
router.get('/count',getUserCount)
export default router;
