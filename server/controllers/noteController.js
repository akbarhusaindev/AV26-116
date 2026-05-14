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

// import Note from "../models/Note.js";

// // CREATE NOTE
// export const createNote = async (req, res) => {
//   try {
//     const { title, content, userEmail } = req.body;

//     console.log("BODY:", req.body);

//     if (!title || !content || !userEmail) {
//       return res.status(400).json({
//         message: "Missing fields (title/content/userEmail)",
//       });
//     }

//     const note = await Note.create({
//       title,
//       content,
//       userEmail,
//       isAI: false,
//     });

//     res.status(201).json(note);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to create note" });
//   }
// };

// // GET NOTES
// export const getNotes = async (req, res) => {
//   try {
//     const { email } = req.query;

//     const notes = await Note.find(
//       email ? { userEmail: email } : {}
//     ).sort({ createdAt: -1 });

//     res.json(notes);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch notes" });
//   }
// };


// import Note from "../models/Note.js";

// // ✅ CREATE NOTE
// export const createNote = async (req, res) => {
//   try {
//     const { title, content, userEmail } = req.body;

//     if (!title || !content || !userEmail) {
//       return res.status(400).json({
//         message: "Missing fields",
//       });
//     }

//     const note = await Note.create({
//       title,
//       content,
//       userEmail,
//       isAI: false,
//     });

//     res.status(201).json(note);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Create failed" });
//   }
// };

// // ✅ GET NOTES
// export const getNotes = async (req, res) => {
//   try {
//     const { email } = req.query;

//     const notes = await Note.find(
//       email ? { userEmail: email } : {}
//     ).sort({ createdAt: -1 });

//     res.json(notes);
//   } catch (err) {
//     res.status(500).json({ message: "Fetch failed" });
//   }
// };

// // ✅ UPDATE NOTE
// export const updateNote = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updated = await Note.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// };

// // ✅ DELETE NOTE
// export const deleteNote = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await Note.findByIdAndDelete(id);

//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Delete failed" });
//   }
// };
import axios from "axios";
import Note from "../models/Note.js";

// ✅ CREATE NOTE
export const createNote = async (req, res) => {
  try {
    const { title, content, userEmail } = req.body;

    if (!title || !content || !userEmail) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const note = await Note.create({
      title,
      content,
      userEmail,
      isAI: false,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
};

// ✅ GET NOTES
export const getNotes = async (req, res) => {
  try {
    const { email } = req.query;

    const notes = await Note.find(
      email ? { userEmail: email } : {}
    ).sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch failed" });
  }
};

// ✅ UPDATE NOTE
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// ✅ DELETE NOTE
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    await Note.findByIdAndDelete(id);

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

// 🔥 AI NOTE (GEMINI)
export const generateNoteAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt required" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Create detailed structured study notes:\n\n${prompt}`,
              },
            ],
          },
        ],
      }
    );

    const aiText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    const note = await Note.create({
      title: "AI Note",
      content: aiText,
      userEmail: "ai@system.com",
      isAI: true,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error("Gemini Error:", err.response?.data || err.message);
    res.status(500).json({ message: "AI generation failed" });
  }
};