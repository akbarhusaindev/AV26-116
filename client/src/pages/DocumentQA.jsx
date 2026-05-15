import React, { useState, useEffect } from "react";
import api from "../services/api";
import Button from "../components/Button";
import { IoCloudUploadOutline, IoChatbubblesOutline, IoDocumentTextOutline } from "react-icons/io5";

export default function DocumentQA() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [tab, setTab] = useState("upload");

  const loadDocs = async () => {
    const res = await api.get("/documents");
    setDocs(res.data.documents);
    if (res.data.documents.length > 0) setSelectedId(res.data.documents[0]._id);
  };

  useEffect(() => { loadDocs(); }, []);

  const handleUpload = async () => {
    const fd = new FormData();
    fd.append("file", file);
    setLoading(true);
    try {
      await api.post("/documents/upload", fd);
      setFile(null);
      await loadDocs();
      setTab("chat");
    } catch (e) { alert("Upload failed"); }
    finally { setLoading(false); }
  };

  const handleAsk = async () => {
    setLoading(true);
    try {
      const res = await api.post("/documents/ask", { documentId: selectedId, question });
      setResponse(res.data.response);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-4 mb-8 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
        <button onClick={() => setTab("upload")} className={`flex-1 py-3 rounded-xl font-bold transition ${tab === "upload" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500"}`}>Upload</button>
        <button onClick={() => setTab("chat")} className={`flex-1 py-3 rounded-xl font-bold transition ${tab === "chat" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500"}`}>Chat</button>
      </div>

      {tab === "upload" ? (
        <div className="border-4 border-dashed dark:border-slate-800 rounded-3xl p-20 text-center">
          <input type="file" id="up" hidden onChange={e => setFile(e.target.files[0])} />
          <label htmlFor="up" className="cursor-pointer">
            <IoCloudUploadOutline size={60} className="mx-auto text-indigo-500 mb-4" />
            <p className="text-xl font-bold dark:text-white">{file ? file.name : "Select Document"}</p>
          </label>
          {file && <Button onClick={handleUpload} className="mt-8 w-full py-4" disabled={loading}>{loading ? "Analyzing..." : "Process Document"}</Button>}
        </div>
      ) : (
        <div className="space-y-6">
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="w-full p-4 rounded-2xl dark:bg-slate-800 dark:text-white border dark:border-slate-700">
            {docs.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
          </select>
          <textarea placeholder="Ask AI about this document..." className="w-full p-4 rounded-2xl dark:bg-slate-800 dark:text-white h-40 border dark:border-slate-700" value={question} onChange={e => setQuestion(e.target.value)} />
          <Button onClick={handleAsk} className="w-full py-4" disabled={loading}>{loading ? "AI is thinking..." : "Get Answer"}</Button>
          {response && <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border dark:border-indigo-800 dark:text-slate-200 leading-relaxed">{response}</div>}
        </div>
      )}
    </div>
  );
}