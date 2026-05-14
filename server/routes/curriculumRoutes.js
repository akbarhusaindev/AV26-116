import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { 
  addSubject, 
  getCurriculums, 
  generateQuiz, 
  saveResult,
  deleteSubject
} from "../controllers/curriculumController.js";

const router = Router();

// All curriculum routes are protected (require login)
router.use(protect);

router.get("/", getCurriculums);
router.post("/", addSubject);
router.post("/generate-quiz", generateQuiz);
router.post("/save-result", saveResult);
router.delete("/:id", protect, deleteSubject);

export default router;