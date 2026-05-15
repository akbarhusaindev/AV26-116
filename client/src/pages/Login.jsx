import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Button from "../components/Button.jsx";
import { HiOutlineSparkles } from "react-icons/hi2";

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
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);

      // ✅ IMPORTANT FIX
      localStorage.setItem("email", values.email);
        localStorage.setItem("userId", values.id);
      showToast("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      showToast(msg, "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl mb-4">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            placeholder="Email"
            {...register("email", { required: true })}
            className="p-2 text-black"
          />
          {errors.email && <p>Email required</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="p-2 text-black"
          />
          {errors.password && <p>Password required</p>}

          <Button type="submit">
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4">
          New user? <Link to="/register">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
