// import axios from "axios";

// export async function breakdownTask(req, res) {
//   const { task } = req.body;
//   const GenAPi = 'AIzaSyBFN0hnwFVzW6B7s1sQQeUFwJySXuaKZp8'

//   if (!task) {
//     return res.status(400).json({ message: "Task is required" });
//   }

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GenAPi}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `
// You are a senior software architect.

// Break this task into small actionable steps.

// Task: ${task}

// Return ONLY valid JSON array like:
// ["step 1", "step 2", "step 3"]
//                 `,
//               },
//             ],
//           },
//         ],
//       }
//     );

//     let text = response.data.candidates[0].content.parts[0].text;

//     text = text.replace(/```json|```/g, "").trim();

//     const result = JSON.parse(text);

//     res.json({ subtasks: result });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: "AI breakdown failed" });
//   }
// }
// import axios from "axios";

// export async function breakdownTask(req, res) {
//   const { task } = req.body;

//   const API_KEY = process.env.GEMINI_API_KEY; // 👈 move key to env

//   if (!task) {
//     return res.status(400).json({ message: "Task is required" });
//   }

//   try {
//     const response = await axios.post(
//    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `
// Break this task into steps.

// Task: ${task}

// Return ONLY JSON array:
// ["step 1", "step 2", "step 3"]
//                 `,
//               },
//             ],
//           },
//         ],
//       }
//     );

//     const candidate = response.data?.candidates?.[0];

//     if (!candidate) {
//       return res.status(500).json({
//         message: "No response from AI",
//         raw: response.data,
//       });
//     }

//     let text = candidate.content?.parts?.[0]?.text || "[]";

//     text = text.replace(/```json|```/g, "").trim();

//     let result;

//     try {
//       result = JSON.parse(text);
//     } catch (e) {
//       console.log("AI RAW OUTPUT:", text);
//       return res.status(500).json({
//         message: "Failed to parse AI response",
//         raw: text,
//       });
//     }

//     res.json({ subtasks: result });
//   } catch (err) {
//     console.error("AI ERROR:", err?.response?.data || err.message);

//     res.status(500).json({
//       message: "AI breakdown failed",
//       error: err?.response?.data || err.message,
//     });
//   }
// }

import axios from "axios";

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
        contents: [
          {
            parts: [
              {
                text: `
You are a software architect.

Break the task into simple actionable steps.

Return ONLY a valid JSON array.
No explanation, no markdown.

Task: ${task}

Example:
["step 1", "step 2", "step 3"]
                `,
              },
            ],
          },
        ],
      }
    );

    const candidate = response.data?.candidates?.[0];

    if (!candidate) {
      return res.status(500).json({
        message: "No AI response",
        raw: response.data,
      });
    }

    let text = candidate.content?.parts?.[0]?.text || "[]";

    // clean markdown if any
    text = text.replace(/```json|```/g, "").trim();

    let result;

    try {
      result = JSON.parse(text);
    } catch (err) {
      console.log("AI RAW OUTPUT:", text);

      return res.status(500).json({
        message: "AI returned invalid JSON",
        raw: text,
      });
    }

    return res.status(200).json({
      subtasks: result,
    });

  } catch (err) {
    console.error("AI ERROR:", err?.response?.data || err.message);

    return res.status(500).json({
      message: "AI breakdown failed",
      error: err?.response?.data || err.message,
    });
  }
}