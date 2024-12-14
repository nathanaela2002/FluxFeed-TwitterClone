// Import necessary modules, middleware, and controllers 
import express from "express";
import { protectRoute } from '../middleware/protectRoute.js';
import {
    getUserPosts,
    getFollowingPosts,
    getLikedPosts,
    getAllPosts,
    likeUnlikePost,
    commentOnPost,
    createPost,
    deletePost
} from '../controllers/post.controllers.js';

const router = express.Router(); // Create a router instance

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);

// Route to get posts liked by a specific user
router.get("/likes/:id", protectRoute, getLikedPosts);

// Route to like or unlike a specific post
router.post("/like/:id", protectRoute, likeUnlikePost);

router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/comment/:id", protectRoute, commentOnPost);

// Route
export default router;