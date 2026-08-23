import { useState } from "react";
import { Task, TaskFormData, CATEGORIES_IN_ARABIC, CATEGORY_COLORS } from "@/types";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { ListTodo, Plus, Filter, ChevronDown, ChevronUp } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  title?: string;
  emptyMessage?: string;
  onAddTask?: (data: TaskFormData) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, data: TaskFormData) => void;
  onDelete: (id: string) => void;
  showAddButton?: boolean;
  showCategoryFilter?: boolean;
}

export default function TaskList({ tasks, title = "المهام", emptyMessage = "لا توجد مهام حالياً",
  onAddTask, onToggle, onEdit, onDelete, showAddButton = true, showCategoryFilter = true }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ daily: true, course: true, side: true });

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "completed") return task.isCompleted;
    if (activeFilter === "pending") return !task.isCompleted;
    return task.category === activeFilter;
  });

  const groupedTasks = {
    daily: filteredTasks.filter((t) => t.category === "daily"),
    course: filteredTasks.filter((t) => t.category === "course"),
    side: filteredTasks.filter((t) => t.category === "side"),
  };

  const handleEdit = (task: Task) => { setEditingTask(task); setIsFormOpen(true); };
  const handleEditSubmit = (data: TaskFormData) => { if (editingTask) onEdit(editingTask.id, data); setIsFormOpen(false); setEditingTask(null); };
  const handleAddSubmit = (data: TaskFormData) => { if (onAddTask) onAddTask(data); setIsFormOpen(false); };
  const toggleSection = (category: string) => setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }));

  const getCompletionStats = (categoryTasks: Task[]) => {
    const completed = categoryTasks.filter((t) => t.isCompleted).length;
    const total = categoryTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const filters = [
    { value: "all", label: "الكل" },
    { value: "daily", label: "اليومية" },
    { value: "course", label: "الدورة" },
    { value: "side", label: "الجانبية" },
    { value: "pending", label: "غير المنجزة" },
    { value: "completed", label: "المنجزة" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
            <ListTodo className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-lg font-bold text-earth-900 dark:text-earth-50">{title}</h2>
          <span className="px-2 py-0.5 bg-earth-100 dark:bg-night-800 text-earth-500 dark:text-earth-400 text-xs font-medium rounded-full">{tasks.length}</span>
        </div>
        {showAddButton && (
          <button onClick={() => { setEditingTask(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-earth-600 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="w-4 h-4" />إضافة مهمة
          </button>
        )}
      </div>

      {showCategoryFilter && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-earth-400" />
          {filters.map((filter) => (
            <button key={filter.value} onClick={() => setActiveFilter(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                activeFilter === filter.value
                  ? "bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300"
                  : "bg-white dark:bg-night-800 border-earth-200 dark:border-night-700 text-earth-500 dark:text-earth-400 hover:border-earth-300"
              }`}>{filter.label}</button>
          ))}
        </div>
      )}

      {Object.entries(groupedTasks).map(([category, categoryTasks]) => {
        if (categoryTasks.length === 0) return null;
        const stats = getCompletionStats(categoryTasks);
        const isExpanded = expandedSections[category];
        return (
          <div key={category} className="space-y-3">
            <button onClick={() => toggleSection(category)}
              className="flex items-center justify-between w-full p-3 bg-earth-50 dark:bg-night-800/50 rounded-2xl hover:bg-earth-100 dark:hover:bg-night-800 transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`} />
                <span className="text-sm font-bold text-earth-700 dark:text-earth-300">{CATEGORIES_IN_ARABIC[category as keyof typeof CATEGORIES_IN_ARABIC]}</span>
                <span className="text-xs text-earth-400">({stats.completed}/{stats.total})</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-earth-200 dark:bg-night-700 rounded-full overflow-hidden hidden sm:block">
                  <div className={`h-full rounded-full transition-all duration-500 ${stats.percentage === 100 ? "bg-accent-500" : "bg-primary-500"}`}
                    style={{ width: `${stats.percentage}%` }} />
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-earth-400" /> : <ChevronDown className="w-4 h-4 text-earth-400" />}
              </div>
            </button>
            {isExpanded && (
              <div className="space-y-2 pr-3">
                {categoryTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={onToggle} onEdit={handleEdit} onDelete={onDelete} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-earth-100 dark:bg-night-800 rounded-2xl flex items-center justify-center mb-4">
            <ListTodo className="w-8 h-8 text-earth-300 dark:text-earth-600" />
          </div>
          <p className="text-earth-400 dark:text-earth-500 font-medium">{emptyMessage}</p>
          {showAddButton && (
            <button onClick={() => { setEditingTask(null); setIsFormOpen(true); }}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all">
              <Plus className="w-4 h-4" />أضف مهمة جديدة
            </button>
          )}
        </div>
      )}

      <TaskForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleEditSubmit : handleAddSubmit} editTask={editingTask} />
    </div>
  );
}
