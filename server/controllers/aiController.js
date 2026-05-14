// // import axios from "axios";

// // export async function breakdownTask(req, res) {
// //   const { task } = req.body;
// //   const GenAPi = 'AIzaSyBFN0hnwFVzW6B7s1sQQeUFwJySXuaKZp8'

// //   if (!task) {
// //     return res.status(400).json({ message: "Task is required" });
// //   }

// //   try {
// //     const response = await axios.post(
// //       `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GenAPi}`,
// //       {
// //         contents: [
// //           {
// //             parts: [
// //               {
// //                 text: `
// // You are a senior software architect.

// // Break this task into small actionable steps.

// // Task: ${task}

// // Return ONLY valid JSON array like:
// // ["step 1", "step 2", "step 3"]
// //                 `,
// //               },
// //             ],
// //           },
// //         ],
// //       }
// //     );

// //     let text = response.data.candidates[0].content.parts[0].text;

// //     text = text.replace(/```json|```/g, "").trim();

// //     const result = JSON.parse(text);

// //     res.json({ subtasks: result });
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).json({ message: "AI breakdown failed" });
// //   }
// // }
// // import axios from "axios";

// // export async function breakdownTask(req, res) {
// //   const { task } = req.body;

// //   const API_KEY = process.env.GEMINI_API_KEY; // 👈 move key to env

// //   if (!task) {
// //     return res.status(400).json({ message: "Task is required" });
// //   }

// //   try {
// //     const response = await axios.post(
// //    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
// //       {
// //         contents: [
// //           {
// //             parts: [
// //               {
// //                 text: `
// // Break this task into steps.

// // Task: ${task}

// // Return ONLY JSON array:
// // ["step 1", "step 2", "step 3"]
// //                 `,
// //               },
// //             ],
// //           },
// //         ],
// //       }
// //     );

// //     const candidate = response.data?.candidates?.[0];

// //     if (!candidate) {
// //       return res.status(500).json({
// //         message: "No response from AI",
// //         raw: response.data,
// //       });
// //     }

// //     let text = candidate.content?.parts?.[0]?.text || "[]";

// //     text = text.replace(/```json|```/g, "").trim();

// //     let result;

// //     try {
// //       result = JSON.parse(text);
// //     } catch (e) {
// //       console.log("AI RAW OUTPUT:", text);
// //       return res.status(500).json({
// //         message: "Failed to parse AI response",
// //         raw: text,
// //       });
// //     }

// //     res.json({ subtasks: result });
// //   } catch (err) {
// //     console.error("AI ERROR:", err?.response?.data || err.message);

// //     res.status(500).json({
// //       message: "AI breakdown failed",
// //       error: err?.response?.data || err.message,
// //     });
// //   }
// // }

// import axios from "axios";
// import { Task } from "../models/Task.js";
// import Note from "../models/Note.js";

// // Feature 1: Breakdown a big task into steps
// export async function breakdownTask(req, res) {
//   const { task } = req.body;
//   const API_KEY = process.env.GEMINI_API_KEY;

//   if (!task) {
//     return res.status(400).json({ message: "Task is required" });
//   }

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
//       {
//         contents: [{
//           parts: [{
//             text: "Break this task into a JSON array of actionable steps. Return ONLY the array. Task: " + task
//           }]
//         }]
//       }
//     );

//     let rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
//     // ✅ SAFER CLEANUP: We use .split().join() instead of /regex/ 
//     // This prevents the "missing /" SyntaxError entirely.
//     const cleanText = rawText
//       .split("```json").join("")
//       .split("```").join("")
//       .trim();
    
//     res.status(200).json({ subtasks: JSON.parse(cleanText) });
//   } catch (err) {
//     console.error("AI Breakdown Error:", err.message);
//     res.status(500).json({ message: "AI Breakdown failed" });
//   }
// }

// // Feature 2: Chat with User Data (RAG)
// export async function chatWithData(req, res) {
//   const { prompt } = req.body;
//   const API_KEY = process.env.GEMINI_API_KEY;

//   if (!prompt) {
//     return res.status(400).json({ message: "Prompt is required" });
//   }

