import { useState, useEffect } from "react";
import { Habit, HabitType, HABIT_TYPE_LABELS, HABIT_TYPE_COLORS } from "@/types";
import { ChevronLeft, Save, AlertTriangle, Target, Plus } from "lucide-react";

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; type: HabitType; targetCount: number; color: string }) => void;
  editHabit?: Habit | null;
}

export default function HabitForm({ isOpen, onClose, onSubmit, editHabit }: HabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<HabitType>("good");
  const [targetCount, setTargetCount] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editHabit) { setTitle(editHabit.title); setDescription(editHabit.description); setType(editHabit.type); setTargetCount(editHabit.targetCount || 1); }
    else { setTitle(""); setDescription(""); setType("good"); setTargetCount(1); }
    setErrors({});
  }, [editHabit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "يرجى إدخال عنوان العادة";
    if (targetCount < 1) errs.targetCount = "العدد يجب أن يكون 1 على الأقل";
    if (targetCount > 999) errs.targetCount = "العدد كبير جداً";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({ title: title.trim(), description: description.trim(), type, targetCount, color: HABIT_TYPE_COLORS[type] });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md card-solid rounded-3xl shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100 dark:border-night-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: HABIT_TYPE_COLORS[type] + "20" }}>
              {type === "good" ? "👍" : "👎"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-earth-900 dark:text-earth-50">{editHabit ? "تعديل العادة" : "إضافة عادة جديدة"}</h2>
              <p className="text-xs text-earth-500 dark:text-earth-400">{editHabit ? "تعديل بيانات العادة" : "عادة حسنة تريد تبنيها أو سيئة تريد تركها"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-earth-400 hover:text-earth-600 hover:bg-earth-100 dark:hover:bg-night-800 transition-all"><ChevronLeft className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-2">نوع العادة</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setType("good")}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  type === "good" ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20 shadow-md" : "border-earth-200 dark:border-night-700 hover:border-earth-300"
                }`}>
                <span className="text-2xl">👍</span>
                <span className="text-sm font-bold" style={{ color: type === "good" ? "#6d8c56" : undefined }}>عادة حسنة</span>
                <span className="text-[10px] text-earth-400 text-center">أريد تبني هذه العادة</span>
              </button>
              <button type="button" onClick={() => setType("bad")}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  type === "bad" ? "border-warm-500 bg-warm-50 dark:bg-warm-900/20 shadow-md" : "border-earth-200 dark:border-night-700 hover:border-earth-300"
                }`}>
                <span className="text-2xl">👎</span>
                <span className="text-sm font-bold" style={{ color: type === "bad" ? "#e8905a" : undefined }}>عادة سيئة</span>
                <span className="text-[10px] text-earth-400 text-center">أريد ترك هذه العادة</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">العادة <span className="text-earth-400">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder={type === "good" ? "مثال: قراءة القرآن، الرياضة، الصلاة..." : "مثال: التدخين، السهر، المماطلة..."}
              className={`input-warm ${errors.title ? "!border-earth-400" : ""}`} dir="rtl" />
            {errors.title && <p className="mt-1 text-xs text-earth-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1.5">وصف (اختياري)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder={type === "good" ? "لماذا تريد تبني هذه العادة؟" : "لماذا تريد ترك هذه العادة؟"}
              rows={2} className="input-warm resize-none" dir="rtl" />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1.5">
              <Target className="w-4 h-4 inline ml-1" />الهدف اليومي (عدد المرات)
            </label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                className="w-10 h-10 rounded-xl bg-earth-100 dark:bg-night-800 text-earth-600 dark:text-earth-400 font-bold hover:bg-earth-200 transition-all text-lg">-</button>
              <input type="number" value={targetCount} onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={999}
                className={`w-20 text-center px-3 py-3 rounded-xl border-2 text-lg font-bold bg-earth-50 dark:bg-night-800 text-earth-900 dark:text-earth-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.targetCount ? "!border-warm-300" : "border-earth-200 dark:border-night-700"
                }`} />
              <button type="button" onClick={() => setTargetCount(Math.min(999, targetCount + 1))}
                className="w-10 h-10 rounded-xl bg-earth-100 dark:bg-night-800 text-earth-600 dark:text-earth-400 font-bold hover:bg-earth-200 transition-all text-lg">+</button>
              <span className="text-xs text-earth-400">مرة/يوم</span>
            </div>
            {errors.targetCount && <p className="mt-1 text-xs text-earth-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.targetCount}</p>}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-earth-200 dark:border-night-700">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: HABIT_TYPE_COLORS[type] + "20" }}>
              {type === "good" ? "👍" : "👎"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-earth-900 dark:text-earth-50 truncate">{title || "معاينة العادة"}</p>
              <p className="text-xs text-earth-500 dark:text-earth-400">{HABIT_TYPE_LABELS[type]} • {targetCount} مرة/يوم</p>
            </div>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-earth-600 text-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <Save className="w-4 h-4" />{editHabit ? "حفظ التعديلات" : "إضافة العادة"}
          </button>
        </form>
      </div>
    </div>
  );
}
