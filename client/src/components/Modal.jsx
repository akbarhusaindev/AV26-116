import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  const maxW = size === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={`relative z-10 w-full ${maxW} overflow-hidden rounded-3xl border border-white/30 bg-white/90 p-6 shadow-glow backdrop-blur-2xl dark:border-slate-600/50 dark:bg-slate-900/90`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
