import { motion } from "framer-motion";

export function StatCardSkeleton() {
  return (
    <div className="glass-card h-28 animate-pulse bg-gradient-to-br from-slate-100/80 to-slate-200/40 dark:from-slate-800/80 dark:to-slate-900/40" />
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="glass-card space-y-3 p-5">
      <div className="h-5 w-2/3 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="flex gap-2 pt-2">
        <div className="h-9 w-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-9 w-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="h-10 w-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    </div>
  );
}

export default function SkeletonPulse({ className = "" }) {
  return <motion.div className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700 ${className}`} />;
}
