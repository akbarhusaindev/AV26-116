import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { useToast } from "../context/ToastContext.jsx";
import { TASK_FILTERS } from "../utils/constants.js";
import TaskCard from "../components/TaskCard.jsx";
import TaskFormModal from "../components/TaskFormModal.jsx";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { TaskCardSkeleton } from "../components/Skeleton.jsx";
import { IoAdd } from "react-icons/io5";

export default function Tasks() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks", { params: { filter } });
      setTasks(data.tasks || []);
    } catch {
      showToast("Could not load tasks", "error");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filter, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editing) {
        const { data } = await api.put(`/tasks/${editing._id}`, values);
        setTasks((prev) => prev.map((t) => (t._id === editing._id ? data.task : t)));
        showToast("Task updated");
      } else {
        const { data } = await api.post("/tasks", values);
        setTasks((prev) => [data.task, ...prev]);
        showToast("Task created");
      }
      await load();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      showToast("Task deleted");
      await load();
    } catch {
      showToast("Could not delete task", "error");
    }
  };

  const handleToggle = async (task) => {
    const next = task.status === "completed" ? "pending" : "completed";
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { status: next });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? data.task : t)));
      showToast(next === "completed" ? "Marked complete" : "Reopened task");
      await load();
    } catch {
      showToast("Update failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Tasks</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Create, prioritize, and ship with confidence.</p>
        </div>
        <Button type="button" onClick={openCreate} className="self-start sm:self-auto">
          <IoAdd className="h-5 w-5" /> New task
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TASK_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              filter === f.value
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                : "glass-panel text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Start by creating your first task. Break work into clear priorities and due dates so your team always knows what matters next."
          action={
            <Button type="button" onClick={openCreate}>
              <IoAdd className="h-5 w-5" /> Create task
            </Button>
          }
        />
      ) : (
        <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
