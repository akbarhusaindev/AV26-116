import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { IoTimeOutline, IoCheckmarkCircleOutline, IoTrophyOutline, IoBookOutline } from "react-icons/io5";
import api from "../services/api";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.get("/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  // Helper component for the top stat cards
  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="glass-card p-6 border dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <Icon className="text-2xl" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white">Performance Analytics</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Track your task completion and curriculum mastery.</p>
      </div>

      {/* Overall Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tasks" value={data.overallStats.totalTasks} icon={IoTimeOutline} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30" />
        <StatCard title="Tasks Completed" value={data.overallStats.completedTasks} icon={IoCheckmarkCircleOutline} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" />
        <StatCard title="Average Quiz Score" value={`${data.overallStats.avgScore}%`} icon={IoTrophyOutline} colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30" />
        <StatCard title="Subjects Mastered" value={data.overallStats.masteredSubjects} icon={IoBookOutline} colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30" />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Radar Chart: Subject Mastery */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800">
          <h2 className="mb-6 text-lg font-bold text-neutral-900 dark:text-white">Curriculum Mastery Radar</h2>
          {data.subjectBreakdown.length > 2 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={data.subjectBreakdown} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#e5e5e5" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#8884d8', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="masteryLevel" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-slate-400 text-sm">
              Add at least 3 subjects to view the Mastery Radar.
            </div>
          )}
        </motion.div>

        {/* Bar Chart: Tasks by Priority */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800">
          <h2 className="mb-6 text-lg font-bold text-neutral-900 dark:text-white">Tasks by Priority</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.taskData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
              <XAxis dataKey="priority" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Topic Mastery Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800">
        <h2 className="mb-6 text-lg font-bold text-neutral-900 dark:text-white">Subject Overview</h2>
        {data.subjectBreakdown.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
                  <th className="pb-3 font-semibold">Subject</th>
                  <th className="pb-3 font-semibold text-center">Mastery Score</th>
                  <th className="pb-3 font-semibold text-center">Quiz Attempts</th>
                  <th className="pb-3 font-semibold text-right">Last Studied</th>
                </tr>
              </thead>
              <tbody>
                {data.subjectBreakdown.map((topic, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                    <td className="py-4 text-sm font-bold dark:text-white">{topic.subject}</td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${topic.masteryLevel >= 70 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${topic.masteryLevel}%` }} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{topic.masteryLevel}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-center font-mono text-sm text-slate-500">{topic.attempts}</td>
                    <td className="py-4 text-right text-sm text-slate-500">
                      {new Date(topic.lastStudied).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-sm text-slate-500 py-8">No subjects studied yet. Go to Curriculum to start learning!</p>
        )}
      </motion.div>
    </div>
  );
}