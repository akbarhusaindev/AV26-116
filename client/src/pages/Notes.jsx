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

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Notes() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [prompt, setPrompt] = useState("");
//   const [notes, setNotes] = useState([]);
//   const [aiNote, setAiNote] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ single source of truth
//   const email = localStorage.getItem("email");

//   // ---------------- FETCH NOTES ----------------
//   const fetchNotes = async () => {
//     try {
//       if (!email) {
//         console.log("❌ Email missing");
//         return;
//       }

//       const res = await axios.get(
//         `http://localhost:5001/api/notes?email=${email}`
//       );

//       setNotes(res.data);
//     } catch (err) {
//       console.log("FETCH ERROR:", err);
//     }
//   };

//   // ✅ FIXED: runs when email is available
//   useEffect(() => {
//     if (email) {
//       fetchNotes();
//     }
//   }, [email]);

//   // ---------------- CREATE NOTE ----------------
//   const createNote = async () => {
//     if (!title || !content || !email) {
//       alert("Missing fields (title/content/email)");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5001/api/notes", {
//         title: title.trim(),
//         content: content.trim(),
//         userEmail: email,
//         isAI: false,
//       });

//       setTitle("");
//       setContent("");
//       fetchNotes();
//     } catch (err) {
//       console.log("CREATE ERROR:", err.response?.data || err.message);
//     }
//   };

//   // ---------------- AI GENERATE NOTE ----------------
//   const generateAI = async () => {
//     if (!prompt) return;

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:5001/api/notes/ai",
//         { prompt }
//       );

//       setAiNote(res.data.note);
//     } catch (err) {
//       console.log("AI ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- SAVE AI NOTE ----------------
//   const saveAINote = async () => {
//     if (!aiNote || !email) return;

//     try {
//       await axios.post("http://localhost:5001/api/notes", {
//         title: prompt,
//         content: aiNote,
//         userEmail: email,
//         isAI: true,
//       });

//       setAiNote("");
//       setPrompt("");
//       fetchNotes();
//     } catch (err) {
//       console.log("SAVE AI ERROR:", err);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Notes</h1>

//       {/* CREATE NOTE */}
//       <div className="space-y-2">
//         <input
//           className="border p-2 w-full text-black"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <textarea
//           className="border p-2 w-full text-black"
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />

//         <button
//           onClick={createNote}
//           className="bg-blue-600 text-white px-4 py-2"
//         >
//           Save Note
//         </button>
//       </div>

//       {/* AI SECTION */}
//       <div className="border-t pt-4 space-y-2">
//         <textarea
//           className="border p-2 w-full"
//           placeholder="Ask AI"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//         />

//         <button
//           onClick={generateAI}
//           className="bg-indigo-600 text-white px-4 py-2"
//         >
//           {loading ? "Generating..." : "Generate AI Note"}
//         </button>

//         {aiNote && (
//           <div className="p-3 bg-gray-100">
//             <pre className="whitespace-pre-wrap">{aiNote}</pre>

//             <button
//               onClick={saveAINote}
//               className="mt-2 bg-green-600 text-white px-4 py-2"
//             >
//               Save AI Note
//             </button>
//           </div>
//         )}
//       </div>

//       {/* NOTES LIST */}
//       <div className="border-t pt-4">
//         {notes.length === 0 ? (
//           <p className="text-gray-500">No notes found</p>
//         ) : (
//           notes.map((n) => (
//             <div key={n._id} className="p-3 border mb-2 text-black">
//               <h3 className="font-bold">{n.title}</h3>
//               <p>{n.content}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Notes() {
//   const [notes, setNotes] = useState([]);

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const [openId, setOpenId] = useState(null);
//   const [editMode, setEditMode] = useState(false);

//   const email = localStorage.getItem("email");

//   // ---------------- FETCH ----------------
//   const fetchNotes = async () => {
//     const res = await axios.get(
//       `http://localhost:5001/api/notes?email=${email}`
//     );
//     setNotes(res.data);
//   };

//   useEffect(() => {
//     if (email) fetchNotes();
//   }, [email]);

//   // ---------------- CREATE ----------------
//   const createNote = async () => {
//     if (!title || !content) return;

//     await axios.post("http://localhost:5001/api/notes", {
//       title,
//       content,
//       userEmail: email,
//     });

