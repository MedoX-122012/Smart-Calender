import { useEffect, useState } from "react";
import { Task } from "@/types";
import { useStore } from "@/store/useStore";
import { getCurrentDayOfWeek, getDayNameInArabic, getRoutineDescription, sortTasksByTime } from "@/utils/scheduleLogic";
import {
  Clock, Sunrise, Sun, Sunset, Moon, Sparkles, CalendarDays, CheckCircle2,
} from "lucide-react";

export default function DailySchedule() {
  const { tasks, toggleTaskCompletion } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const today = getCurrentDayOfWeek();
  const dayName = getDayNameInArabic(today);
  const routineDesc = getRoutineDescription(today);

  const todayTasks = sortTasksByTime(
    tasks.filter((task) => {
      if (task.category === "course") return task.dayOfWeek === today;
      return task.category === "daily" || task.category === "side";
    })
  );

  useEffect(() => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const index = todayTasks.findIndex((task) => {
      const [h, m] = task.time.split(":").map(Number);
      return h * 60 + m >= currentMinutes;
    });
    setCurrentTaskIndex(index >= 0 ? index : todayTasks.length - 1);
  }, [currentTime, todayTasks]);

  const completedCount = todayTasks.filter((t) => t.isCompleted).length;
  const totalCount = todayTasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getTimePeriod = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour < 5) return { icon: Moon, label: "الليل" };
    if (hour < 12) return { icon: Sunrise, label: "الصباح" };
    if (hour < 17) return { icon: Sun, label: "الظهر" };
    if (hour < 20) return { icon: Sunset, label: "العصر" };
    return { icon: Moon, label: "المساء" };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-earth-700 rounded-3xl p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5" />
            <span className="text-sm font-medium text-white/80">{routineDesc}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">مرحباً بك في يومك {dayName}!</h1>
          <p className="text-white/80 text-sm">لديك {todayTasks.length} مهمة اليوم. أنجزت {completedCount} منها.</p>
        </div>
        {/* Progress Circle */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden sm:block">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
                strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card-solid overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-earth-100 dark:border-night-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-earth-500" />
              <h2 className="text-lg font-bold text-earth-900 dark:text-earth-50">جدول اليوم</h2>
            </div>
            <span className="text-sm text-earth-500 dark:text-earth-400">
              {currentTime.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-2 bg-earth-100 dark:bg-night-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? "bg-earth-500" : "bg-earth-500"}`}
                style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-medium text-earth-500 dark:text-earth-400 whitespace-nowrap">
              {completedCount}/{totalCount} منجز
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-1 max-h-[600px] overflow-y-auto">
          {todayTasks.map((task, index) => {
            const PeriodIcon = getTimePeriod(task.time).icon;
            const isCurrent = index === currentTaskIndex && !task.isCompleted;
            const isPast = (() => {
              const [h, m] = task.time.split(":").map(Number);
              const taskMinutes = h * 60 + m;
              const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
              return taskMinutes < nowMinutes;
            })();

            return (
              <div key={task.id} className={`relative flex items-start gap-4 py-3 group transition-all duration-300 ${isCurrent ? "scale-[1.02]" : ""}`}>
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <button onClick={() => toggleTaskCompletion(task.id)}
                    className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${                        task.isCompleted ? "bg-earth-500 border-earth-500" :
                      isCurrent ? "border-earth-500 bg-earth-100 dark:bg-night-800 animate-pulse" :
                      isPast ? "border-earth-300 dark:border-earth-600 bg-earth-50 dark:bg-night-800" :
                      "border-earth-300 dark:border-earth-600 bg-white dark:bg-night-900 hover:border-primary-400"
                    }`}>
                    {task.isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                  {index < todayTasks.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[24px] ${
                      task.isCompleted ? "bg-earth-300 dark:bg-earth-700" : "bg-earth-200 dark:bg-night-700"
                    }`} />
                  )}
                </div>

                {/* Task content */}
                <div className={`flex-1 rounded-xl p-3 transition-all duration-300 ${                    isCurrent ? "bg-earth-100 dark:bg-night-800/50 ring-2 ring-earth-200 dark:ring-night-600 shadow-md" :
                  task.isCompleted ? "bg-earth-50 dark:bg-night-800/50" :
                  "hover:bg-earth-50 dark:hover:bg-night-800/50"
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <PeriodIcon className={`w-3.5 h-3.5 flex-shrink-0 ${
                        task.isCompleted ? "text-earth-400" :                        isCurrent ? "text-earth-500" : "text-earth-400"
                      }`} />
                      <span className={`text-sm font-medium truncate ${
                        task.isCompleted ? "line-through text-earth-400 dark:text-earth-500" : "text-earth-900 dark:text-earth-50"
                      }`}>{task.title}</span>
                    </div>
                    <span className={`text-xs font-medium flex-shrink-0 ${
                      task.isCompleted ? "text-earth-400" : "text-earth-500 dark:text-earth-400"
                    }`}>{task.time}</span>
                  </div>
                  {task.description && !task.isCompleted && (
                    <p className="text-xs text-earth-400 dark:text-earth-500 mt-1 line-clamp-1 pr-5">{task.description}</p>
                  )}
                </div>
              </div>
            );
          })}

          {todayTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="w-12 h-12 text-earth-300 dark:text-earth-600 mb-4" />
              <p className="text-earth-400 dark:text-earth-500 font-medium">لا توجد مهام لليوم</p>
              <p className="text-earth-300 dark:text-earth-600 text-sm mt-1">أضف مهام جديدة من لوحة التحكم</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
