import { Link } from "react-router-dom";
import { useState } from "react";
import { UserPlus, X, AlertTriangle } from "lucide-react";

export default function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-b border-primary-200 dark:border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-earth-800 dark:text-earth-200">
                أنت تتصفح كضيف
                <span className="hidden sm:inline"> — بياناتك محفوظة على هذا الجهاز فقط</span>
              </p>
              <p className="text-xs text-earth-500 dark:text-earth-400 hidden sm:block">
                أنشئ حساباً مجانياً لحفظ بياناتك والوصول لها من أي جهاز
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-medium shadow-sm hover:bg-primary-700 hover:shadow-md transition-all duration-200"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إنشاء حساب</span>
              <span className="sm:hidden">حساب</span>
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 rounded-lg text-earth-400 hover:text-earth-600 dark:hover:text-earth-300 hover:bg-earth-100 dark:hover:bg-night-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