//   try {
//     const tasks = await Task.find({ userId: req.user._id }).select("title status priority");
//     const notes = await Note.find({ userEmail: req.user.email }).select("title content");

//     const taskString = tasks.map(t => `- [${t.status.toUpperCase()}] ${t.title}`).join("\n");
//     const noteString = notes.map(n => `- ${n.title}: ${n.content}`).join("\n");

//     const context = `TASKS:\n${taskString}\n\nNOTES:\n${noteString}`;

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
//       {
//         contents: [{
//           role: "user",
//           parts: [{ text: `Use this data to answer: ${context}\n\nQuestion: ${prompt}` }]
//         }],
//       }
//     );
    
//     const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't analyze your data.";
//     res.json({ answer });
//   } catch (err) {
//     console.error("RAG AI Error:", err.message);
//     res.status(500).json({ message: "AI Chat failed" });
//   }
// }

import axios from "axios";
import { Task } from "../models/Task.js";
import Note from "../models/Note.js";

// Feature 1: Breakdown a big task into steps
export async function breakdownTask(req, res) {
  const { task } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!task) {
    return res.status(400).json({ message: "Task is required" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "Break this task into a JSON array of actionable steps. Return ONLY the array. Task: " + task
          }]
        }]
      }
    );

    let rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    // ✅ SAFER CLEANUP: We use .split().join() instead of /regex/ 
    // This prevents the "missing /" SyntaxError entirely.
    const cleanText = rawText
      .split("```json").join("")
      .split("```").join("")
      .trim();
    
    res.status(200).json({ subtasks: JSON.parse(cleanText) });
  } catch (err) {
    console.error("AI Breakdown Error:", err.message);
    res.status(500).json({ message: "AI Breakdown failed" });
  }
}

// Feature 2: Chat with User Data (RAG)
export async function chatWithData(req, res) {
  const { prompt } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    const tasks = await Task.find({ userId: req.user._id }).select("title status priority");
    const notes = await Note.find({ userEmail: req.user.email }).select("title content");

    const taskString = tasks.map(t => `- [${t.status.toUpperCase()}] ${t.title}`).join("\n");
    const noteString = notes.map(n => `- ${n.title}: ${n.content}`).join("\n");

    const context = `TASKS:\n${taskString}\n\nNOTES:\n${noteString}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{
          role: "user",
          parts: [{ text: `Use this data to answer: ${context}\n\nQuestion: ${prompt}` }]
        }],
      }
    );
    
    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't analyze your data.";
    res.json({ answer });
  } catch (err) {
    console.error("RAG AI Error:", err.message);
    res.status(500).json({ message: "AI Chat failed" });
  }
}

// Feature 3: Dynamic Role-Based Mock Interview
export async function mockInterview(req, res) {
  const { answer, questionNumber, role = "Software Engineer" } = req.body; 
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    let systemPrompt = "";

    // Determine the stage of the interview
    if (questionNumber <= 3) {
      systemPrompt = `
        You are a Senior Hiring Manager conducting a technical interview for a "${role}" position. 
        The user just provided this answer to your previous question: "${answer}".
        
        STEP 1: Give exactly ONE sentence of polite, professional feedback on their answer.
        STEP 2: Ask the NEXT technical, situational, or behavioral question appropriate for a ${role} role. Keep it concise.
        
        Do NOT break character. Do NOT format with markdown, asterisks, or bullet points. Just return plain, conversational text so a Text-to-Speech engine can read it naturally.
      `;
    } else {
      systemPrompt = `
        You are a Senior Hiring Manager for a "${role}" position.
        The user just answered the final question: "${answer}".
        
        The interview is now over. 
        Give them a brief 2-sentence summary of how they did overall in the interview, thank them for their time, and tell them the recruiter will be in touch.
        Do NOT ask any more questions.
      `;
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
      }
    );

    const aiFeedback = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I didn't catch that. Can you repeat your answer?";
    
    res.json({ feedback: aiFeedback });
  } catch (err) {
    console.error("Interview AI Error:", err.message);
    res.status(500).json({ message: "AI connection dropped." });
  }
}