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

import { useEffect, useState } from "react";
import axios from "axios";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [openId, setOpenId] = useState(null);
  const [editId, setEditId] = useState(null);

  const email = localStorage.getItem("email");

  // ---------------- FETCH ----------------
  const fetchNotes = async () => {
    if (!email) return;

    const res = await axios.get(
      `http://localhost:5001/api/notes?email=${email}`
    );

    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, [email]);

  // ---------------- CREATE ----------------
  const createNote = async () => {
    if (!title || !content) return;

    await axios.post("http://localhost:5001/api/notes", {
      title,
      content,
      userEmail: email,
    });

    setTitle("");
    setContent("");
    fetchNotes();
  };

  // ---------------- DELETE ----------------
  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5001/api/notes/${id}`);
    setOpenId(null);
    setEditId(null);
    fetchNotes();
  };

  // ---------------- UPDATE ----------------
  const updateNote = async (note) => {
    await axios.put(`http://localhost:5001/api/notes/${note._id}`, {
      title: note.title,
      content: note.content,
    });

    setEditId(null);
    fetchNotes();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* CREATE NOTE */}
      <div className="max-w-2xl mx-auto bg-white p-4 rounded-xl shadow">
        <input
          className="border p-2 w-full mb-2 text-black rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full text-black rounded"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={createNote}
          className="bg-blue-600 text-white px-4 py-2 mt-3 rounded w-full"
        >
          Save Note
        </button>
      </div>

      {/* NOTES LIST */}
      <div className="max-w-3xl mx-auto space-y-3">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white border rounded-xl shadow-sm p-4"
          >

            {/* CLICK TO OPEN */}
            <div
              onClick={() =>
                setOpenId(openId === note._id ? null : note._id)
              }
              className="cursor-pointer"
            >
              <h3 className="font-bold text-lg">{note.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {note.content}
              </p>
            </div>

            {/* EXPANDED VIEW */}
            {openId === note._id && (
              <div className="mt-3 border-t pt-3 space-y-3">

                {/* EDIT MODE */}
                {editId === note._id ? (
                  <>
                    <input
                      className="border p-2 w-full text-black rounded"
                      value={note.title}
                      onChange={(e) => {
                        setNotes((prev) =>
                          prev.map((n) =>
                            n._id === note._id
                              ? { ...n, title: e.target.value }
                              : n
                          )
                        );
                      }}
                    />

                    <textarea
                      className="border p-2 w-full text-black rounded"
                      value={note.content}
                      onChange={(e) => {
                        setNotes((prev) =>
                          prev.map((n) =>
                            n._id === note._id
                              ? { ...n, content: e.target.value }
                              : n
                          )
                        );
                      }}
                    />

                    <button
                      onClick={() => updateNote(note)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <p className="whitespace-pre-wrap text-gray-700">
                    {note.content}
                  </p>
                )}

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setEditId(editId === note._id ? null : note._id)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    {editId === note._id ? "Cancel" : "Edit"}
                  </button>

                  <button
                    onClick={() => deleteNote(note._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}