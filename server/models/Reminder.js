import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  remindAt: { type: Date, required: true }, // The exact date & time to trigger
  isRead: { type: Boolean, default: false } // Turns true when the user dismisses it
}, { timestamps: true });

export default mongoose.model("Reminder", reminderSchema);