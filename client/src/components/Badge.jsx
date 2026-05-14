const styles = {
  low: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600/60",
  medium:
    "bg-amber-50 text-amber-800 ring-1 ring-amber-200/80 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800/50",
  high: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/80 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/50",
};

export default function Badge({ children, priority = "medium", className = "" }) {
  const key = ["low", "medium", "high"].includes(priority) ? priority : "medium";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[key]} ${className}`}
    >
      {children}
    </span>
  );
}
