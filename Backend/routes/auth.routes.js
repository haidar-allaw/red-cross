// routes/auth.routes.js
import express from 'express';
import { signup, login, getUserCount, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

// POST /api/users/signup
router.post('/signup', signup);
router.get('/getAll', getUsers);

// POST /api/users/login
router.post('/login', login);
router.get('/count', getUserCount);

// User management routes
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
