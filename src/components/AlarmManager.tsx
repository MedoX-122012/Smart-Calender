import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Bell, BellOff, ArrowLeft, Volume2 } from "lucide-react";

export default function AlarmManager() {
  const { activeToast, dismissToast, isAlarmReady } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (activeToast) {
      setIsVisible(true);
      const timer = setTimeout(() => handleDismiss(), 10000);
      return () => clearTimeout(timer);
    } else setIsVisible(false);
  }, [activeToast]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => dismissToast(), 300);
  };

  const [showPermissionBanner, setShowPermissionBanner] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") setShowPermissionBanner(true);
    }
  }, []);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") setShowPermissionBanner(false);
  };

  if (!showBanner && !activeToast) return null;

  return (
    <>
      {showPermissionBanner && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-slide-up">
          <div className="card-solid rounded-2xl shadow-2xl border border-primary-200 dark:border-primary-700 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-earth-900 dark:text-earth-50">تفعيل الإشعارات</h4>
                <p className="text-xs text-earth-500 dark:text-earth-400 mt-1">قم بتفعيل الإشعارات لتلقي تنبيهات المهام في وقتها</p>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={requestPermission} className="px-4 py-2 bg-primary-600 text-white text-xs font-medium rounded-xl hover:bg-primary-700 transition-all">تفعيل الإشعارات</button>
                  <button onClick={() => setShowPermissionBanner(false)} className="px-4 py-2 bg-earth-100 dark:bg-night-800 text-earth-600 dark:text-earth-400 text-xs font-medium rounded-xl hover:bg-earth-200 transition-all">لاحقاً</button>
                </div>
              </div>
              <button onClick={() => setShowPermissionBanner(false)} className="p-1 text-earth-400 hover:text-earth-600 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}

      {activeToast && (
        <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}>
          <div className="bg-earth-600 rounded-2xl shadow-lg p-4 sm:p-5 relative">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">🔔 تنبيه المهمة</h4>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium text-white">الآن</span>
                </div>
                <p className="text-base font-bold text-white mt-1 truncate">{activeToast.taskName}</p>
                <p className="text-xs text-white/80 mt-0.5">الوقت: {activeToast.time}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => { handleDismiss(); window.focus(); }}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-xl backdrop-blur-sm transition-all">حسناً</button>
                  <button onClick={handleDismiss} className="px-4 py-2 text-white/80 hover:text-white text-xs font-medium transition-all">إخفاء</button>
                </div>
              </div>
            </div>
            <div className="absolute top-3 left-3 flex gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              <span className="w-2 h-2 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-20 left-4 z-40 hidden sm:block">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium shadow-lg backdrop-blur-sm transition-all duration-300 ${
          isAlarmReady
            ? "bg-accent-50/90 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 border border-accent-200 dark:border-accent-700"
            : "bg-earth-50/90 dark:bg-night-800/90 text-earth-500 dark:text-earth-400 border border-earth-200 dark:border-night-700"
        }`}>
          {isAlarmReady ? <><Volume2 className="w-3.5 h-3.5" /><span>التنبيهات نشطة</span></> : <><BellOff className="w-3.5 h-3.5" /><span>التنبيهات متوقفة</span></>}
        </div>
      </div>
    </>
  );
}
