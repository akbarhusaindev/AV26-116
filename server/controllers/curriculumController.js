import axios from "axios";
import Curriculum from "../models/Curriculum.js";

// 1. Generate Quiz Questions (Using Gemini 3.1)
export const generateQuiz = async (req, res) => {
  const { subject, description } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const prompt = `
      Generate a quiz with 10 multiple-choice questions about the subject "${subject}" focusing on "${description}".
      Return ONLY a JSON array in this format:
      [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": 0 
        }
      ]
      The "answer" field should be the index (0-3) of the correct option.
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleanText = rawText.split("```json").join("").split("```").join("").trim();
    
    res.json({ questions: JSON.parse(cleanText) });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate quiz" });
  }
};

// 2. Save Quiz Result & Award Mastery/Badges
export const saveResult = async (req, res) => {
  const { subjectId, score } = req.body;

  try {
    const curriculum = await Curriculum.findById(subjectId);
    if (!curriculum) return res.status(404).json({ message: "Subject not found" });

    curriculum.attempts += 1;
    if (score > curriculum.bestScore) curriculum.bestScore = score;

    // ✅ Mastery Logic: 70% to unlock status and delete option
    if (score >= 70) {
      curriculum.status = "mastered";
      if (score >= 90) curriculum.badge = "Gold";
      else if (score >= 80) curriculum.badge = "Silver";
      else curriculum.badge = "Bronze";
    }

    await curriculum.save();
    res.json(curriculum);
  } catch (err) {
    res.status(500).json({ message: "Failed to save result" });
  }
};

// 3. Add New Subject
export const addSubject = async (req, res) => {
  try {
    const newSub = new Curriculum({ ...req.body, user: req.user._id });
    await newSub.save();
    res.status(201).json(newSub);
  } catch (err) {
    res.status(500).json({ message: "Failed to add subject" });
  }
};

// 4. Get All Subjects
export const getCurriculums = async (req, res) => {
  try {
    const data = await Curriculum.find({ user: req.user._id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch" });
  }
};

// 5. Delete Subject (Mastery Protected)
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Curriculum.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // 🔒 Security Check: Only allow deletion if score was 70+
    if (subject.status !== "mastered") {
      return res.status(403).json({ 
        message: "Action Locked: You must score at least 70% to remove this subject from your curriculum!" 
      });
    }

    await Curriculum.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject successfully removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting subject" });
  }
};