import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoCloudUploadOutline, 
  IoDocumentTextOutline, 
  IoSend, 
  IoChatbubblesOutline,
  IoSparkles
} from "react-icons/io5";

export default function FileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Upload States
  const [file, setFile] = useState(null);
  const [customTitle, setCustomTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // Chat States
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [asking, setAsking] = useState(false);

  const chatEndRef = useRef(null);

  // Grab the User ID
  const userId = localStorage.getItem("userId"); 
  console.log(userId)

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

//   const fetchUploadedFiles = async () => {
//     try {
//       if (!userId) return;
//       const res = await axios.get(`http://localhost:5001/api/documents/documents?userId=${userId}`);
//       setUploadedFiles(res.data.documents); // Backend still returns an array called 'documents'
//     } catch (err) {
//       console.error("Failed to fetch files", err);
//     }
//   };

const fetchUploadedFiles = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(`http://localhost:5001/api/files/all?userId=${userId}`);
      // ✅ Use res.data.files because your controller returns { files: [...] }
      setUploadedFiles(res.data.files); 
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

//   const handleUpload = async () => {
//     if (!file || !userId) return alert("Please select a file and ensure you are logged in.");
    
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", userId);
//     formData.append("title", customTitle.trim() !== "" ? customTitle : file.name);

//     try {
//       const res = await axios.post("http://localhost:5001/api/files/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
      
//       setFile(null);
//       setCustomTitle(""); 
//       fetchUploadedFiles();
//       setSelectedFile(res.data.document);
//       setChatHistory([{ role: "ai", text: `I've successfully read "${res.data.document.title}". What would you like to know?` }]);
//     } catch (err) {
//       console.error("Upload Error:", err);
//       alert(err.response?.data?.message || "Error uploading file");
//     } finally {
//       setUploading(false);
//     }
//   };


const handleUpload = async () => {
    if (!file || !userId) return alert("Please select a file and ensure you are logged in.");
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("title", customTitle.trim() !== "" ? customTitle : file.name);

    try {
      const res = await axios.post("http://localhost:5001/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setFile(null);
      setCustomTitle(""); 
      fetchUploadedFiles();
      // ✅ Use res.data.file because your controller returns { file: fileRecord }
      setSelectedFile(res.data.file);
      setChatHistory([{ role: "ai", text: `I've successfully read "${res.data.file.title}". What would you like to know?` }]);
    } catch (err) {
      console.error("Upload Error:", err);
      alert(err.response?.data?.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };
//   const handleAsk = async (e) => {
//     e.preventDefault();
//     if (!question.trim() || !selectedFile) return;

//     const userMessage = { role: "user", text: question };
//     setChatHistory((prev) => [...prev, userMessage]);
//     setQuestion("");
//     setAsking(true);

//     try {
//       const res = await axios.post("http://localhost:5001/api/documents/ask", {
//         documentId: selectedFile._id,
//         question: userMessage.text,
//       });

//       setChatHistory((prev) => [...prev, { role: "ai", text: res.data.response }]);
//     } catch (err) {
//       console.error("Ask Error:", err);
//       setChatHistory((prev) => [...prev, { role: "ai", text: "Sorry, I encountered an error searching the file." }]);
//     } finally {
//       setAsking(false);
//     }
//   };

const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || !selectedFile) return;

    const userMessage = { role: "user", text: question };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuestion("");
    setAsking(true);

    try {
      const res = await axios.post("http://localhost:5001/api/files/ask", {
        fileId: selectedFile._id, // ✅ Parameter must be fileId to match controller
        question: userMessage.text,
      });

      setChatHistory((prev) => [...prev, { role: "ai", text: res.data.response }]);
    } catch (err) {
      console.error("Ask Error:", err);
      setChatHistory((prev) => [...prev, { role: "ai", text: "Sorry, I encountered an error searching the file." }]);
    } finally {
      setAsking(false);
    }
  };
  const selectFile = (f) => {
    setSelectedFile(f);
    setChatHistory([{ role: "ai", text: `You are now viewing "${f.title}". Ask me anything about it!` }]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg text-white">
          <IoDocumentTextOutline size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold dark:text-white tracking-tight">FileChat AI</h1>
          <p className="text-slate-500 text-sm">Upload a PDF or DOCX and ask questions instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
        
        {/* ================= LEFT COLUMN: UPLOAD & LIST ================= */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0">
          
          {/* UPLOAD CARD */}
          <div className="glass-card p-6 border dark:border-slate-800 rounded-3xl shadow-lg bg-white/50 dark:bg-slate-900/50 flex-shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <IoCloudUploadOutline size={18} /> Upload File
            </h2>

            <input
              type="text"
              placeholder="Name this file (optional)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full mb-3 p-3 rounded-xl bg-white dark:bg-slate-800 text-sm border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder:text-slate-400 shadow-sm"
            />
            
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <IoDocumentTextOutline size={40} className="mx-auto mb-2 text-indigo-400" />
              <p className="text-sm font-bold dark:text-white">
                {file ? file.name : "Click or drag file here"}
              </p>
              <p className="text-xs text-slate-500 mt-1">PDF or DOCX only</p>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
            >
              {uploading ? "Analyzing..." : "Upload & Process"}
            </button>
          </div>

          {/* FILE LIBRARY */}
          <div className="glass-card flex flex-col flex-1 border dark:border-slate-800 rounded-3xl shadow-lg bg-white/50 dark:bg-slate-900/50 min-h-0 overflow-hidden">
            <div className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Your Files</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
              {uploadedFiles.length === 0 ? (
                <p className="text-center text-slate-400 text-sm mt-4">No files uploaded yet.</p>
              ) : (
                uploadedFiles.map((f) => (
                  <button
                    key={f._id}
                    onClick={() => selectFile(f)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${
                      selectedFile?._id === f._id 
                      ? "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedFile?._id === f._id ? "bg-indigo-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                      <IoDocumentTextOutline size={18} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-sm font-bold truncate ${selectedFile?._id === f._id ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                        {f.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 capitalize">{f.fileType.split('/')[1] || "File"}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CHAT INTERFACE ================= */}
        <div className="lg:col-span-2 glass-card flex flex-col border dark:border-slate-800 rounded-3xl shadow-lg bg-white dark:bg-slate-900 overflow-hidden h-full">
          
          {!selectedFile ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <IoChatbubblesOutline size={48} className="text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black dark:text-white mb-2">Select a File</h2>
              <p className="text-slate-500 max-w-md">Upload a new file or select one from your library to start chatting with the AI.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <IoSparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm dark:text-white line-clamp-1">{selectedFile.title}</h3>
                    <p className="text-xs text-slate-500">AI Assistant Ready</p>
                  </div>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
                <AnimatePresence>
                  {chatHistory.map((msg, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === "user" 
                        ? "bg-indigo-600 text-white rounded-tr-sm" 
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 shadow-sm rounded-tl-sm"
                      }`}>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {asking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </AnimatePresence>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleAsk} className="relative flex items-center">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about this file..."
                    disabled={asking}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full py-4 pl-6 pr-14 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={asking || !question.trim()}
                    className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md"
                  >
                    <IoSend size={18} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}