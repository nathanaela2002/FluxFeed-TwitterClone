import express from "express";
import { protectRoute } from '../middleware/protectRoute.js';
import { followUnFollowUser, getSuggestedUsers, getUserProfile, updateUser } from '../controllers/user.controllers.js';

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.post("/update", protectRoute, updateUser);

export default router;