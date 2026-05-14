// import { Router } from "express";
// import {
//   createNote,
//   getNotes,
//   generateNoteAI,
// } from "../controllers/noteController.js";

// const router = Router();

// router.post("/", createNote);
// router.get("/:email", getNotes);
// router.post("/ai", generateNoteAI);

// export default router;

import { Router } from "express";
import { createNote, getNotes } from "../controllers/noteController.js";

const router = Router();

router.post("/", createNote);
router.get("/", getNotes);

export default router;