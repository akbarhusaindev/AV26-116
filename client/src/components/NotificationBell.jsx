import React, { useState, useEffect } from "react";
import api from "../services/api";
import { IoNotificationsOutline, IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/reminders/active");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Check for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const dismissNotification = async (id) => {
    try {
      await api.put(`/reminders/${id}/read`);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to dismiss");
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <IoNotificationsOutline size={28} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden"
          >
            <div className="bg-indigo-600 p-4 text-white font-bold flex justify-between items-center">
              <span>Alerts & Reminders</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {notifications.length} New
              </span>
            </div>
            
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  You're all caught up!
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif._id} className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{notif.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Due: {new Date(notif.remindAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <button 
                      onClick={() => dismissNotification(notif._id)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                    >
                      <IoCloseOutline size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}