import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, clearAllNotifications } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/authenticate.js'; // Assuming you have this middleware

const router = express.Router();

// All routes are protected and require a logged-in user
router.get('/', getNotifications);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/read-all', authenticate, markAllAsRead);
router.delete('/clear-all', clearAllNotifications);

export default router; 