//     setTitle("");
//     setContent("");
//     fetchNotes();
//   };

//   // ---------------- DELETE ----------------
//   const deleteNote = async (id) => {
//     await axios.delete(`http://localhost:5001/api/notes/${id}`);
//     setOpenId(null);
//     fetchNotes();
//   };

//   // ---------------- UPDATE ----------------
//   const updateNote = async (note) => {
//     await axios.put(`http://localhost:5001/api/notes/${note._id}`, {
//       title: note.title,
//       content: note.content,
//     });

//     setEditMode(false);
//     fetchNotes();
//   };

//   return (
//     <div className="p-6 space-y-6">

//       {/* CREATE NOTE */}
//       <div className="border p-3 rounded">
//         <input
//           className="border p-2 w-full mb-2 text-black"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <textarea
//           className="border p-2 w-full text-black"
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />

//         <button
//           onClick={createNote}
//           className="bg-blue-600 text-white px-4 py-2 mt-2"
//         >
//           Save Note
//         </button>
//       </div>

//       {/* NOTES LIST */}
//       <div className="space-y-3">
//         {notes.map((note) => (
//           <div
//             key={note._id}
//             className="border rounded p-3 bg-white shadow"
//           >

//             {/* TITLE CLICK */}
//             <div
//               onClick={() => {
//                 setOpenId(openId === note._id ? null : note._id);
//                 setEditMode(false);
//               }}
//               className="cursor-pointer"
//             >
//               <h3 className="font-bold">{note.title}</h3>
//               <p className="text-sm text-gray-600 line-clamp-2">
//                 {note.content}
//               </p>
//             </div>

//             {/* EXPANDED VIEW */}
//             {openId === note._id && (
//               <div className="mt-3 border-t pt-3 space-y-2">

//                 {/* EDIT MODE */}
//                 {editMode ? (
//                   <>
//                     <input
//                       className="border p-2 w-full text-black"
//                       value={note.title}
//                       onChange={(e) => {
//                         const updated = notes.map((n) =>
//                           n._id === note._id
//                             ? { ...n, title: e.target.value }
//                             : n
//                         );
//                         setNotes(updated);
//                       }}
//                     />

//                     <textarea
//                       className="border p-2 w-full text-black"
//                       value={note.content}
//                       onChange={(e) => {
//                         const updated = notes.map((n) =>
//                           n._id === note._id
//                             ? { ...n, content: e.target.value }
//                             : n
//                         );
//                         setNotes(updated);
//                       }}
//                     />

//                     <button
//                       onClick={() => updateNote(note)}
//                       className="bg-green-600 text-white px-3 py-1"
//                     >
//                       Save
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <p className="whitespace-pre-wrap">{note.content}</p>
//                   </>
//                 )}

//                 {/* ACTIONS */}
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setEditMode(!editMode)}
//                     className="bg-yellow-500 text-white px-3 py-1"
//                   >
//                     {editMode ? "Cancel" : "Edit"}
//                   </button>

//                   <button
//                     onClick={() => deleteNote(note._id)}
//                     className="bg-red-600 text-white px-3 py-1"
//                   >
//                     Delete
//                   </button>
//                 </div>

//               </div>
//             )}

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Notes() {
//   const [notes, setNotes] = useState([]);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const [selectedNote, setSelectedNote] = useState(null);
//   const [editMode, setEditMode] = useState(false);

//   const email = localStorage.getItem("email");

//   // ---------------- FETCH ----------------
//   const fetchNotes = async () => {
//     if (!email) return;

//     const res = await axios.get(
//       `http://localhost:5001/api/notes?email=${email}`
//     );

//     setNotes(res.data);
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, [email]);

//   // ---------------- CREATE ----------------
//   const createNote = async () => {
//     if (!title || !content) return;

//     await axios.post("http://localhost:5001/api/notes", {
//       title,
//       content,
//       userEmail: email,
//     });

//     setTitle("");
//     setContent("");
//     fetchNotes();
//   };

//   // ---------------- DELETE ----------------
//   const deleteNote = async (id) => {
//     await axios.delete(`http://localhost:5001/api/notes/${id}`);
//     setSelectedNote(null);
//     fetchNotes();
//   };

