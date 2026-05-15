import React, { useState } from "react";
import api from "../services/api";
import { IoTimeOutline, IoAddOutline } from "react-icons/io5";

export default function CreateReminder() {
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !remindAt) return;
    
    setLoading(true);
    try {
      await api.post("/reminders", { title, remindAt });
      setTitle("");
      setRemindAt("");
      alert("Reminder set successfully!"); // You can replace this with your Toast
    } catch (err) {
      alert("Failed to set reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 border dark:border-slate-800 rounded-3xl shadow-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
      <h3 className="font-bold text-lg dark:text-white mb-4 flex items-center gap-2">
        <IoTimeOutline className="text-indigo-500" /> Set a Reminder
      </h3>
      <form onSubmit={handleCreate} className="space-y-4">
        <input
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          required
        />
        <input
          type="datetime-local"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
          className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <IoAddOutline size={20} />
          {loading ? "Saving..." : "Set Alert"}
        </button>
      </form>
    </div>
  );
}
