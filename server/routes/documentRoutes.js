import { Router } from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { 
  uploadDocument, 
  askDocument, 
  getDocuments 
} from "../controllers/documentController.js";

const router = Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.use(protect);

router.get("/", getDocuments);
router.post("/upload", upload.single("file"), uploadDocument);
router.post("/ask", askDocument);

export default router;