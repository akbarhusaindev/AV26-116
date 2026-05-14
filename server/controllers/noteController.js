// import Note from "../models/noteModel.js";
// import axios from "axios";

// // CREATE NOTE
// export const createNote = async (req, res) => {
//   try {
//     const note = await Note.create(req.body);
//     res.json(note);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to create note" });
//   }
// };

// // GET NOTES
// export const getNotes = async (req, res) => {
//   try {
//     const notes = await Note.find({ userEmail: req.params.email }).sort({
//       createdAt: -1,
//     });

//     res.json(notes);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch notes" });
//   }
// };

// // AI NOTE GENERATION
// export const generateNoteAI = async (req, res) => {
//   const { prompt } = req.body;
//   const API_KEY = process.env.GEMINI_API_KEY;

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `
// Write a detailed, structured note about:

// ${prompt}

// Include headings, bullet points, and simple explanation.
//                 `,
//               },
//             ],
//           },
//         ],
//       }
//     );

//     const text =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     res.json({ note: text });
//   } catch (err) {
//     console.log(err.response?.data || err.message);
//     res.status(500).json({ message: "AI note failed" });
//   }
// };

import Note from "../models/Note.js";

// CREATE NOTE
export const createNote = async (req, res) => {
  try {
    const { title, content, userEmail } = req.body;

    console.log("BODY:", req.body);

    if (!title || !content || !userEmail) {
      return res.status(400).json({
        message: "Missing fields (title/content/userEmail)",
      });
    }

    const note = await Note.create({
      title,
      content,
      userEmail,
      isAI: false,
    });

    res.status(201).json(note);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create note" });
  }
};

// GET NOTES
export const getNotes = async (req, res) => {
  try {
    const { email } = req.query;

    const notes = await Note.find(
      email ? { userEmail: email } : {}
    ).sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};