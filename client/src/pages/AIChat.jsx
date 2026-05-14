import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api.js";
import Button from "../components/Button.jsx";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IoSend, IoPerson } from "react-icons/io5";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I have analyzed your Tasks and Notes. Ask me anything about what you've been working on!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await api.post("/ai/chat", { prompt: userMessage });
      setMessages(prev => [...prev, { role: "ai", text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I had trouble reading your data. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col space-y-6 pb-6 h-[calc(100vh-6rem)]">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HiOutlineSparkles className="text-indigo-500" /> AI Data Assistant
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Ask questions about your tasks and notes.</p>
      </div>

      {/* CHAT WINDOW */}
      <div className="glass-card flex-1 overflow-y-auto p-4 flex flex-col gap-4 shadow-sm">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md"}`}>
              {msg.role === "user" ? <IoPerson size={14} /> : <HiOutlineSparkles size={16} />}
            </div>
            
            {/* Message Bubble */}
            <div className={`rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-sm"}`}>
               {/* Markdown formatting simplified for plain text */}
               <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
              <HiOutlineSparkles size={16} />
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-4 rounded-tl-sm">
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0.2s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0.4s]"></div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., What high priority tasks do I have pending?"
          className="flex-1 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="!rounded-2xl px-5">
          <IoSend className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}