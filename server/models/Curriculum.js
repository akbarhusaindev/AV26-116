import mongoose from "mongoose";

const curriculumSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["learning", "mastered"], 
    default: "learning" 
  },
  bestScore: { 
    type: Number, 
    default: 0 
  },
  badge: { 
    type: String, 
    default: null 
  }, // "Gold", "Silver", "Bronze"
  attempts: { 
    type: Number, 
    default: 0 
  },
}, { timestamps: true });

export default mongoose.model("Curriculum", curriculumSchema);