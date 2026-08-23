import { Habit, HABIT_TYPE_COLORS, HABIT_TYPE_LABELS, HABIT_TYPE_BG } from "@/types";
import { useStore } from "@/store/useStore";
import { Flame, Pencil, Trash2, CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const { habitLogs, toggleHabitLog, getHabitStreak } = useStore();
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habitLogs.some((l) => l.habitId === habit.id && l.date === today && l.completed);
  const streak = useMemo(() => getHabitStreak(habit.id), [habit.id, habitLogs]);

  const lastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000);
    return d.toISOString().split("T")[0];
  });

  const todayLogs = useMemo(
    () => lastDays.map((date) => ({
      date,
      completed: habitLogs.some((l) => l.habitId === habit.id && l.date === date && l.completed),
      day: new Date(date).toLocaleDateString("ar-SA", { weekday: "short" }),
    })),
    [habit.id, habitLogs]
  );

  return (
    <div className="group relative card-solid border-2 border-earth-200 dark:border-night-700 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1" style={{ background: `linear-gradient(90deg, ${HABIT_TYPE_COLORS[habit.type]}, ${habit.type === "good" ? "#6d8c56" : "#e8905a"})` }} />

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-lg"
          style={{ backgroundColor: HABIT_TYPE_COLORS[habit.type] + "20", color: HABIT_TYPE_COLORS[habit.type] }}>
          {habit.type === "good" ? "👍" : "👎"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-bold text-earth-900 dark:text-earth-50">{habit.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${HABIT_TYPE_BG[habit.type]}`}>
              {HABIT_TYPE_LABELS[habit.type]}
            </span>
          </div>
          {habit.description && <p className="text-xs text-earth-500 dark:text-earth-400 mb-3 line-clamp-1">{habit.description}</p>}

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5" title="الأيام المتتالية">
              <Flame className={`w-4 h-4 ${streak.current > 0 ? "text-warm-500" : "text-earth-300 dark:text-earth-600"}`} />
              <span className={`text-lg font-bold ${streak.current > 0 ? "text-warm-500" : "text-earth-400"}`}>{streak.current}</span>
              <span className="text-[10px] text-earth-400">يوم</span>
            </div>
            <div className="flex items-center gap-1.5" title="أفضل سلسلة">
              <TrendingUp className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-sm font-bold text-primary-500">{streak.best}</span>
              <span className="text-[10px] text-earth-400">أفضل</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5" dir="ltr">
            {todayLogs.map((day) => (
              <div key={day.date} className="flex flex-col items-center gap-0.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  day.completed ? "bg-accent-500 text-white shadow-sm shadow-accent-500/50" : "bg-earth-100 dark:bg-night-800 text-earth-300 dark:text-earth-600"
                }`}>
                  {day.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[8px] text-earth-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => toggleHabitLog(habit.id, today)}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isCompletedToday ? "bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 shadow-sm" : "text-earth-300 dark:text-earth-600 hover:bg-earth-100 dark:hover:bg-night-800"
            }`}>
            {isCompletedToday ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="absolute top-3 left-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(habit)} className="p-1.5 rounded-lg text-earth-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(habit.id)} className="p-1.5 rounded-lg text-earth-400 hover:text-warm-600 hover:bg-warm-50 dark:hover:bg-warm-900/30 transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
