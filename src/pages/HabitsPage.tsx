import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Habit, HabitType, HABIT_TYPE_COLORS, HABIT_TYPE_LABELS } from "@/types";
import HabitCard from "@/components/HabitCard";
import HabitForm from "@/components/HabitForm";
import { Plus, Trophy, Flame, Target, GitBranch } from "lucide-react";

export default function HabitsPage() {
  const { habits, habitLogs, loadHabits, addHabit, editHabit, deleteHabit, getHabitStreak } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | HabitType>("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { loadHabits(); }, [loadHabits]);

  const filteredHabits = habits.filter((h) => activeFilter === "all" || h.type === activeFilter);
  const goodHabits = habits.filter((h) => h.type === "good");
  const badHabits = habits.filter((h) => h.type === "bad");

  const today = new Date().toISOString().split("T")[0];
  const goodDone = goodHabits.filter((h) => habitLogs.some((l) => l.habitId === h.id && l.date === today)).length;
  const badAvoided = badHabits.filter((h) => !habitLogs.some((l) => l.habitId === h.id && l.date === today)).length;
  const totalStreak = habits.reduce((sum, h) => sum + getHabitStreak(h.id).current, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-earth-600 rounded-2xl flex items-center justify-center shadow-sm">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-earth-900 dark:text-earth-50">تتبع العادات</h1>
            <p className="text-sm text-earth-500 dark:text-earth-400">ابنِ عادات حسنة واترك العادات السيئة</p>
          </div>
        </div>
        <button onClick={() => { setEditingHabit(null); setIsFormOpen(true); }}           className="flex items-center gap-2 px-5 py-2.5 bg-earth-600 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <Plus className="w-4 h-4" />إضافة عادة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-solid p-4 text-center">
          <Flame className="w-5 h-5 text-warm-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{totalStreak}</p>
          <p className="text-[10px] text-earth-400">إجمالي الأيام</p>
        </div>
        <div className="card-solid p-4 text-center">
          <Target className="w-5 h-5 text-accent-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">{goodHabits.length === 0 ? "—" : `${goodDone}/${goodHabits.length}`}</p>
          <p className="text-[10px] text-earth-400">حسنات اليوم</p>
        </div>
        <div className="card-solid p-4 text-center">
          <Target className="w-5 h-5 text-warm-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-warm-600 dark:text-warm-400">{badHabits.length === 0 ? "—" : `${badAvoided}/${badHabits.length}`}</p>
          <p className="text-[10px] text-earth-400">سيئات مجتنبة</p>
        </div>
        <div className="card-solid p-4 text-center">
          <Trophy className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{habits.length}</p>
          <p className="text-[10px] text-earth-400">إجمالي العادات</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 card-solid p-1.5">
        {(["all", "good", "bad"] as const).map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeFilter === f ? "shadow-sm border" : "text-earth-500 dark:text-earth-400 hover:bg-earth-50 dark:hover:bg-night-800"
            } ${
              activeFilter === f && f === "all" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 border-primary-200" :
              activeFilter === f && f === "good" ? "bg-accent-50 dark:bg-accent-900/30 text-accent-700 border-accent-200" :
              activeFilter === f && f === "bad" ? "bg-warm-50 dark:bg-warm-900/30 text-warm-700 border-warm-200" : ""
            }`}>
            {f === "all" ? "الكل" : f === "good" ? "👍 حسنات" : "👎 سيئات"}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeFilter === f ? "bg-white dark:bg-night-800" : "bg-earth-100 dark:bg-night-700"
            }`}>{f === "all" ? habits.length : f === "good" ? goodHabits.length : badHabits.length}</span>
          </button>
        ))}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredHabits.map((habit) => (
          <HabitCard key={habit.id} habit={habit}
            onEdit={(h) => { setEditingHabit(h); setIsFormOpen(true); }}
            onDelete={(id) => setShowDeleteConfirm(id)} />
        ))}
      </div>

      {filteredHabits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-earth-100 dark:bg-night-800 rounded-3xl flex items-center justify-center mb-4">
            <GitBranch className="w-10 h-10 text-earth-300 dark:text-earth-600" />
          </div>
          <h3 className="text-lg font-bold text-earth-900 dark:text-earth-50 mb-1">
            {habits.length === 0 ? "ابدأ رحلة تحسين عاداتك" : "لا توجد عادات في هذا التصنيف"}
          </h3>
          <p className="text-sm text-earth-400 dark:text-earth-500 mb-6">
            {habits.length === 0 ? "أضف عادات حسنة لتبنيها أو سيئات لتتركها وتتبع تقدمك يومياً" : "غير تصنيف العرض أو أضف عادة جديدة"}
          </p>
          <button onClick={() => { setEditingHabit(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-earth-600 text-white rounded-xl font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" />أضف أول عادة
          </button>
        </div>
      )}

      <HabitForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingHabit(null); }}
        onSubmit={(data) => { if (editingHabit) { editHabit(editingHabit.id, data); } else { addHabit(data); } setIsFormOpen(false); }}
        editHabit={editingHabit} />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm card-solid p-6 animate-scale-in text-center border-red-200 dark:border-red-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">🗑️</div>
            <h3 className="text-lg font-bold text-earth-900 dark:text-earth-50 mb-2">حذف العادة</h3>
            <p className="text-sm text-earth-500 dark:text-earth-400 mb-6">سيتم حذف العادة وجميع سجلّاتها. هل أنت متأكد؟</p>
            <div className="flex items-center gap-3">
              <button onClick={() => { deleteHabit(showDeleteConfirm); setShowDeleteConfirm(null); }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-all">نعم، احذف</button>
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-earth-100 dark:bg-night-800 text-earth-600 dark:text-earth-400 rounded-xl font-medium text-sm transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
