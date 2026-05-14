import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle } from "react-icons/io5";

const ToastContext = createContext(null);

let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = ++idSeq;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 4200);
  }, [remove]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const icon = (type) => {
    if (type === "error") return <IoCloseCircle className="h-5 w-5 text-rose-400" />;
    if (type === "info") return <IoInformationCircle className="h-5 w-5 text-sky-400" />;
    return <IoCheckmarkCircle className="h-5 w-5 text-emerald-400" />;
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.95 }}
              className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-glass backdrop-blur-xl dark:border-slate-600/60 dark:bg-slate-800/90"
            >
              <span className="mt-0.5 shrink-0">{icon(t.type)}</span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{t.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
