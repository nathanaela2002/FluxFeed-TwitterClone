// Import necessary modules, middleware, and controllers 
import express from "express";
import { protectRoute } from '../middleware/protectRoute.js';
import {
    followUnFollowUser,
    getSuggestedUsers,
    getUserProfile,
    updateUser
} from '../controllers/user.controllers.js';

const router = express.Router(); // Create a router instance

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);

// Route to follow or unfollow a user by their ID
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.post("/update", protectRoute, updateUser);

export default router; // Export the router to be used in the main app