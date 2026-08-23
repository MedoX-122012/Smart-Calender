import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  User, Mail, Lock, Eye, EyeOff, Save, CheckCircle2,
  AlertCircle, Shield, Calendar, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const {
    user, error, success,
    updateProfile, changePassword,
    clearError, clearSuccess,
  } = useAuthStore();

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    return () => { clearError(); clearSuccess(); };
  }, [clearError, clearSuccess]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    clearSuccess();
    setIsSavingProfile(true);
    await updateProfile({ name, email });
    setIsSavingProfile(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    clearSuccess();

    if (newPassword !== confirmPassword) {
      // Set error through store would be ideal, but we can use the store's error setter
      // For now, we'll rely on the store's changePassword validation
    }

    setIsSavingPassword(true);
    const success = await changePassword(currentPassword, newPassword);
    setIsSavingPassword(false);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للرئيسية
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-earth-600 rounded-2xl flex items-center justify-center shadow-sm">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-earth-900 dark:text-earth-50">الملف الشخصي</h1>
          <p className="text-sm text-earth-500 dark:text-earth-400">تعديل معلومات حسابك</p>
        </div>
      </div>

      {/* Global feedback */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300 animate-slide-down">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl text-sm text-accent-700 dark:text-accent-300 animate-slide-down">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Avatar Card */}
      <div className="card-solid p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-earth-500 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0) || "م"}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-earth-900 dark:text-earth-50">{user?.name}</h2>
            <p className="text-sm text-earth-500 dark:text-earth-400">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-earth-400" />
              <span className="text-xs text-earth-400 dark:text-earth-500">
                عضو منذ {user?.createdAt ? formatDate(user.createdAt) : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="card-solid overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-earth-100 dark:border-night-700">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-earth-500" />
            <h3 className="text-base font-bold text-earth-900 dark:text-earth-50">المعلومات الشخصية</h3>
          </div>
          <p className="text-xs text-earth-400 dark:text-earth-500 mt-1">تعديل اسمك وعنوان بريدك الإلكتروني</p>
        </div>
        <form onSubmit={handleProfileSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1.5">الاسم</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك"
                required
                className="input-warm pr-11"
              />
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
            </div>
          </div>

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

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingProfile ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جارٍ الحفظ...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>حفظ التغييرات</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="card-solid overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-earth-100 dark:border-night-700">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-earth-500" />
            <h3 className="text-base font-bold text-earth-900 dark:text-earth-50">تغيير كلمة المرور</h3>
          </div>
          <p className="text-xs text-earth-400 dark:text-earth-500 mt-1">تحديث كلمة المرور للحفاظ على أمان حسابك</p>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1.5">كلمة المرور الحالية</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الحالية"
                required
                className="input-warm pr-11 pl-11"
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 dark:hover:text-earth-300 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1.5">كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6 أحرف على الأقل"
                minLength={6}
                required
                className="input-warm pr-11 pl-11"
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 dark:hover:text-earth-300 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1.5">تأكيد كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                minLength={6}
                required
                className="input-warm pr-11"
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">كلمتا المرور غير متطابقتين</p>
            )}
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 6}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingPassword ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جارٍ التغيير...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>تغيير كلمة المرور</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="bg-earth-100 dark:bg-night-800 rounded-2xl border border-earth-200 dark:border-night-600 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-earth-500" />
          <h4 className="text-sm font-bold text-earth-700 dark:text-earth-300">معلومات الحساب</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-earth-400 dark:text-earth-500">المعرّف:</span>
            <span className="text-earth-600 dark:text-earth-400 font-mono text-xs">{user?.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-earth-400 dark:text-earth-500">تاريخ الإنشاء:</span>
            <span className="text-earth-600 dark:text-earth-400">{user?.createdAt ? formatDate(user.createdAt) : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
