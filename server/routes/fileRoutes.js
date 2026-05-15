// import express from "express";
// import multer from "multer";
// import { uploadFile, askFile, getFiles } from "../controllers/fileController.js";

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// router.post("/upload", upload.single("file"), uploadFile);
// router.post("/ask", askFile);
// router.get("/all", getFiles); 

// export default router;

import express from "express";
import multer from "multer";
import { uploadFile, askFile, getFiles } from "../controllers/fileController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);
router.post("/ask", askFile);
router.get("/all", getFiles);

export default router;