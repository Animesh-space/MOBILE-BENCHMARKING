import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  // --- State ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
        general: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userRole", response.data.role);

        navigate("/dashboard");
      } else {
        setErrors({
          general: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        setErrors({
          general:
            error.response.data.message ||
            "Invalid Email or Password",
        });
      } else {
        setErrors({
          general: "Unable to connect to the backend server.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative flex items-center justify-center p-6 overflow-hidden">

      {/* Background Decor */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.06),transparent_35%)]" />

      <main className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* Left Panel: Feature Showcase */}

        <section className="hidden lg:flex flex-col justify-between bg-slate-900/80 p-12 border-r border-slate-800 relative overflow-hidden">

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium mb-6">

              <span className="relative flex h-2 w-2">

                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>

                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>

              </span>

              SYSTEM ONLINE

            </div>

            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">

              Mobile Automation <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">

                Benchmark Console

              </span>

            </h2>

            <p className="text-slate-400 max-w-sm leading-relaxed">

              Monitor tests, analyze performance metrics, and manage your device farm from a centralized dashboard.

            </p>

          </div>          {/* Abstract Device UI Mockup */}
          <div className="relative z-10 mt-12 w-full max-w-xs mx-auto">
            <div className="aspect-[1/2] rounded-[2rem] border-4 border-slate-800 bg-slate-950 shadow-2xl relative overflow-hidden p-4 flex flex-col gap-3">
              <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-2" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-32 animate-[spin_4s_linear_infinite] opacity-50 blur-xl" />

              <div className="h-24 rounded-xl bg-slate-800/50 border border-slate-700/50 p-3 flex flex-col justify-end">
                <div className="h-2 w-1/2 bg-cyan-500/50 rounded-full mb-2" />
                <div className="h-2 w-3/4 bg-slate-700 rounded-full" />
              </div>

              <div className="flex-1 rounded-xl bg-slate-800/30 border border-slate-700/30 p-3 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-slate-700/50 animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-1.5 w-full bg-slate-700/50 rounded-full" />
                      <div className="h-1.5 w-2/3 bg-slate-700/50 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* Right Panel: Authentication Form */}

        <section className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">

          <div className="max-w-sm w-full mx-auto">

            <div className="mb-10 text-center lg:text-left">

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">

                Welcome back

              </h1>

              <p className="text-slate-400">

                Enter your credentials to access your console.

              </p>

            </div>

            <form onSubmit={handleLogin} noValidate className="space-y-5">

              {errors.general && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-center gap-3 p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl"
                >
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>

                  {errors.general}

                </div>
              )}

              <div className="space-y-2">

                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="relative">

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "email-error" : undefined
                    }
                    disabled={isSubmitting}
                    className={`w-full bg-slate-950/50 border text-white placeholder:text-slate-600 rounded-xl px-4 py-3.5 transition-all duration-200 outline-none
                    ${
                      errors.email
                        ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-800 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 hover:border-slate-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />

                </div>

                {errors.email && (
                  <p
                    id="email-error"
                    className="text-sm text-red-400 mt-1"
                  >
                    {errors.email}
                  </p>
                )}

              </div>              <div className="space-y-2">

                <div className="flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    disabled={isSubmitting}
                    className={`w-full bg-slate-950/50 border text-white placeholder:text-slate-600 rounded-xl pl-4 pr-12 py-3.5 transition-all duration-200 outline-none
                    ${
                      errors.password
                        ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-800 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 hover:border-slate-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                {errors.password && (
                  <p
                    id="password-error"
                    className="text-sm text-red-400 mt-1"
                  >
                    {errors.password}
                  </p>
                )}

              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60"
              >
                {isSubmitting ? "Authenticating..." : "Sign in"}
              </button>

            </form>

            <div className="mt-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                or
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-8 w-full text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Continue as guest →
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}