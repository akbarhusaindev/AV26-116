import { motion } from "framer-motion";
import { format } from "../utils/date.js";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";
import { IoCalendarOutline, IoPencil, IoTrash } from "react-icons/io5";

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const done = task.status === "completed";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -20px rgba(99,102,241,0.35)" }}
      className={`glass-card group relative flex flex-col gap-3 p-5 transition-shadow ${
        done ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-display truncate text-lg font-semibold text-slate-900 dark:text-white ${
                done ? "line-through decoration-slate-400" : ""
              }`}
            >
              {task.title}
            </h3>
            <Badge priority={task.priority}>{task.priority}</Badge>
          </div>
          {task.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        {task.dueDate ? (
          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100/80 px-2 py-1 dark:bg-slate-800/80">
            <IoCalendarOutline className="h-3.5 w-3.5" />
            {format(task.dueDate)}
          </span>
        ) : (
          <span className="rounded-xl bg-slate-100/60 px-2 py-1 dark:bg-slate-800/60">No due date</span>
        )}
        <span className="rounded-xl bg-indigo-50 px-2 py-1 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
          {task.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          variant={done ? "secondary" : "primary"}
          className="!py-2 !text-xs"
          onClick={() => onToggle(task)}
        >
          {done ? "Mark pending" : "Mark complete"}
        </Button>
        <Button type="button" variant="ghost" className="!py-2 !text-xs" onClick={() => onEdit(task)}>
          <IoPencil className="h-4 w-4" /> Edit
        </Button>
        <Button type="button" variant="danger" className="!py-2 !text-xs" onClick={() => onDelete(task)}>
          <IoTrash className="h-4 w-4" /> Delete
        </Button>
      </div>
    </motion.article>
  );
}
