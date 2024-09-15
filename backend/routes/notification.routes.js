import express from "express";
import { getNotification, deleteNotifications, deleteNotification } from '../controllers/notification.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/", protectRoute, getNotification);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotification);

export default router;