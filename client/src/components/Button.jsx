import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "border border-slate-200/80 bg-white/80 text-slate-700 backdrop-blur-sm hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800",
  danger:
    "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60",
  ghost: "text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/80",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  ...rest
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-slate-900 ${variants[variant] || variants.primary} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
