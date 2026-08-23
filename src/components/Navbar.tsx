import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Menu, ChevronLeft, Settings, Moon, Sun, CalendarDays, BookOpen, GitBranch, BookHeart, LogOut, User, LogIn, UserCircle, UserCheck, X,
} from "lucide-react";
import { getCurrentDayOfWeek, getRoutineDescription } from "@/utils/scheduleLogic";
import { useAuthStore } from "@/store/useAuthStore";

const DARK_KEY = "jadwal-dark-mode";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isGuest, logOut, exitGuest } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(DARK_KEY);
      if (stored !== null) return stored === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(DARK_KEY, String(isDarkMode));
  }, [isDarkMode]);

  const today = getCurrentDayOfWeek();
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: LayoutDashboard, description: "الروتين اليومي" },
    { href: "/islam", label: "الإسلام", icon: BookHeart, description: "قرآن • أذكار • سنن" },
    { href: "/habits", label: "العادات", icon: GitBranch, description: "حسنات وسيئات" },
    { href: "/calendar", label: "التقويم", icon: CalendarDays, description: "الأحداث والمناسبات" },
    { href: "/admin", label: "الإعدادات", icon: Settings, description: "إدارة المهام" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-earth-50/90 dark:bg-night-900/90 backdrop-blur-xl border-b border-earth-200 dark:border-night-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-earth-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-earth-800 dark:text-earth-100 leading-tight">جدول يومي</h1>
              <p className="text-xs text-earth-500 dark:text-earth-400 leading-tight">لحياة أفضل</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} to={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-earth-100 dark:bg-night-800 text-earth-700 dark:text-earth-300 shadow-sm border border-earth-200 dark:border-night-600"
                      : "text-earth-500 dark:text-earth-400 hover:bg-earth-100 dark:hover:bg-night-800"
                  }`}>
                  <Icon className="w-4 h-4" /><span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-earth-100 dark:bg-night-800 rounded-xl border border-earth-200 dark:border-night-600">
              <div className="w-2 h-2 rounded-full bg-earth-400 animate-pulse" />
              <span className="text-xs font-medium text-earth-600 dark:text-earth-400">{getRoutineDescription(today)}</span>
            </div>

            <button onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-earth-500 dark:text-earth-400 hover:bg-earth-100 dark:hover:bg-night-800 transition-all">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Guest Mode Badge */}
            {isGuest && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
                <UserCheck className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                <span className="text-xs font-medium text-primary-700 dark:text-primary-300">ضيف</span>
                <button
                  onClick={() => { exitGuest(); navigate("/"); }}
                  className="mr-1 p-0.5 rounded text-primary-400 hover:text-primary-600 dark:hover:text-primary-200 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-earth-100 dark:bg-night-800 rounded-xl border border-earth-200 dark:border-night-600 hover:bg-earth-200 dark:hover:bg-night-700 transition-all">
                  <div className="w-7 h-7 bg-earth-500 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{user?.name?.charAt(0) || "م"}</span>
                  </div>
                  <span className="hidden sm:block text-xs font-medium text-earth-700 dark:text-earth-300">{user?.name}</span>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-night-800 rounded-xl border border-earth-200 dark:border-night-700 shadow-xl z-50 animate-scale-in">
                      <div className="p-3 border-b border-earth-100 dark:border-night-700">
                        <p className="text-sm font-bold text-earth-900 dark:text-earth-50">{user?.name}</p>
                        <p className="text-xs text-earth-500 dark:text-earth-400 truncate">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-earth-600 dark:text-earth-400 hover:bg-earth-50 dark:hover:bg-night-700 transition-all">
                          <UserCircle className="w-4 h-4" />
                          الملف الشخصي
                        </Link>
                        <button
                          onClick={() => { logOut(); setShowUserMenu(false); navigate("/"); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                          <LogOut className="w-4 h-4" />
                          تسجيل الخروج
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : !isGuest ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-xs">
                  <LogIn className="w-4 h-4" />
                  الدخول
                </Link>
                <Link to="/signup" className="btn-primary text-xs">
                  <User className="w-4 h-4" />
                  حساب جديد
                </Link>
              </div>
            ) : null}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-earth-500 dark:text-earth-400 hover:bg-earth-100 dark:hover:bg-night-800 transition-all">
              {isMobileMenuOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}>
        <div className="px-4 py-3 space-y-1.5 border-t border-earth-100 dark:border-night-800 bg-earth-50/50 dark:bg-night-900/50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} to={link.href} onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-earth-100 dark:bg-night-800 text-earth-700 dark:text-earth-300"
                    : "text-earth-500 dark:text-earth-400 hover:bg-white dark:hover:bg-night-800"
                }`}>
                <Icon className="w-5 h-5" />
                <div>
                  <div>{link.label}</div>
                  <div className="text-xs text-earth-400 dark:text-earth-500">{link.description}</div>
                </div>
                {isActive(link.href) && <div className="mr-auto w-1.5 h-8 bg-earth-500 rounded-full" />}
              </Link>
            );
          })}
          {/* Mobile Guest Mode */}
          {isGuest && (
            <div className="mt-2">
              <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
                <UserCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-700 dark:text-primary-300">أنت تتصفح كضيف</p>
                  <p className="text-xs text-primary-500 dark:text-primary-400">بياناتك محفوظة على هذا الجهاز فقط</p>
                </div>
                <button
                  onClick={() => { exitGuest(); setIsMobileMenuOpen(false); navigate("/"); }}
                  className="p-1.5 rounded-lg text-primary-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Auth */}
          {isAuthenticated ? (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-3 px-4 py-3 bg-earth-100 dark:bg-night-800 rounded-xl border border-earth-200 dark:border-night-600">
                <div className="w-8 h-8 bg-earth-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{user?.name?.charAt(0) || "م"}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-earth-900 dark:text-earth-50">{user?.name}</p>
                  <p className="text-xs text-earth-500 dark:text-earth-400">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-earth-600 dark:text-earth-400 hover:bg-white dark:hover:bg-night-800 transition-all">
                <UserCircle className="w-5 h-5" />
                الملف الشخصي
              </Link>
              <button
                onClick={() => { logOut(); setIsMobileMenuOpen(false); navigate("/"); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <LogOut className="w-5 h-5" />
                تسجيل الخروج
              </button>
            </div>
          ) : !isGuest ? (
            <div className="mt-2 space-y-1.5">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-earth-600 dark:text-earth-400 hover:bg-white dark:hover:bg-night-800 transition-all">
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white bg-earth-600 hover:bg-earth-700 transition-all">
                <User className="w-5 h-5" />
                إنشاء حساب
              </Link>
            </div>
          ) : null}

          <div className="flex items-center gap-2 px-4 py-2 mt-2 bg-earth-100 dark:bg-night-800 rounded-xl border border-earth-200 dark:border-night-600">
            <div className="w-2 h-2 rounded-full bg-earth-400 animate-pulse" />
            <span className="text-xs font-medium text-earth-600 dark:text-earth-400">{getRoutineDescription(today)}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
