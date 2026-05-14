import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js"; 
import {
  createPost,
  getPosts,
  toggleLike,
  addReply,
} from "../controllers/postController.js";

const router = express.Router();

router.use(protect); // Ensure user is logged in

// 👇 Note the upload.single("image") middleware here
router.post("/", upload.single("image"), createPost); 

router.get("/", getPosts);
router.put("/:id/like", toggleLike);
router.post("/:id/reply", addReply);

export default router;