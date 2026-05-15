// import mongoose from "mongoose";

// const chunkSchema = new mongoose.Schema({
//   text: { type: String },
//   chunkIndex: { type: Number },
// });

// const fileSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     title: { type: String, required: true },
//     fileUrl: { type: String, required: true },
//     fileType: { type: String, required: true },
//     extractedText: { type: String },
//     chunks: [chunkSchema],
//   },
//   { timestamps: true }
// );

// // ✅ Compiled as "File" instead of "Document"
// const FileModel = mongoose.models.File || mongoose.model("File", fileSchema);

// export default FileModel;

import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  text: String,
  chunkIndex: Number,
});

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    extractedText: String,
    chunks: [chunkSchema],
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);