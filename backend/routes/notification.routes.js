// Import necessary modules, controllers, and middleware
import express from "express";
import { getNotification, deleteNotifications, deleteNotification } from '../controllers/notification.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';


const router = express.Router(); // Create a new router instance

// Route to get all notifications for the authenticated user
router.get("/", protectRoute, getNotification);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotification);

export default router; // Export the router to be used in the main app