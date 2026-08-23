"use client";

import { useState, useEffect } from "react";
import { Task, TaskFormData, TaskCategory, DayOfWeek, CATEGORIES_IN_ARABIC, PRIORITY_LABELS } from "@/types";
import { ArrowLeft, Clock, Bell, Save, FolderKanban, AlertTriangle } from "lucide-react";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  editTask?: Task | null;
}

const defaultFormData: TaskFormData = {
  title: "", description: "", category: "side", time: "12:00",
  isRecurring: false, hasAlarm: false, alarmTime: "12:00", priority: "medium",
};

export default function TaskForm({ isOpen, onClose, onSubmit, editTask }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("saturday");

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title, description: editTask.description, category: editTask.category,
        time: editTask.time, isRecurring: editTask.isRecurring, hasAlarm: editTask.hasAlarm,
        alarmTime: editTask.alarmTime || "12:00", priority: editTask.priority,
      });
      if (editTask.dayOfWeek) setSelectedDay(editTask.dayOfWeek);
    } else setFormData(defaultFormData);
    setErrors({});
  }, [editTask, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "يرجى إدخال عنوان المهمة";
    else if (formData.title.length > 100) newErrors.title = "العنوان طويل جداً (الحد الأقصى 100 حرف)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, dayOfWeek: formData.category === "course" ? selectedDay : undefined });
    setFormData(defaultFormData);
    onClose();
  };

  const updateField = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const c = { ...prev }; delete c[key]; return c; });
  };

  if (!isOpen) return null;

  const days: { value: DayOfWeek; label: string }[] = [
    { value: "saturday", label: "السبت" }, { value: "sunday", label: "الأحد" },
    { value: "monday", label: "الإثنين" }, { value: "tuesday", label: "الثلاثاء" },
    { value: "wednesday", label: "الأربعاء" }, { value: "thursday", label: "الخميس" }, { value: "friday", label: "الجمعة" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg card-solid rounded-3xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100 dark:border-night-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-earth-200 dark:bg-night-700 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-earth-600 dark:text-earth-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-earth-800 dark:text-earth-100">{editTask ? "تعديل المهمة" : "إضافة مهمة جديدة"}</h2>
              <p className="text-xs text-earth-500 dark:text-earth-400">{editTask ? "قم بتعديل بيانات المهمة" : "أدخل تفاصيل المهمة الجديدة"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-earth-400 hover:text-earth-600 hover:bg-earth-100 dark:hover:bg-night-800 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">
              عنوان المهمة <span className="text-earth-400">*</span>
            </label>
            <input type="text" value={formData.title} onChange={(e) => updateField("title", e.target.value)}
              placeholder="أدخل عنوان المهمة..."
              className={`input-warm ${errors.title ? "!border-earth-400" : ""}`} dir="rtl" />
            {errors.title && <p className="mt-1 text-xs text-earth-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">الوصف</label>
            <textarea value={formData.description} onChange={(e) => updateField("description", e.target.value)}
              placeholder="أدخل وصفاً للمهمة (اختياري)..." rows={2} className="input-warm resize-none" dir="rtl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">التصنيف</label>
              <select value={formData.category} onChange={(e) => updateField("category", e.target.value as TaskCategory)}
                className="input-warm">
                {Object.entries(CATEGORIES_IN_ARABIC).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">الأولوية</label>
              <select value={formData.priority} onChange={(e) => updateField("priority", e.target.value as "low" | "medium" | "high")}
                className="input-warm">
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>

          {formData.category === "course" && (
            <div className="animate-slide-down">
              <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">اليوم المخصص للدورة</label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button key={day.value} type="button" onClick={() => setSelectedDay(day.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                      selectedDay === day.value
                        ? "bg-earth-200 dark:bg-night-700 border-earth-300 text-earth-700 dark:text-earth-300"
                        : "bg-earth-50 dark:bg-night-800 border-earth-200 dark:border-night-700 text-earth-500 dark:text-earth-400 hover:border-earth-300"
                    }`}>{day.label}</button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">الوقت</label>
            <div className="relative">
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
              <input type="time" value={formData.time} onChange={(e) => updateField("time", e.target.value)} className="input-warm pr-10" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-earth-50 dark:bg-night-800 rounded-xl border border-earth-200 dark:border-night-700">
            <div>
              <label className="text-sm font-medium text-earth-600 dark:text-earth-300">مهمة متكررة يومياً</label>
              <p className="text-xs text-earth-400 dark:text-earth-500">تفعيل إذا كانت المهمة تتكرر كل يوم</p>
            </div>
            <button type="button" onClick={() => updateField("isRecurring", !formData.isRecurring)}
              className={`relative w-12 h-6 rounded-full transition-all ${formData.isRecurring ? "bg-earth-500" : "bg-earth-300 dark:bg-earth-600"}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${formData.isRecurring ? "right-0.5" : "right-6"}`} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-earth-50 dark:bg-night-800 rounded-xl border border-earth-200 dark:border-night-700">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-earth-400" />
                <div>
                  <label className="text-sm font-medium text-earth-600 dark:text-earth-300">تفعيل التنبيه</label>
                  <p className="text-xs text-earth-400 dark:text-earth-500">سيتم إرسال إشعار عند موعد المهمة</p>
                </div>
              </div>
              <button type="button" onClick={() => updateField("hasAlarm", !formData.hasAlarm)}
                className={`relative w-12 h-6 rounded-full transition-all ${formData.hasAlarm ? "bg-earth-500" : "bg-earth-300 dark:bg-earth-600"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${formData.hasAlarm ? "right-0.5" : "right-6"}`} />
              </button>
            </div>
            {formData.hasAlarm && (
              <div className="animate-slide-down">
                <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">وقت التنبيه</label>
                <input type="time" value={formData.alarmTime} onChange={(e) => updateField("alarmTime", e.target.value)}
                  className="input-warm" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-earth-600 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <Save className="w-4 h-4" />{editTask ? "حفظ التغييرات" : "إضافة المهمة"}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-3 bg-earth-100 dark:bg-night-800 text-earth-600 dark:text-earth-400 rounded-xl text-sm font-medium hover:bg-earth-200 dark:hover:bg-night-700 transition-all">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
