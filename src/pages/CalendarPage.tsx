import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import Calendar from "@/components/Calendar";
import EventForm from "@/components/EventForm";
import {
  CalendarEvent,
  EventFormData,
  EVENT_TYPES_IN_ARABIC,
  EVENT_TYPE_ICONS,
  EVENT_TYPE_COLORS,
} from "@/types";
import {
  CalendarDays,
  Plus,
  Trash2,
  Sparkles,
  Clock,
} from "lucide-react";

export default function CalendarPage() {
  const { events, loadEvents, addEvent, editEvent, deleteEvent } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const handleAddEvent = (data: EventFormData) => { addEvent(data); setIsFormOpen(false); };
  const handleEditEvent = (data: EventFormData) => {
    if (editingEvent) { editEvent(editingEvent.id, data); setEditingEvent(null); setIsFormOpen(false); }
  };
  const handleEventClick = (event: CalendarEvent) => { setEditingEvent(event); setIsFormOpen(true); };
  const confirmDelete = () => { if (showDeleteConfirm) { deleteEvent(showDeleteConfirm); setShowDeleteConfirm(null); } };

  const today = new Date();
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-earth-500 rounded-2xl flex items-center justify-center shadow-sm">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-earth-900 dark:text-earth-50">التقويم</h1>
            <p className="text-sm text-earth-500 dark:text-earth-400">عرض وإدارة المناسبات والأعياد والمواعيد</p>
          </div>
        </div>
        <button onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-earth-600 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <Plus className="w-4 h-4" /> إضافة حدث
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <Calendar events={events} onDateClick={() => {}} onEventClick={handleEventClick}
            onAddEvent={() => { setEditingEvent(null); setIsFormOpen(true); }} />
        </div>

        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="card-solid p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-bold text-earth-900 dark:text-earth-50">الأحداث القادمة</h2>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl bg-earth-50 dark:bg-night-800/50 border border-earth-100 dark:border-night-700 hover:shadow-md transition-all duration-200 group cursor-pointer"
                      onClick={() => handleEventClick(event)}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: EVENT_TYPE_COLORS[event.type] + "20" }}>
                        {EVENT_TYPE_ICONS[event.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-earth-900 dark:text-earth-50 truncate">{event.title}</p>
                        <p className="text-xs text-earth-500 dark:text-earth-400">{EVENT_TYPES_IN_ARABIC[event.type]}{event.recurringYearly && " • سنوي"}</p>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <p className="text-xs font-bold text-earth-900 dark:text-earth-50">{eventDate.getDate()}</p>
                        <p className="text-[10px] text-earth-400">{eventDate.toLocaleDateString("ar-SA", { month: "short" })}</p>
                      </div>
                      {diffDays === 0 && <span className="px-2 py-0.5 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-[10px] font-medium">اليوم</span>}
                      {diffDays === 1 && <span className="px-2 py-0.5 bg-warm-100 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300 rounded-full text-[10px] font-medium">غداً</span>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Sparkles className="w-10 h-10 text-earth-300 dark:text-earth-600 mb-3" />
                <p className="text-sm text-earth-400 dark:text-earth-500">لا توجد أحداث قادمة</p>
                <button onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
                  className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 transition-colors">أضف حدثاً جديداً</button>
              </div>
            )}
          </div>

          {/* Event Types */}
          <div className="card-solid p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-earth-500" />
              <h2 className="text-lg font-bold text-earth-900 dark:text-earth-50">أنواع المناسبات</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(EVENT_TYPES_IN_ARABIC).map(([type, label]) => (
                <div key={type} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-earth-50 dark:hover:bg-night-800/50 transition-all duration-200">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: EVENT_TYPE_COLORS[type as keyof typeof EVENT_TYPE_COLORS] + "20" }}>
                    {EVENT_TYPE_ICONS[type as keyof typeof EVENT_TYPE_ICONS]}
                  </div>
                  <span className="text-sm font-medium text-earth-700 dark:text-earth-300">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="card-solid p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-warm-50 dark:bg-warm-900/20 rounded-xl border border-warm-200 dark:border-warm-700">
                <p className="text-2xl font-bold text-warm-700 dark:text-warm-300">{events.filter((e) => e.type === "birthday").length}</p>
                <p className="text-[10px] text-warm-600 dark:text-warm-400">أعياد ميلاد</p>
              </div>
              <div className="text-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-700">
                <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{events.filter((e) => e.type === "festival").length}</p>
                <p className="text-[10px] text-primary-600 dark:text-primary-400">مناسبات</p>
              </div>
              <div className="text-center p-3 bg-accent-50 dark:bg-accent-900/20 rounded-xl border border-accent-200 dark:border-accent-700">
                <p className="text-2xl font-bold text-accent-700 dark:text-accent-300">{events.filter((e) => e.type === "appointment").length}</p>
                <p className="text-[10px] text-accent-600 dark:text-accent-400">مواعيد</p>
              </div>
              <div className="text-center p-3 bg-earth-50 dark:bg-night-800 rounded-xl border border-earth-200 dark:border-night-700">
                <p className="text-2xl font-bold text-earth-700 dark:text-earth-300">{events.length}</p>
                <p className="text-[10px] text-earth-500 dark:text-earth-400">إجمالي الأحداث</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingEvent(null); }}
        onSubmit={editingEvent ? handleEditEvent : handleAddEvent} editEvent={editingEvent} />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm card-solid p-6 animate-scale-in border-red-200 dark:border-red-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-earth-900 dark:text-earth-50 mb-2">حذف الحدث</h3>
              <p className="text-sm text-earth-500 dark:text-earth-400 mb-6">هل أنت متأكد من حذف هذا الحدث؟</p>
              <div className="flex items-center gap-3">
                <button onClick={confirmDelete} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-all">نعم، احذف</button>
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-3 bg-earth-100 dark:bg-night-800 text-earth-600 dark:text-earth-400 rounded-xl font-medium text-sm transition-all">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
