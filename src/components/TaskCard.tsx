import { Task } from "@/types";
import {
  CheckCircle2, Circle, Clock, Bell, BellOff, Pencil, Trash2, AlertTriangle,
} from "lucide-react";
import {
  CATEGORY_COLORS, CATEGORY_BG_LIGHT, CATEGORIES_IN_ARABIC, PRIORITY_LABELS, PRIORITY_COLORS,
} from "@/types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = () => {
    const now = new Date();
    const [hours, minutes] = task.time.split(":").map(Number);
    const taskTime = new Date();
    taskTime.setHours(hours, minutes, 0, 0);
    return taskTime < now && !task.isCompleted;
  };

  return (
    <div className={`group relative flex items-start gap-3 p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up ${
      task.isCompleted
        ? "bg-accent-50 dark:bg-accent-900/10 border-accent-200 dark:border-accent-700/30 opacity-75"
        : CATEGORY_BG_LIGHT[task.category]
    } ${isOverdue() && !task.isCompleted ? "border-warm-300 dark:border-warm-600 bg-warm-50/50 dark:bg-warm-900/10" : ""}`}>
      <button onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 mt-0.5 transition-all duration-200 ${
          task.isCompleted ? "text-accent-500 hover:text-accent-600" : "text-earth-300 dark:text-earth-600 hover:text-primary-500"
        }`}>
        {task.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`text-sm font-semibold ${
            task.isCompleted ? "line-through text-earth-400 dark:text-earth-500" : "text-earth-900 dark:text-earth-50"
          }`}>{task.title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border text-white border-transparent ${CATEGORY_COLORS[task.category]}`}>
            {CATEGORIES_IN_ARABIC[task.category]}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${PRIORITY_COLORS[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        {task.description && (
          <p className={`text-xs ${task.isCompleted ? "text-earth-400 dark:text-earth-500 line-through" : "text-earth-500 dark:text-earth-400"} mb-2 line-clamp-1`}>
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-earth-400 dark:text-earth-500">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{task.time}</span>
          {task.hasAlarm && task.alarmTime && (
            <span className="flex items-center gap-1 text-warm-600 dark:text-warm-400"><Bell className="w-3.5 h-3.5" />تنبيه: {task.alarmTime}</span>
          )}
          {!task.hasAlarm && (
            <span className="flex items-center gap-1 text-earth-300 dark:text-earth-600"><BellOff className="w-3.5 h-3.5" />بدون تنبيه</span>
          )}
          {isOverdue() && !task.isCompleted && (
            <span className="flex items-center gap-1 text-warm-500 dark:text-warm-400 font-medium"><AlertTriangle className="w-3.5 h-3.5" />متأخر</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-earth-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-200">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-earth-400 hover:text-warm-600 hover:bg-warm-50 dark:hover:bg-warm-900/30 transition-all duration-200">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