//   // ---------------- UPDATE ----------------
//   const updateNote = async () => {
//     await axios.put(
//       `http://localhost:5001/api/notes/${selectedNote._id}`,
//       {
//         title: selectedNote.title,
//         content: selectedNote.content,
//       }
//     );

//     setEditMode(false);
//     fetchNotes();
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">

//       {/* CREATE NOTE */}
//       <div className="max-w-2xl mx-auto bg-white p-4 rounded-xl shadow">
//         <input
//           className="border p-2 w-full mb-2 text-black rounded"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <textarea
//           className="border p-2 w-full text-black rounded"
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />

//         <button
//           onClick={createNote}
//           className="bg-blue-600 text-white px-4 py-2 mt-3 rounded w-full"
//         >
//           Save Note
//         </button>
//       </div>

//       {/* NOTES LIST */}
//       <div className="max-w-3xl mx-auto mt-6 space-y-3">
//         {notes.map((note) => (
//           <div
//             key={note._id}
//             onClick={() => {
//               setSelectedNote(note);
//               setEditMode(false);
//             }}
//             className="bg-white p-4 border rounded-xl shadow cursor-pointer hover:shadow-lg transition"
//           >
//             <h3 className="font-bold text-lg">{note.title}</h3>
//             <p className="text-gray-600 line-clamp-2">{note.content}</p>
//           </div>
//         ))}
//       </div>

//       {/* ================= FULL SCREEN MODAL ================= */}
//       {selectedNote && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

//           <div className="bg-white w-full h-full md:w-[90%] md:h-[90%] md:rounded-xl p-6 overflow-y-auto">

//             {/* TOP BAR */}
//             <div className="flex justify-between items-center border-b pb-3">
//               <h2 className="text-xl font-bold">Your Note</h2>

//               <button
//                 onClick={() => setSelectedNote(null)}
//                 className="text-red-600 font-bold"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* CONTENT */}
//             <div className="mt-5 space-y-4">

//               {editMode ? (
//                 <>
//                   <input
//                     className="border p-2 w-full text-black rounded"
//                     value={selectedNote.title}
//                     onChange={(e) =>
//                       setSelectedNote({
//                         ...selectedNote,
//                         title: e.target.value,
//                       })
//                     }
//                   />

//                   <textarea
//                     className="border p-2 w-full text-black rounded h-64"
//                     value={selectedNote.content}
//                     onChange={(e) =>
//                       setSelectedNote({
//                         ...selectedNote,
//                         content: e.target.value,
//                       })
//                     }
//                   />
//                 </>
//               ) : (
//                 <>
//                   <h1 className="text-2xl font-bold">
//                     {selectedNote.title}
//                   </h1>

//                   <p className="whitespace-pre-wrap text-gray-700">
//                     {selectedNote.content}
//                   </p>
//                 </>
//               )}

//               {/* ACTION BUTTONS */}
//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={() => setEditMode(!editMode)}
//                   className="bg-yellow-500 text-white px-4 py-2 rounded"
//                 >
//                   {editMode ? "Cancel" : "Edit"}
//                 </button>

//                 {editMode && (
//                   <button
//                     onClick={updateNote}
//                     className="bg-green-600 text-white px-4 py-2 rounded"
//                   >
//                     Save
//                   </button>
//                 )}

//                 <button
//                   onClick={() => deleteNote(selectedNote._id)}
//                   className="bg-red-600 text-white px-4 py-2 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>

