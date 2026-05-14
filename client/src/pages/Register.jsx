import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Button from "../components/Button.jsx";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function Register() {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      showToast("Account created. You're all set!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      showToast(msg, "error");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/25 via-transparent to-transparent" />
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="gradient-border-wrap mb-8">
          <div className="rounded-[calc(1.5rem-1px)] bg-slate-950/80 p-6 text-center backdrop-blur-xl">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
              <HiOutlineSparkles className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Create your workspace</h1>
            <p className="mt-1 text-sm text-slate-400">SmartTask Pro — task management for teams</p>
          </div>
        </div>

        <div className="glass-card border-white/10 p-8 shadow-glow dark:border-slate-700/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Full name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900/60 dark:text-white"
                placeholder="Alex Rivera"
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-rose-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email"
                autoComplete="email"
                {...register("email", { required: "Email is required" })}
                className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900/60 dark:text-white"
                placeholder="you@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-rose-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900/60 dark:text-white"
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-rose-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full !py-3" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
