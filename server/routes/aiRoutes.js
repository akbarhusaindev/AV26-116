// import { Router } from "express";
// import { breakdownTask } from "../controllers/aiController.js";
// import { protect } from "../middleware/auth.js";

// const router = Router();

// router.post("/breakdown", protect, breakdownTask);

// export default router;

import { Router } from "express";
import { breakdownTask } from "../controllers/aiController.js";

const router = Router();

router.post("/breakdown", breakdownTask);

export default router;