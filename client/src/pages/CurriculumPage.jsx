import { useState, useEffect } from "react";
import api from "../services/api";
import Button from "../components/Button";
import { 
  IoBookOutline, 
  IoTrophyOutline, 
  IoCheckmarkCircle, 
  IoTrashOutline, 
  IoLockClosedOutline 
} from "react-icons/io5";

export default function CurriculumPage() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ subject: "", description: "" });
  const [quiz, setQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/curriculum");
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleAdd = async () => {
    if (!form.subject || !form.description) return alert("Please fill all fields");
    await api.post("/curriculum", form);
    setForm({ subject: "", description: "" });
    fetchSubjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this mastered subject?")) return;
    try {
      await api.delete(`/curriculum/${id}`);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const startQuiz = async (sub) => {
    setLoading(true);
    try {
      const res = await api.post("/curriculum/generate-quiz", { 
        subject: sub.subject, 
        description: sub.description 
      });
      setQuiz({ ...res.data, subId: sub._id });
      setCurrentStep(0);
      setUserAnswers([]);
    } catch (err) {
      alert("Failed to generate quiz. Check your AI API connection.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = (idx) => {
    const newAnswers = [...userAnswers, idx];
    if (currentStep < quiz.questions.length - 1) {
      setUserAnswers(newAnswers);
      setCurrentStep(currentStep + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers) => {
    let correctCount = 0;
    
    // Calculate score based on index comparison
    quiz.questions.forEach((q, i) => {
      if (q.answer === finalAnswers[i]) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / quiz.questions.length) * 100;

    try {
      // Send score to backend
      await api.post("/curriculum/save-result", { 
        subjectId: quiz.subId, 
        score: finalScore 
      });

      if (finalScore >= 70) {
        alert(`🎉 Mastered! Your score: ${finalScore}% - Deletion unlocked!`);
      } else {
        alert(`📚 Keep learning! Your score: ${finalScore}% - (Need 70% to unlock removal)`);
      }

      setQuiz(null); // Return to subject list
      fetchSubjects(); // Refresh data to show green status or badges
    } catch (err) {
      console.error("Failed to save quiz result", err);
      alert("Error saving results. Check your internet.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* ADD SUBJECT SECTION */}
      {!quiz && (
        <div className="glass-card p-8 border dark:border-slate-800 rounded-3xl shadow-lg bg-white dark:bg-slate-900/50">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 dark:text-white">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <IoBookOutline className="text-indigo-600" />
            </div>
            Academic Curriculum
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              className="bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-2xl focus:ring-2 ring-indigo-500 dark:text-white outline-none"
              placeholder="Subject (e.g. Java)"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
            />
            <input 
              className="bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-2xl focus:ring-2 ring-indigo-500 dark:text-white outline-none"
              placeholder="Concepts (e.g. Collections)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <Button onClick={handleAdd} className="rounded-2xl h-full font-bold">Add Subject</Button>
          </div>
        </div>
      )}

      {/* QUIZ INTERFACE */}
      {quiz ? (
        <div className="glass-card p-10 text-center max-w-2xl mx-auto border-2 border-indigo-500 shadow-2xl rounded-3xl bg-white dark:bg-slate-900">
          <div className="mb-6">
            <p className="text-sm text-indigo-500 font-bold uppercase tracking-widest">Question {currentStep + 1} of 10</p>
            <div className="w-full bg-slate-100 h-2 mt-2 rounded-full overflow-hidden">
               <div className="bg-indigo-500 h-full transition-all" style={{ width: `${(currentStep + 1) * 10}%` }}></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-8 dark:text-white leading-tight">
            {quiz.questions[currentStep].question}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {quiz.questions[currentStep].options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => submitAnswer(i)}
                className="p-5 text-left rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all dark:text-slate-300 font-medium"
              >
                <span className="inline-block w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-center leading-8 mr-3 text-sm font-bold text-slate-500">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* SUBJECT GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(s => {
            const isMastered = s.status === "mastered";
            return (
              <div 
                key={s._id} 
                className={`relative group p-7 rounded-3xl border-2 transition-all duration-500 ${
                  isMastered 
                    ? "bg-emerald-50/20 border-emerald-500 dark:bg-emerald-900/10 dark:border-emerald-500/50 shadow-xl shadow-emerald-100/20" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                }`}
              >
                {/* Conditional Delete Icon */}
                <div className="absolute top-5 right-5">
                  {isMastered ? (
                    <button 
                      onClick={() => handleDelete(s._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                    >
                      <IoTrashOutline size={22} />
                    </button>
                  ) : (
                    <IoLockClosedOutline size={20} className="text-slate-300 dark:text-slate-700" title="Locked: Score 70% to enable delete" />
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xl font-bold truncate pr-8 ${isMastered ? "text-emerald-700 dark:text-emerald-400" : "dark:text-white"}`}>
                      {s.subject}
                    </h3>
                    {isMastered && <IoCheckmarkCircle className="text-emerald-500 text-xl" />}
                  </div>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 h-10">
                    {s.description}
                  </p>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-400">
                      <span>Best Score</span>
                      <span className={isMastered ? "text-emerald-600" : ""}>{s.bestScore}%</span>
                    </div>
                    
                    {/* Mastery Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isMastered ? "bg-emerald-500" : "bg-indigo-500"}`}
                        style={{ width: `${s.bestScore}%` }}
                      />
                    </div>

                    {s.badge && (
                      <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-500 font-bold text-sm pt-2">
                        <IoTrophyOutline size={18} /> {s.badge} Badge
                      </div>
                    )}

                    <div className="pt-2">
                      <Button 
                        variant={isMastered ? "secondary" : "primary"} 
                        onClick={() => startQuiz(s)}
                        disabled={loading}
                        className="w-full rounded-xl py-3"
                      >
                        {loading ? "AI Generating..." : isMastered ? "Retake Mastery" : "Start Quiz"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}