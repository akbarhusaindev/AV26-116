// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import Modal from "./Modal.jsx";
// import Button from "./Button.jsx";
// import { toInputDate } from "../utils/date.js";

// const defaults = {
//   title: "",
//   description: "",
//   priority: "medium",
//   status: "pending",
//   dueDate: "",
// };

// export default function TaskFormModal({ open, onClose, onSubmit, initial }) {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({ defaultValues: defaults });

//   useEffect(() => {
//     if (!open) return;
//     if (initial) {
//       reset({
//         title: initial.title || "",
//         description: initial.description || "",
//         priority: initial.priority || "medium",
//         status: initial.status || "pending",
//         dueDate: toInputDate(initial.dueDate) || "",
//       });
//     } else {
//       reset(defaults);
//     }
//   }, [open, initial, reset]);

//   const submit = async (values) => {
//     await onSubmit({
//       ...values,
//       dueDate: values.dueDate || null,
//     });
//     onClose();
//   };

//   const [aiLoading, setAiLoading] = useState(false);
// const [aiTasks, setAiTasks] = useState([]);
// const [bigTask, setBigTask] = useState("");

//   return (
//     <Modal open={open} onClose={onClose} title={initial ? "Edit task" : "Create task"} size="lg">
//       <form onSubmit={handleSubmit(submit)} className="space-y-4">
//         <div>
//           <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
//           <input
//             {...register("title", { required: "Title is required" })}
//             className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 shadow-inner outline-none ring-indigo-500/0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white"
//             placeholder="e.g. Ship onboarding v2"
//           />
//           {errors.title && (
//             <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.title.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
//           <textarea
//             {...register("description")}
//             rows={3}
//             className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white"
//             placeholder="Add context, links, or checklist items"
//           />
//         </div>

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
//             <select
//               {...register("priority")}
//               className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>
//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
//             <select
//               {...register("status")}
//               className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white"
//             >
//               <option value="pending">Pending</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Due date</label>
//           <input
//             type="date"
//             {...register("dueDate")}
//             className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white"
//           />
//         </div>

//         <div className="flex justify-end gap-2 pt-2">
//           <Button type="button" variant="secondary" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Saving…" : initial ? "Save changes" : "Create task"}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// }

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Modal from "./Modal.jsx";
import Button from "./Button.jsx";
import { toInputDate } from "../utils/date.js";

const defaults = {
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  dueDate: "",
};

export default function TaskFormModal({ open, onClose, onSubmit, initial }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaults });

  // AI STATES
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTasks, setAiTasks] = useState([]);
  const [bigTask, setBigTask] = useState("");

  useEffect(() => {
    if (!open) return;

    if (initial) {
      reset({
        title: initial.title || "",
        description: initial.description || "",
        priority: initial.priority || "medium",
        status: initial.status || "pending",
        dueDate: toInputDate(initial.dueDate) || "",
      });
    } else {
      reset(defaults);
    }
  }, [open, initial, reset]);

  // NORMAL SUBMIT
  const submit = async (values) => {
    await onSubmit({
      ...values,
      dueDate: values.dueDate || null,
    });
    onClose();
  };

  // AI GENERATE
  const generateAI = async () => {
    if (!bigTask.trim()) return;

    try {
      setAiLoading(true);

      const res = await axios.post(
        "http://localhost:5001/api/ai/breakdown",
        { task: bigTask }
      );

      setAiTasks(res.data.subtasks);
    } catch (err) {
      console.log(err);
      alert("AI failed");
    } finally {
      setAiLoading(false);
    }
  };

  // ADD ALL TASKS
  const addAllTasks = async () => {
    try {
      for (let t of aiTasks) {
        await onSubmit({
          title: t,
          description: "Generated by AI",
          priority: "medium",
          status: "pending",
          dueDate: null,
        });
      }

      setAiTasks([]);
      setBigTask("");
      alert("All tasks added!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit task" : "Create task"}
      size="lg"
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4">

        {/* AI SECTION */}
        <div className="space-y-3 border-b pb-4">
          <label className="text-sm font-semibold">
            🤖 AI Task Breakdown
          </label>

          <textarea
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-black outline-none"
            placeholder="Enter big task (e.g. Build MERN app)"
            value={bigTask}
            onChange={(e) => setBigTask(e.target.value)}
          />

          <button
            type="button"
            onClick={generateAI}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm"
          >
            {aiLoading ? "Generating..." : "Generate subtasks"}
          </button>
        </div>

        {/* AI RESULTS */}
        {aiTasks.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-sm font-semibold">Generated Steps:</p>

            {aiTasks.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg bg-gray-100 p-2 text-sm"
              >
                <input type="checkbox" defaultChecked />

                <input
                  value={t}
                  onChange={(e) => {
                    const updated = [...aiTasks];
                    updated[i] = e.target.value;
                    setAiTasks(updated);
                  }}
                  className="flex-1 rounded border px-2 py-1 text-black"
                />

                <button
                  type="button"
                  onClick={() => {
                    setAiTasks(aiTasks.filter((_, idx) => idx !== i));
                  }}
                  className="text-red-500"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ADD ALL */}
        {aiTasks.length > 0 && (
          <button
            type="button"
            onClick={addAllTasks}
            className="mt-3 w-full rounded-xl bg-green-600 py-2 text-white"
          >
            Add all as tasks
          </button>
        )}

        {/* NORMAL FORM */}

        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-black outline-none"
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-black outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            {...register("priority")}
            className="rounded-xl border border-slate-300 bg-white p-2 text-black"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            {...register("status")}
            className="rounded-xl border border-slate-300 bg-white p-2 text-black"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <input
          type="date"
          {...register("dueDate")}
          className="w-full rounded-xl border border-slate-300 bg-white p-2 text-black"
        />

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initial ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}