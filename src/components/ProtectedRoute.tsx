import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 dark:bg-night-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-earth-300 border-t-earth-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-earth-500 dark:text-earth-400">جارٍ التحقق...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
