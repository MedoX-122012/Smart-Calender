import { useState, useEffect } from "react";
import { CalendarEvent, EventFormData, EventType, EVENT_TYPES_IN_ARABIC, EVENT_TYPE_ICONS, EVENT_TYPE_COLORS } from "@/types";
import { ChevronLeft, Save, Repeat, RotateCcw, CalendarDays, AlertTriangle } from "lucide-react";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  editEvent?: CalendarEvent | null;
}

const defaultFormData: EventFormData = {
  title: "", description: "", date: new Date().toISOString().split("T")[0],
  type: "birthday", color: "#b8946a", isRecurring: true, recurringYearly: true,
};

export default function EventForm({ isOpen, onClose, onSubmit, editEvent }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title, description: editEvent.description, date: editEvent.date,
        type: editEvent.type, color: editEvent.color, isRecurring: editEvent.isRecurring, recurringYearly: editEvent.recurringYearly,
      });
    } else setFormData(defaultFormData);
    setErrors({});
  }, [editEvent, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "يرجى إدخال عنوان الحدث";
    if (!formData.date) newErrors.date = "يرجى اختيار التاريخ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, color: EVENT_TYPE_COLORS[formData.type] });
    setFormData(defaultFormData);
    onClose();
  };

  const updateField = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "type") updated.color = EVENT_TYPE_COLORS[value as EventType];
      return updated;
    });
    if (errors[key]) setErrors((prev) => { const c = { ...prev }; delete c[key]; return c; });
  };

  if (!isOpen) return null;

  const eventTypes = Object.entries(EVENT_TYPES_IN_ARABIC) as [EventType, string][];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg card-solid rounded-3xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100 dark:border-night-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-earth-200 dark:bg-night-700">
              {EVENT_TYPE_ICONS[formData.type]}
            </div>
            <div>
              <h2 className="text-lg font-bold text-earth-800 dark:text-earth-100">{editEvent ? "تعديل الحدث" : "إضافة حدث جديد"}</h2>
              <p className="text-xs text-earth-500 dark:text-earth-400">{editEvent ? "قم بتعديل بيانات الحدث" : "أضف مناسبة، عيد ميلاد، أو حدث خاص"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-earth-400 hover:text-earth-600 hover:bg-earth-100 dark:hover:bg-night-800 transition-all"><ChevronLeft className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-2">نوع الحدث</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {eventTypes.map(([type, label]) => (
                <button key={type} type="button" onClick={() => updateField("type", type)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                    formData.type === type ? "border-earth-300 shadow-md scale-105" : "border-earth-200 dark:border-night-700 hover:border-earth-300"
                  }`}
                  style={{ borderColor: formData.type === type ? EVENT_TYPE_COLORS[type] : undefined,
                    backgroundColor: formData.type === type ? EVENT_TYPE_COLORS[type] + "10" : undefined,
                    color: EVENT_TYPE_COLORS[type] }}>
                  <span className="text-lg">{EVENT_TYPE_ICONS[type]}</span>
                  <span className="text-[10px] leading-tight text-center">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">
              عنوان الحدث <span className="text-earth-400">*</span>
            </label>
            <input type="text" value={formData.title} onChange={(e) => updateField("title", e.target.value)}
              placeholder={formData.type === "birthday" ? "مثال: عيد ميلاد أحمد" : formData.type === "festival" ? "مثال: عيد الفطر" : "أدخل عنوان الحدث..."}
              className={`input-warm ${errors.title ? "!border-earth-400" : ""}`} dir="rtl" />
            {errors.title && <p className="mt-1 text-xs text-earth-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">الوصف</label>
            <textarea value={formData.description} onChange={(e) => updateField("description", e.target.value)}
              placeholder="أدخل وصفاً للحدث (اختياري)..." rows={2} className="input-warm resize-none" dir="rtl" />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-600 dark:text-earth-300 mb-1.5">التاريخ <span className="text-earth-400">*</span></label>
            <div className="relative">
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
              <input type="date" value={formData.date} onChange={(e) => updateField("date", e.target.value)}
                className={`input-warm pr-10 ${errors.date ? "!border-earth-400" : ""}`} />
            </div>
            {errors.date && <p className="mt-1 text-xs text-earth-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.date}</p>}
          </div>

          <div className="space-y-3 p-4 bg-earth-50 dark:bg-night-800/50 rounded-2xl border border-earth-200 dark:border-night-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-earth-400" />
                <label className="text-sm font-medium text-earth-600 dark:text-earth-300">حدث متكرر</label>
              </div>
              <button type="button" onClick={() => updateField("isRecurring", !formData.isRecurring)}
                className={`relative w-12 h-6 rounded-full transition-all ${formData.isRecurring ? "bg-earth-500" : "bg-earth-300 dark:bg-earth-600"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${formData.isRecurring ? "right-0.5" : "right-6"}`} />
              </button>
            </div>
            {formData.isRecurring && (
              <div className="flex items-center justify-between animate-slide-down">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-earth-500" />
                  <label className="text-sm font-medium text-earth-600 dark:text-earth-300">يتكرر سنوياً</label>
                  <p className="text-xs text-earth-400 dark:text-earth-500">(لأعياد الميلاد والمناسبات السنوية)</p>
                </div>
                <button type="button" onClick={() => updateField("recurringYearly", !formData.recurringYearly)}
                  className={`relative w-12 h-6 rounded-full transition-all ${formData.recurringYearly ? "bg-earth-500" : "bg-earth-300 dark:bg-earth-600"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${formData.recurringYearly ? "right-0.5" : "right-6"}`} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-earth-200 dark:border-night-700">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-earth-100 dark:bg-night-700">
              {EVENT_TYPE_ICONS[formData.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-earth-800 dark:text-earth-100 truncate">{formData.title || "معاينة الحدث"}</p>
              <p className="text-xs text-earth-500 dark:text-earth-400">{EVENT_TYPES_IN_ARABIC[formData.type]}{formData.recurringYearly && " • يتكرر سنوياً"}{" • "}{formData.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-earth-600 text-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <Save className="w-4 h-4" />{editEvent ? "حفظ التعديلات" : "إضافة الحدث"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 bg-earth-100 dark:bg-night-800 text-earth-600 dark:text-earth-400 rounded-xl font-medium text-sm transition-all">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}
