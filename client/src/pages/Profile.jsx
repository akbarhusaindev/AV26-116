import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import Button from "../components/Button.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { format } from "../utils/date.js";
import { IoMailOutline, IoPersonOutline, IoShieldCheckmark } from "react-icons/io5";

export default function Profile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/auth/profile");
        if (!cancelled) setProfile(data.user);
      } catch {
        if (!cancelled) setProfile(user);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const display = profile || user;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Profile</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Your account details and session controls.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-10 text-center text-white">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-3xl font-bold shadow-inner backdrop-blur">
            {display?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">{display?.name}</h3>
          <p className="text-sm text-indigo-100">{display?.email}</p>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/40">
            <IoPersonOutline className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Full name</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{display?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/40">
            <IoMailOutline className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{display?.email}</p>
            </div>
          </div>
          {display?.createdAt && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/40">
              <IoShieldCheckmark className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Member since
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{format(display.createdAt)}</p>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                logout();
                showToast("Signed out");
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
