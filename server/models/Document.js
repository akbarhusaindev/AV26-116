import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  text: String,
  chunkIndex: Number
});

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  fileUrl: String,
  fileType: String,
  extractedText: String,
  chunks: [chunkSchema]
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);