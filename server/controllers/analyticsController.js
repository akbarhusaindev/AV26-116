import { Task } from "../models/Task.js";
import Curriculum from "../models/Curriculum.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch User Data
    const tasks = await Task.find({ userId });
    const curriculums = await Curriculum.find({ user: userId });

    // 2. Calculate Overall Stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    
    const masteredSubjects = curriculums.filter(c => c.status === "mastered").length;
    const avgScore = curriculums.length > 0 
      ? Math.round(curriculums.reduce((acc, curr) => acc + curr.bestScore, 0) / curriculums.length)
      : 0;

    // 3. Format Data for Recharts
    const subjectBreakdown = curriculums.map(c => ({
      subject: c.subject,
      masteryLevel: c.bestScore,
      attempts: c.attempts,
      lastStudied: c.updatedAt
    }));

    // Task completion by priority for the Bar Chart
    const taskData = [
      { priority: "High", count: tasks.filter(t => t.priority === "high").length },
      { priority: "Medium", count: tasks.filter(t => t.priority === "medium").length },
      { priority: "Low", count: tasks.filter(t => t.priority === "low").length },
    ];

    res.json({
      overallStats: { totalTasks, completedTasks, masteredSubjects, avgScore },
      subjectBreakdown,
      taskData
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};