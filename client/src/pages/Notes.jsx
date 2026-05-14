// import { useState } from "react";
// import axios from "axios";

// export default function Notes() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const [aiPrompt, setAiPrompt] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [notes, setNotes] = useState([]);

//   // 🧠 AI Generate Notes
//   const generateNote = async () => {
//     if (!aiPrompt.trim()) return;

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:5001/api/ai/notes",
//         { prompt: aiPrompt }
//       );

//       setContent(res.data.note);
//     } catch (err) {
//       console.log(err);
//       alert("AI failed to generate notes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 💾 Save Note locally (for now)
//   const saveNote = () => {
//     if (!title.trim() || !content.trim()) return;

//     const newNote = {
//       id: Date.now(),
//       title,
//       content,
//     };

//     setNotes([newNote, ...notes]);

//     setTitle("");
//     setContent("");
//     setAiPrompt("");
//   };

//   return (
//     <div className="p-6 space-y-6">

//       {/* HEADER */}
//       <h1 className="text-2xl font-bold">Notes</h1>

//       {/* 📝 MANUAL NOTE */}
//       <div className="space-y-3 border rounded-xl p-4">
//         <h2 className="font-semibold">Create Note Manually</h2>

//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Note title"
//           className="w-full border p-2 rounded"
//         />

//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Write your note..."
//           className="w-full border p-2 rounded h-32"
//         />

//         <button
//           onClick={saveNote}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Save Note
//         </button>
//       </div>

//       {/* 🤖 AI NOTE GENERATOR */}
//       <div className="space-y-3 border rounded-xl p-4">
//         <h2 className="font-semibold">AI Note Generator</h2>

//         <textarea
//           value={aiPrompt}
//           onChange={(e) => setAiPrompt(e.target.value)}
//           placeholder="Example: Explain React hooks in simple notes"
//           className="w-full border p-2 rounded h-24"
//         />

//         <button
//           onClick={generateNote}
//           className="bg-indigo-600 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Generating..." : "Generate Notes"}
//         </button>
//       </div>

//       {/* 📚 NOTES LIST */}
//       <div className="space-y-3">
//         <h2 className="font-semibold">Your Notes</h2>

//         {notes.length === 0 ? (
//           <p className="text-gray-500">No notes yet</p>
//         ) : (
//           notes.map((n) => (
//             <div key={n.id} className="border p-3 rounded-xl">
//               <h3 className="font-bold">{n.title}</h3>
//               <p className="text-sm whitespace-pre-line">{n.content}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";

export default function Notes() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [notes, setNotes] = useState([]);
  const [aiNote, setAiNote] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ SAFE EMAIL (MOST IMPORTANT FIX)
  const email = localStorage.getItem("email");

  // ---------------- FETCH NOTES ----------------
  const fetchNotes = async () => {
    try {
      if (!email) {
        console.log("❌ Email missing in localStorage");
        return;
      }

      const res = await axios.get(
        `http://localhost:5001/api/notes?email=${email}`
      );

      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ---------------- CREATE NOTE ----------------
  const createNote = async () => {
    try {
      const email = localStorage.getItem("email");

      console.log("DEBUG:", { title, content, email });

      if (!title || !content || !email) {
        alert("Missing fields (title/content/email)");
        return;
      }

      await axios.post("http://localhost:5001/api/notes", {
        title: title.trim(),
        content: content.trim(),
        userEmail: email,
        isAI: false,
      });

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.log("CREATE ERROR:", err.response?.data || err.message);
    }
  };

  // ---------------- AI NOTE ----------------
  const generateAI = async () => {
    try {
      if (!prompt) return;

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5001/api/notes/ai",
        { prompt }
      );

      setAiNote(res.data.note);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SAVE AI NOTE ----------------
  const saveAINote = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!aiNote || !email) return;

      await axios.post("http://localhost:5001/api/notes", {
        title: prompt,
        content: aiNote,
        userEmail: email,
        isAI: true,
      });

      setAiNote("");
      setPrompt("");
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notes</h1>

      {/* MANUAL NOTE */}
      <div className="space-y-2">
        <input
          className="border p-2 w-full text-black"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full text-black"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={createNote}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Save Note
        </button>
      </div>

      {/* AI NOTE */}
      <div className="border-t pt-4 space-y-2">
        <textarea
          className="border p-2 w-full"
          placeholder="Ask AI"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={generateAI}
          className="bg-indigo-600 text-white px-4 py-2"
        >
          {loading ? "Generating..." : "Generate AI Note"}
        </button>

        {aiNote && (
          <div className="p-3 bg-gray-100">
            <pre className="whitespace-pre-wrap">{aiNote}</pre>

            <button
              onClick={saveAINote}
              className="mt-2 bg-green-600 text-white px-4 py-2"
            >
              Save AI Note
            </button>
          </div>
        )}
      </div>

      {/* NOTES LIST */}
      <div className="border-t pt-4">
        {notes.map((n) => (
          <div key={n._id} className="p-3 border mb-2 text-black">
            <h3 className="font-bold">{n.title}</h3>
            <p>{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}