import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { IoChevronDown, IoLogOutOutline, IoMoon, IoSunny, IoMenu } from "react-icons/io5";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function TopNavbar({ onOpenMobile }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/60 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onOpenMobile}
            aria-label="Open menu"
          >
            <IoMenu className="h-6 w-6" />
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Workspace
            </p>
            <h1 className="font-display text-lg font-semibold text-slate-900 dark:text-white">SmartTask Pro</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-2.5 text-slate-600 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <IoSunny className="h-5 w-5" /> : <IoMoon className="h-5 w-5" />}
          </button>

          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2 text-left shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/90"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
              <IoChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 py-1 shadow-glass backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                  >
                    <IoLogOutOutline className="h-4 w-4" />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
