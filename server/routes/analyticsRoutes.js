import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getDashboardAnalytics } from "../controllers/analyticsController.js";

const router = Router();

router.get("/", protect, getDashboardAnalytics);

export default router;