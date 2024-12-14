import mongoose from "mongoose";

// Define the schema for notifications
const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId, // User who triggered the notification
        ref: "User", // Reference to the User model
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId, // User who receives the notification
        ref: "User",
        required: true,
    },
    type: {
        type: String, // Type of notification 
        required: true,
        enum: ["follow", "like"], // Types
    },
    read: {
        type: Boolean, // Indicates if the notification has been read
        default: false,
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create and export the Notification model
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;