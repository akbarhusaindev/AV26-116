import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createReminder, getActiveNotifications, markAsRead } from "../controllers/reminderController.js";

const router = Router();

router.use(protect); // Ensure user is logged in
router.post("/", createReminder);
router.get("/active", getActiveNotifications);
router.put("/:id/read", markAsRead);

export default router;