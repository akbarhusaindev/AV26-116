// import { Router } from "express";
// import { breakdownTask } from "../controllers/aiController.js";
// import { protect } from "../middleware/auth.js";

// const router = Router();

// router.post("/breakdown", protect, breakdownTask);

// export default router;
import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { breakdownTask, chatWithData } from "../controllers/aiController.js";

const router = Router();

// Endpoint for generating subtasks
router.post("/breakdown", breakdownTask);

// Endpoint for the RAG Chat Assistant (Protected)
router.post("/chat", protect, chatWithData);

export default router;