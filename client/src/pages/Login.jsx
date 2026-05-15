import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Button from "../components/Button.jsx";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      localStorage.setItem("email", values.email);
      showToast("Welcome back to SmartTask Pro!");
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      showToast(msg, "error");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/20">
            <HiOutlineSparkles className="h-9 w-9" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
          <p className="mt-2 text-slate-400">Sign in to continue your journey</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register("email", { required: "Email is required" })}
                  className={`w-full rounded-2xl border-none bg-slate-900/50 py-4 pl-12 pr-4 text-white placeholder:text-slate-600 ring-1 ring-white/10 transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${errors.email ? 'ring-red-500/50' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-red-400 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                  className={`w-full rounded-2xl border-none bg-slate-900/50 py-4 pl-12 pr-4 text-white placeholder:text-slate-600 ring-1 ring-white/10 transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${errors.password ? 'ring-red-500/50' : ''}`}
                />
              </div>
              {errors.password && <p className="text-xs font-medium text-red-400 ml-1">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-transform"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-slate-400">
              New to the platform?{" "}
              <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}