import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import { StatCardSkeleton } from "../components/Skeleton.jsx";
import { IoCheckmarkDone, IoFlash, IoLayers, IoTime } from "react-icons/io5";

function StatCard({ title, value, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card relative overflow-hidden p-5"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-2xl" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/tasks", { params: { filter: "all" } });
        if (!cancelled) setTasks(data.tasks || []);
      } catch {
        if (!cancelled) setTasks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const high = tasks.filter((t) => t.priority === "high" && t.status === "pending").length;
    return { total, completed, pending, high };
  }, [tasks]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white shadow-glow md:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
        <div className="relative">
          <p className="text-sm font-medium text-indigo-100">Good to see you</p>
          <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">Welcome back, {user?.name?.split(" ")[0] || "there"}</h2>
          <p className="mt-2 max-w-xl text-sm text-indigo-100/90">
            Track momentum across your tasks. This dashboard is wired for future charts — your aggregates update in real
            time from the API.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/tasks"
              className="inline-flex items-center justify-center rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25"
            >
              Open tasks
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white/95 transition hover:bg-white/10"
            >
              View profile
            </Link>
          </div>
        </div>
      </motion.div>

      <div>
        <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Overview</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard title="Total tasks" value={stats.total} icon={IoLayers} delay={0} />
              <StatCard title="Completed" value={stats.completed} icon={IoCheckmarkDone} delay={0.05} />
              <StatCard title="Pending" value={stats.pending} icon={IoTime} delay={0.1} />
              <StatCard title="High priority (open)" value={stats.high} icon={IoFlash} delay={0.15} />
            </>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6"
      >
        <h4 className="font-display text-base font-semibold text-slate-900 dark:text-white">Graph-ready metrics</h4>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          The stats above are computed from <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">GET /api/tasks?filter=all</code>. You can
          plug Chart.js or Recharts here using the same task payload without changing the backend contract.
        </p>
      </motion.div>
    </div>
  );
}
