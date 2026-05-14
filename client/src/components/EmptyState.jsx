import { motion } from "framer-motion";

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/80 bg-gradient-to-b from-white/60 to-slate-50/40 px-8 py-16 text-center dark:border-slate-600/60 dark:from-slate-900/40 dark:to-slate-900/20"
    >
      <div className="mb-6 w-full max-w-xs">
        <svg viewBox="0 0 400 240" className="w-full text-indigo-500/90 dark:text-indigo-400/90" aria-hidden>
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <rect x="40" y="40" width="320" height="160" rx="24" fill="url(#lg)" opacity="0.12" />
          <rect x="70" y="70" width="260" height="18" rx="9" fill="currentColor" opacity="0.25" />
          <rect x="70" y="100" width="200" height="12" rx="6" fill="currentColor" opacity="0.15" />
          <rect x="70" y="122" width="160" height="12" rx="6" fill="currentColor" opacity="0.12" />
          <circle cx="200" cy="175" r="28" fill="url(#lg)" opacity="0.35" />
          <path
            d="M188 175l8 8 16-16"
            stroke="white"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}
