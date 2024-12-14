// Import necessary models
import Notification from '../models/notification.model.js';

// Controller to get notifications for the current user
export const getNotification = async(req, res) => {
    try {
        // Get the current user's ID from the request
        const userId = req.user._id;

        // Find notifications sent to the user and populate 'from' field with username and profile image
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: "from",
                select: "username profileImg"
            });

        // Mark all notifications as read
        await Notification.updateMany({ to: userId }, { read: true });

        // Send the notifications in the response
        res.status(200).json(notifications);
    } catch (error) {
        // Log the error and send a server error response
        console.log("Error in getNotifications function: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller to delete all notifications for the current user
export const deleteNotifications = async(req, res) => {
    try {
        // Get the current user's ID from the request
        const userId = req.user._id;

        // Delete all notifications sent to the user
        await Notification.deleteMany({ to: userId });

        // Send a success message in the response
        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        // Log the error and send a server error response
        console.log("Error in deleteNotifications function", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

// Controller to delete a specific notification for the current user
export const deleteNotification = async(req, res) => {
    try {
        // Get the notification ID from the request parameters
        const notificationId = req.params.id;

        // Get the current user's ID from the request
        const userId = req.user._id;

        // Find the notification by ID
        const notification = await Notification.findById(notificationId);

        // If the notification doesn't exist, send a 404 error
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        // Check if the notification belongs to the current user
        if (notification.to.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not allowed to delete this notification" });
        }

        // Delete the notification
        await Notification.findByIdAndDelete(notificationId);

        // Send a success message in the response
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        // Log the error and send a server error response
        console.log("Error in deleteNotification function: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};