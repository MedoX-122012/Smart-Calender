import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { logIn, error, clearError, isAuthenticated, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await logIn({ email, password });
    setIsSubmitting(false);
    if (success) {
      navigate("/", { replace: true });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 dark:bg-night-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-earth-300 border-t-earth-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 dark:bg-night-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-100 dark:bg-accent-900/20 rounded-full blur-3xl opacity-30 -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30 translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link to="/"
          className="inline-flex items-center gap-2 text-sm text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200 mb-6 transition-colors">
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <div className="bg-white dark:bg-night-800 rounded-3xl border border-earth-200 dark:border-night-700 shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-earth-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-earth-900 dark:text-earth-50 mb-2">تسجيل الدخول</h1>
            <p className="text-sm text-earth-500 dark:text-earth-400">مرحباً بعودتك! أكمل رحلتك</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300 text-center animate-slide-down">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  dir="ltr"
                  required
                  className="input-warm pr-11 text-left"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  required
                  className="input-warm pr-11 pl-11"
                />
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 dark:hover:text-earth-300 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جارٍ الدخول...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-earth-200 dark:bg-night-700" />
            <span className="text-xs text-earth-400 dark:text-earth-500">أو</span>
            <div className="flex-1 h-px bg-earth-200 dark:bg-night-700" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-earth-500 dark:text-earth-400">
            ليس لديك حساب؟{" "}
            <Link to="/signup" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
              أنشئ حساباً جديداً
            </Link>
          </p>
        </div>

        {/* Guest link */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-earth-400 dark:text-earth-500 hover:text-earth-600 dark:hover:text-earth-300 transition-colors">
            تصفح كضيف ←
          </Link>
        </div>
      </div>
    </div>
  );
}
