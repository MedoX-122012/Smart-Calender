import { useStore } from "@/store/useStore";
import DailySchedule from "@/components/DailySchedule";
import TaskList from "@/components/TaskList";
import { getCurrentDayOfWeek, sortTasksByTime, getDayNameInArabic } from "@/utils/scheduleLogic";
import { Sparkles, Rocket, BookOpen, GitBranch, BookHeart, ArrowLeft, Plus, Sun } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { tasks, toggleTaskCompletion, editTask, deleteTask, addTask } = useStore();

  const today = getCurrentDayOfWeek();
  const dayName = getDayNameInArabic(today);

  const todayTasks = sortTasksByTime(
    tasks.filter((task) => {
      if (task.category === "course") return task.dayOfWeek === today;
      return task.category === "daily" || task.category === "side";
    })
  );

  const completedCount = todayTasks.filter((t) => t.isCompleted).length;
  const totalCount = todayTasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // === CLEAN START: Empty state when no tasks ===
  if (totalCount === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Hero */}
        <div className="relative overflow-hidden bg-earth-700 rounded-3xl p-8 sm:p-12 text-white text-center">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 text-8xl">﷽</div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
          <div className="relative z-10 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">مرحباً بك في جدول يومي!</h1>
            <p className="text-white/80 text-lg mb-2">يوم {dayName} مبارك ☀️</p>
            <p className="text-white/60 text-sm">ابدأ رحلة تحسين حياتك بإضافة المهام والعادات والمحتوى الإسلامي</p>
          </div>
        </div>

        {/* Quick Actions - Warm Earthy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/admin"
            className="group flex items-center gap-4 p-5 bg-white dark:bg-night-800 rounded-2xl border-2 border-earth-200 dark:border-night-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-earth-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm group-hover:shadow-md transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-sm font-bold text-earth-900 dark:text-earth-50">أضف مهامك اليومية</h3>
              <p className="text-xs text-earth-400 dark:text-earth-500 mt-0.5">أنشئ روتينك المخصص من الصفر</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-earth-300 group-hover:text-earth-500 transition-colors" />
          </Link>

          <Link to="/habits"
            className="group flex items-center gap-4 p-5 bg-white dark:bg-night-800 rounded-2xl border-2 border-earth-200 dark:border-night-700 hover:border-accent-300 dark:hover:border-accent-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-earth-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm group-hover:shadow-md transition-all">
              <GitBranch className="w-6 h-6" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-sm font-bold text-earth-900 dark:text-earth-50">تتبع عاداتك</h3>
              <p className="text-xs text-earth-400 dark:text-earth-500 mt-0.5">ابنِ حسنات واترك سيئات</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-earth-300 group-hover:text-accent-500 transition-colors" />
          </Link>

          <Link to="/islam"
            className="group flex items-center gap-4 p-5 bg-white dark:bg-night-800 rounded-2xl border-2 border-earth-200 dark:border-night-700 hover:border-primary-300 dark:hover:border-warm-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-earth-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm group-hover:shadow-md transition-all">
              <BookHeart className="w-6 h-6" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-sm font-bold text-earth-900 dark:text-earth-50">المركز الإسلامي</h3>
              <p className="text-xs text-earth-400 dark:text-earth-500 mt-0.5">أذكار • قرآن • سنن</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-earth-300 group-hover:text-earth-500 transition-colors" />
          </Link>
        </div>

        {/* Welcome Message */}
        <div className="bg-earth-100 dark:bg-night-800 rounded-2xl border border-earth-200 dark:border-night-600 p-6 text-center">
          <p className="text-earth-600 dark:text-earth-300 font-medium mb-1">🌟 ابدأ بخطوات بسيطة</p>
          <p className="text-sm text-earth-500 dark:text-earth-400">أضف أول مهمة، حدد عادة حسنة، أو اقرأ أذكار الصباح - كل شيء يبدأ بخطوة</p>
        </div>
      </div>
    );
  }

  // === Normal Dashboard (when tasks exist) ===
  return (
    <div className="space-y-8 animate-fade-in">
      <DailySchedule />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-warm p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-earth-100 dark:bg-night-800 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-earth-600 dark:text-earth-400" />
            </div>
            <div>
              <p className="text-xs text-earth-500 dark:text-earth-400">نسبة الإنجاز</p>
              <p className="text-xl font-bold text-earth-900 dark:text-earth-50">{completionRate}%</p>
            </div>
          </div>
          <div className="mt-3 w-full h-1.5 bg-earth-100 dark:bg-night-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${
              completionRate === 100 ? "bg-earth-500" : "bg-earth-500"
            }`} style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="card-warm p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-earth-100 dark:bg-night-800 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-earth-600 dark:text-earth-400" />
            </div>
            <div>
              <p className="text-xs text-earth-500 dark:text-earth-400">إجمالي المهام</p>
              <p className="text-xl font-bold text-earth-900 dark:text-earth-50">{totalCount}</p>
            </div>
          </div>
          <p className="text-xs text-earth-400 dark:text-earth-500 mt-2">{completedCount} مكتملة • {totalCount - completedCount} متبقية</p>
        </div>

        <div className="card-warm p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-earth-100 dark:bg-night-800 rounded-xl flex items-center justify-center">
              <Sun className="w-5 h-5 text-earth-600 dark:text-earth-400" />
            </div>
            <div>
              <p className="text-xs text-earth-500 dark:text-earth-400">يوم</p>
              <p className="text-xl font-bold text-earth-900 dark:text-earth-50">{getDayNameInArabic(today)}</p>
            </div>
          </div>
          <p className="text-xs text-earth-400 dark:text-earth-500 mt-2">روتين اليوم • {new Date().toLocaleDateString("ar-SA")}</p>
        </div>
      </div>

      {/* Task List */}
      <div className="card-solid p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-earth-500" />
          <h2 className="text-lg font-bold text-earth-900 dark:text-earth-50">مهام اليوم</h2>
        </div>
        <TaskList
          tasks={todayTasks} title=""
          emptyMessage="لا توجد مهام لليوم. أضف مهام جديدة من لوحة التحكم!"
          onAddTask={addTask} onToggle={toggleTaskCompletion}
          onEdit={(id, data) => editTask(id, data)} onDelete={deleteTask}
          showAddButton={true} showCategoryFilter={true} />
      </div>
    </div>
  );
}
