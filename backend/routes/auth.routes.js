// Import necessary modules, controllers, and middleware
import express from "express";
import { login, logout, signup, getMe } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Protected route to get the authenticated user's details
router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router; // Export the router to be used in other parts of the app