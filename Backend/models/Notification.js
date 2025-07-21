import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        link: {
            type: String, // Optional link for navigation on click
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
        collection: 'notifications',
    }
);

export default mongoose.model('Notification', notificationSchema); 