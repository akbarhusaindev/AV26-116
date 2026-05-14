import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    userEmail: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const discussionSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: String, // userEmail or userId
      },
    ],

    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Discussion", discussionSchema);