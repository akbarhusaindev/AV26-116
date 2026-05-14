// import mongoose from "mongoose";

// const replySchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     text: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const postSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     replies: [replySchema],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Post", postSchema);

import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    
    // 👇 The images array to hold Cloudinary URLs
    images: { 
      type: [String], 
      default: [] 
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);