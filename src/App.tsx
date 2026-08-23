import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/Navbar";
import GuestBanner from "@/components/GuestBanner";
import AlarmManager from "@/components/AlarmManager";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import SignUpPage from "@/pages/SignUpPage";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import CalendarPage from "@/pages/CalendarPage";
import AdminPage from "@/pages/AdminPage";
import HabitsPage from "@/pages/HabitsPage";
import IslamPage from "@/pages/IslamPage";
import ProfilePage from "@/pages/ProfilePage";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isGuest } = useAuthStore();
  return (
    <div className="min-h-screen bg-grid-pattern">
      <Navbar />
      {isGuest && <GuestBanner />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      <AlarmManager />
      <footer className="border-t border-earth-200 dark:border-night-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-earth-400 dark:text-earth-600">© {new Date().getFullYear()} جدول يومي - جميع الحقوق محفوظة</p>
            <p className="text-xs text-earth-300 dark:text-earth-600">صنع بـ ❤️ للإنتاجية</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const { loadTasks, loadEvents, loadHabits, setupAlarms } = useStore();
  const { checkSession, isAuthenticated, isGuest, isLoading } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      loadTasks();
      loadEvents();
      loadHabits();
      setupAlarms();
    }
  }, [isAuthenticated, isGuest, loadTasks, loadEvents, loadHabits, setupAlarms]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 dark:bg-night-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-earth-300 border-t-earth-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-earth-500 dark:text-earth-400">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        isAuthenticated || isGuest ? <AppLayout><HomePage /></AppLayout> : <LandingPage />
      } />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Routes accessible by guests and authenticated users */}
      <Route path="/calendar" element={
        isAuthenticated || isGuest ? <AppLayout><CalendarPage /></AppLayout> : <Navigate to="/login" replace />
      } />
      <Route path="/admin" element={
        isAuthenticated || isGuest ? <AppLayout><AdminPage /></AppLayout> : <Navigate to="/login" replace />
      } />
      <Route path="/habits" element={
        isAuthenticated || isGuest ? <AppLayout><HabitsPage /></AppLayout> : <Navigate to="/login" replace />
      } />
      <Route path="/islam" element={
        isAuthenticated || isGuest ? <AppLayout><IslamPage /></AppLayout> : <Navigate to="/login" replace />
      } />

      {/* Auth-only routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout><ProfilePage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