//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoSparkles, 
  IoCloseOutline, 
  IoTrashOutline, 
  IoPencilOutline, 
  IoSaveOutline,
  IoDocumentTextOutline,
  IoAddCircleOutline,
  IoArrowBackOutline,
  IoExpandOutline
} from "react-icons/io5";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("email");

  // ---------------- FETCH NOTES ----------------
  const fetchNotes = async () => {
    try {
      if (!email) return;
      const res = await axios.get(`http://localhost:5001/api/notes?email=${email}`);
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [email]);

  // ---------------- CREATE NOTE ----------------
  const createNote = async () => {
    if (!title || !content) return;
    try {
      await axios.post("http://localhost:5001/api/notes", {
        title,
        content,
        userEmail: email,
        isAI: false,
      });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- DELETE ----------------
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/notes/${id}`);
      setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- UPDATE ----------------
  const updateNote = async () => {
    try {
      await axios.put(`http://localhost:5001/api/notes/${selectedNote._id}`, {
        title: selectedNote.title,
        content: selectedNote.content,
      });
      setEditMode(false);
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- AI GENERATE NOTE ----------------
  const generateAINote = async () => {
    if (!prompt || !email) return;
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5001/api/notes/ai", { prompt });
      setNotes((prev) => [res.data, ...prev]);
      setPrompt("");
    } catch (err) {
      console.log("AI Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
          <IoDocumentTextOutline size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold dark:text-white tracking-tight">Smart Notes</h1>
          <p className="text-slate-500 text-sm">Capture your thoughts or generate ideas with AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= LEFT COLUMN: INPUTS ================= */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* AI GENERATOR CARD */}
          <div className="relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-500/20">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[22px] h-full">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2">
                <IoSparkles /> Generate with AI
              </h2>
              <textarea
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none h-24 mb-4"
                placeholder="Ask AI to summarize a topic, write code, or draft a plan..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                onClick={generateAINote}
                disabled={loading || !prompt}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? "Architecting..." : <><IoSparkles /> Generate Note</>}
              </button>
            </div>
          </div>

          {/* MANUAL CREATE CARD */}
          <div className="glass-card p-6 border dark:border-slate-800 rounded-3xl shadow-lg bg-white/50 dark:bg-slate-900/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <IoAddCircleOutline size={18} /> Quick Capture
            </h2>
            <input
              className="w-full p-4 mb-3 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-semibold"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white resize-none h-32 mb-4"
              placeholder="Start typing your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={createNote}
              disabled={!title || !content}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Save Note
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: NOTES GRID ================= */}
        <div className="lg:col-span-2">
          {notes.length === 0 ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
              <IoDocumentTextOutline size={64} className="mb-4 opacity-20" />
              <p className="font-medium">No notes yet. Create one or ask AI!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {notes.map((note) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => {
                      setSelectedNote(note);
                      setEditMode(false);
                    }}
                    className={`group cursor-pointer p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col ${
                      note.isAI 
                      ? "bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700" 
                      : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg dark:text-white line-clamp-1 pr-2">
                        {note.title}
                      </h3>
                      {note.isAI && (
                        <span className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <IoSparkles size={10} /> AI
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-4 text-sm leading-relaxed flex-1">
                      {note.content}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors uppercase tracking-wider">
                      <IoExpandOutline size={14} /> Read Full Note
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ================= FULL SCREEN READER ZEN MODE ================= */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.98 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.98 }} 
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 overflow-y-auto custom-scrollbar flex flex-col"
          >
            {/* Sticky Navigation Bar */}
            <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center shadow-sm">
              <button 
                onClick={() => setSelectedNote(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors group"
              >
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <IoArrowBackOutline size={20} />
                </div>
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>

              <div className="flex items-center gap-3">
                {selectedNote.isAI && (
                  <span className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <IoSparkles /> Generated by AI
                  </span>
                )}
                <button
                  onClick={() => deleteNote(selectedNote._id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                  title="Delete Note"
                >
                  <IoTrashOutline size={22} />
                </button>
              </div>
            </div>

            {/* Reading / Editing Area */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20">
              {editMode ? (
                <div className="space-y-6">
                  <input
                    className="w-full bg-transparent text-4xl md:text-5xl font-black text-slate-900 dark:text-white border-none outline-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    placeholder="Note Title..."
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                  />
                  <textarea
                    className="w-full min-h-[60vh] bg-transparent text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed border-none outline-none focus:ring-0 resize-none custom-scrollbar"
                    placeholder="Start writing..."
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedNote.title}
                  </h1>
                  <div className="w-16 h-1 bg-indigo-500 rounded-full"></div>
                  <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-loose">
                      {selectedNote.content}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Action Button (FAB) for Edit/Save */}
            <div className="fixed bottom-8 right-8 z-20">
              {editMode ? (
                <button
                  onClick={updateNote}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:bg-green-500 hover:scale-105 transition-all"
                >
                  <IoSaveOutline size={24} /> Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-full font-bold shadow-2xl shadow-indigo-500/30 hover:bg-indigo-500 hover:scale-105 transition-all"
                >
                  <IoPencilOutline size={24} /> Edit Note
                </button>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}