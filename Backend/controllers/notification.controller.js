import Notification from '../models/Notification.js';

// GET /api/notifications?userId=123 - Get all notifications for the specified user
export async function getNotifications(req, res) {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 }); // Show newest first
        res.json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

// PATCH /api/notifications/:id/read - Mark a specific notification as read
export async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        // No user check since no auth
        const notification = await Notification.findOneAndUpdate(
            { _id: id },
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(notification);
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

// PATCH /api/notifications/read-all - Mark all notifications as read for the user (optional, not used here)
export async function markAllAsRead(req, res) {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        await Notification.updateMany({ user: userId, read: false }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('Error marking all notifications as read:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

// DELETE /api/notifications/clear-all?userId=123 - Delete all notifications for the user
export async function clearAllNotifications(req, res) {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        await Notification.deleteMany({ user: userId });
        res.json({ message: 'All notifications cleared' });
    } catch (err) {
        console.error('Error clearing notifications:', err);
        res.status(500).json({ message: 'Server error' });
    }
} 