import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Task, TaskFormData, DayOfWeek, CATEGORIES_IN_ARABIC, CalendarEvent, EventFormData, EVENT_TYPES_IN_ARABIC, EVENT_TYPE_ICONS, EVENT_TYPE_COLORS, EVENT_TYPE_BG } from "@/types";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import EventForm from "@/components/EventForm";
import {
  Settings, CalendarDays, Plus, Download, Trash2, CheckCircle2, AlertTriangle,
  Search, BarChart3, Layers, ListTodo, Sparkles, Cake, Pencil,
} from "lucide-react";
import { DAYS_IN_ARABIC } from "@/types";

type AdminTab = "tasks" | "events";
type TabView = "all" | "daily" | "course" | "side";

export default function AdminPage() {
  const { tasks, addTask, editTask, deleteTask, toggleTaskCompletion, events, addEvent, editEvent, deleteEvent, loadEvents } = useStore();
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>("tasks");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [showDayFilter, setShowDayFilter] = useState(false);
  const [dayFilter, setDayFilter] = useState<DayOfWeek | "all">("all");
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showConfirmEventDelete, setShowConfirmEventDelete] = useState<string | null>(null);
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query));
    }
    if (activeTab !== "all") filtered = filtered.filter((t) => t.category === activeTab);
    if (dayFilter !== "all") filtered = filtered.filter((t) => t.category === "course" ? t.dayOfWeek === dayFilter : true);
    return filtered;
  }, [tasks, activeTab, searchQuery, dayFilter]);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];
    if (eventSearchQuery.trim()) {
      const query = eventSearchQuery.toLowerCase();
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query));
    }
    if (eventTypeFilter !== "all") filtered = filtered.filter((e) => e.type === eventTypeFilter);
    return filtered.sort((a, b) => a.date.localeCompare(b.date));
  }, [events, eventSearchQuery, eventTypeFilter]);

  const stats = useMemo(() => ({
    total: tasks.length, completed: tasks.filter((t) => t.isCompleted).length,
    daily: tasks.filter((t) => t.category === "daily").length,
    course: tasks.filter((t) => t.category === "course").length,
    side: tasks.filter((t) => t.category === "side").length,
    highPriority: tasks.filter((t) => t.priority === "high").length,
    eventStats: { total: events.length, birthdays: events.filter((e) => e.type === "birthday").length, festivals: events.filter((e) => e.type === "festival").length, appointments: events.filter((e) => e.type === "appointment").length }
  }), [tasks, events]);

  const handleBulkReset = () => {
    if (confirm("هل أنت متأكد من إعادة تعيين جميع المهام؟")) {
      if (typeof window !== "undefined") { localStorage.removeItem("jadwal-yawmi-fallback"); window.location.reload(); }
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({ tasks, events }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jadwal-yawmi-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { value: TabView; label: string; count: number }[] = [
    { value: "all", label: "الكل", count: stats.total },
    { value: "daily", label: "اليومية", count: stats.daily },
    { value: "course", label: "الدورة", count: stats.course },
    { value: "side", label: "الجانبية", count: stats.side },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-earth-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-earth-900 dark:text-earth-50">لوحة التحكم</h1>
            <p className="text-sm text-earth-500 dark:text-earth-400">إدارة المهام والأحداث والمناسبات</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportData} className="flex items-center gap-2 px-4 py-2 card-solid text-earth-600 dark:text-earth-400 rounded-xl text-sm font-medium border border-earth-200 dark:border-night-700 hover:bg-earth-50 dark:hover:bg-night-700 transition-all"><Download className="w-4 h-4" /><span className="hidden sm:inline">تصدير</span></button>
          <button onClick={handleBulkReset} className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"><Trash2 className="w-4 h-4" /><span className="hidden sm:inline">إعادة تعيين</span></button>
          {activeAdminTab === "tasks" && <button onClick={() => { setEditingTask(null); setIsTaskFormOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-earth-600 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"><Plus className="w-4 h-4" />إضافة مهمة</button>}
          {activeAdminTab === "events" && <button onClick={() => { setEditingEvent(null); setIsEventFormOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-earth-600 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"><Plus className="w-4 h-4" />إضافة حدث</button>}
        </div>
      </div>

      <div className="flex items-center gap-2 card-solid p-1.5">
        <button onClick={() => setActiveAdminTab("tasks")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${activeAdminTab === "tasks" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm border border-primary-200" : "text-earth-500 dark:text-earth-400 hover:bg-earth-50 dark:hover:bg-night-800"}`}>
          <ListTodo className="w-4 h-4" />المهام<span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-earth-100 dark:bg-night-700 text-earth-500">{stats.total}</span>
        </button>
        <button onClick={() => setActiveAdminTab("events")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${activeAdminTab === "events" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm border border-primary-200" : "text-earth-500 dark:text-earth-400 hover:bg-earth-50 dark:hover:bg-night-800"}`}>
          <CalendarDays className="w-4 h-4" />الأحداث<span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-earth-100 dark:bg-night-700 text-earth-500">{stats.eventStats.total}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card-solid p-3 sm:p-4 text-center"><BarChart3 className="w-5 h-5 text-primary-500 mx-auto mb-1" /><p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{stats.total}</p><p className="text-[10px] text-earth-400">إجمالي المهام</p></div>
        <div className="card-solid p-3 sm:p-4 text-center"><CheckCircle2 className="w-5 h-5 text-earth-500 mx-auto mb-1" /><p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{stats.completed}</p><p className="text-[10px] text-earth-400">مكتمل</p></div>
        {activeAdminTab === "events" ? (<><div className="card-solid p-3 sm:p-4 text-center"><Cake className="w-5 h-5 text-pink-500 mx-auto mb-1" /><p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{stats.eventStats.birthdays}</p><p className="text-[10px] text-earth-400">أعياد ميلاد</p></div><div className="card-solid p-3 sm:p-4 text-center"><Sparkles className="w-5 h-5 text-earth-500 mx-auto mb-1" /><p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{stats.eventStats.festivals}</p><p className="text-[10px] text-earth-400">مناسبات</p></div></>) : (<><div className="card-solid p-3 sm:p-4 text-center"><Layers className="w-5 h-5 text-earth-500 mx-auto mb-1" /><p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{stats.daily}</p><p className="text-[10px] text-earth-400">يومية</p></div><div className="card-solid p-3 sm:p-4 text-center"><Layers className="w-5 h-5 text-earth-500 mx-auto mb-1" /><p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{stats.course}</p><p className="text-[10px] text-earth-400">دورة</p></div></>)}
        <div className="card-solid p-3 sm:p-4 text-center"><AlertTriangle className="w-5 h-5 text-earth-500 mx-auto mb-1" /><p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{stats.highPriority}</p><p className="text-[10px] text-earth-400">عالية</p></div>
        <div className="card-solid p-3 sm:p-4 text-center"><Layers className="w-5 h-5 text-earth-500 mx-auto mb-1" /><p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{stats.side}</p><p className="text-[10px] text-earth-400">جانبية</p></div>
      </div>

      {activeAdminTab === "tasks" && (
        <div className="card-solid overflow-hidden">
          <div className="border-b border-earth-100 dark:border-night-800">
            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن مهمة..." className="input-warm pr-10" /></div>
              <div className="flex items-center gap-2 flex-wrap">
                {tabs.map((tab) => (
                  <button key={tab.value} onClick={() => { setActiveTab(tab.value); setShowDayFilter(false); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.value ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm border border-primary-200" : "text-earth-500 dark:text-earth-400 hover:bg-earth-50 dark:hover:bg-night-800 border border-transparent"}`}>
                    {tab.label}<span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.value ? "bg-primary-200 dark:bg-primary-800 text-primary-700" : "bg-earth-100 dark:bg-night-700 text-earth-500"}`}>{tab.count}</span>
                  </button>
                ))}
                {activeTab === "course" && (
                  <div className="relative mr-auto">
                    <button onClick={() => setShowDayFilter(!showDayFilter)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${dayFilter !== "all" ? "bg-accent-50 dark:bg-accent-900/30 text-accent-700 border border-accent-200" : "text-earth-400 hover:bg-earth-50 dark:hover:bg-night-800 border border-transparent"}`}>
                      <CalendarDays className="w-3.5 h-3.5" />{dayFilter !== "all" ? DAYS_IN_ARABIC[dayFilter] : "كل الأيام"}
                    </button>
                    {showDayFilter && (
                      <div className="absolute left-0 top-full mt-1 z-20 card-solid shadow-xl border border-earth-200 dark:border-night-700 p-2 min-w-[140px] animate-scale-in">
                        <button onClick={() => { setDayFilter("all"); setShowDayFilter(false); }} className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium ${dayFilter === "all" ? "bg-accent-50 dark:bg-accent-900/30 text-accent-700" : "text-earth-500 hover:bg-earth-50"}`}>كل الأيام</button>
                        {(Object.entries(DAYS_IN_ARABIC) as [DayOfWeek, string][]).map(([value, label]) => (
                          <button key={value} onClick={() => { setDayFilter(value); setShowDayFilter(false); }} className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium ${dayFilter === value ? "bg-accent-50 dark:bg-accent-900/30 text-accent-700" : "text-earth-500 hover:bg-earth-50"}`}>{label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <TaskList tasks={filteredTasks} title="" emptyMessage={searchQuery ? "لا توجد نتائج للبحث" : activeTab === "all" ? "لا توجد مهام. أضف أول مهمة الآن!" : `لا توجد مهام ${CATEGORIES_IN_ARABIC[activeTab]}`}
              onToggle={toggleTaskCompletion} onEdit={(id, data) => editTask(id, data)} onDelete={(id) => setShowConfirmDelete(id)} showAddButton={false} showCategoryFilter={false} />
          </div>
        </div>
      )}

      {activeAdminTab === "events" && (
        <div className="card-solid overflow-hidden">
          <div className="border-b border-earth-100 dark:border-night-800">
            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" /><input type="text" value={eventSearchQuery} onChange={(e) => setEventSearchQuery(e.target.value)} placeholder="ابحث عن حدث..." className="input-warm pr-10" /></div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setEventTypeFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${eventTypeFilter === "all" ? "bg-earth-100 dark:bg-night-700 border-earth-300 dark:border-earth-600 text-earth-700" : "bg-white dark:bg-night-800 border-earth-200 dark:border-night-700 text-earth-500 dark:text-earth-400 hover:border-earth-300"}`}>الكل</button>
                {Object.entries(EVENT_TYPES_IN_ARABIC).map(([type, label]) => (
                  <button key={type} onClick={() => setEventTypeFilter(type)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${eventTypeFilter === type ? "border-current shadow-sm" : "bg-white dark:bg-night-800 border-earth-200 dark:border-night-700 text-earth-500 dark:text-earth-400 hover:border-earth-300"}`}
                    style={{ borderColor: eventTypeFilter === type ? EVENT_TYPE_COLORS[type as keyof typeof EVENT_TYPE_COLORS] : undefined, backgroundColor: eventTypeFilter === type ? EVENT_TYPE_COLORS[type as keyof typeof EVENT_TYPE_COLORS] + "10" : undefined, color: eventTypeFilter === type ? EVENT_TYPE_COLORS[type as keyof typeof EVENT_TYPE_COLORS] : undefined }}>
                    {EVENT_TYPE_ICONS[type as keyof typeof EVENT_TYPE_ICONS]} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {filteredEvents.length > 0 ? (
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 rounded-2xl border-2 card-solid border-earth-200 dark:border-night-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: EVENT_TYPE_COLORS[event.type] + "20" }}>{EVENT_TYPE_ICONS[event.type]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-earth-900 dark:text-earth-50">{event.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${EVENT_TYPE_BG[event.type]}`}>{EVENT_TYPES_IN_ARABIC[event.type]}</span>
                      </div>
                      <p className="text-xs text-earth-500 dark:text-earth-400">{event.date}{event.recurringYearly && " • يتكرر سنوياً"}{event.description && ` • ${event.description}`}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingEvent(event); setIsEventFormOpen(true); }} className="p-2 rounded-lg text-earth-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setShowConfirmEventDelete(event.id)} className="p-2 rounded-lg text-earth-400 hover:text-warm-600 hover:bg-warm-50 dark:hover:bg-warm-900/30 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="w-12 h-12 text-earth-300 dark:text-earth-600 mb-4" />
                <p className="text-earth-400 dark:text-earth-500 font-medium">{eventSearchQuery ? "لا توجد نتائج للبحث" : "لا توجد أحداث. أضف أول حدث الآن!"}</p>
                <button onClick={() => { setEditingEvent(null); setIsEventFormOpen(true); }} className="mt-4 flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"><Plus className="w-4 h-4" />أضف حدث جديد</button>
              </div>
            )}
          </div>
        </div>
      )}

      <TaskForm isOpen={isTaskFormOpen} onClose={() => { setIsTaskFormOpen(false); setEditingTask(null); }} onSubmit={editingTask ? (data) => { editTask(editingTask.id, data); setEditingTask(null); setIsTaskFormOpen(false); } : (data) => { addTask(data); setIsTaskFormOpen(false); }} editTask={editingTask} />
      <EventForm isOpen={isEventFormOpen} onClose={() => { setIsEventFormOpen(false); setEditingEvent(null); }} onSubmit={editingEvent ? (data) => { if (editingEvent) { editEvent(editingEvent.id, data); setEditingEvent(null); setIsEventFormOpen(false); } } : (data) => { addEvent(data); setIsEventFormOpen(false); }} editEvent={editingEvent} />

      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm card-solid p-6 animate-scale-in border-red-200 dark:border-red-700">
            <div className="text-center"><div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" /></div><h3 className="text-lg font-bold text-earth-900 dark:text-earth-50 mb-2">حذف المهمة</h3><p className="text-sm text-earth-500 dark:text-earth-400 mb-6">هل أنت متأكد؟</p><div className="flex items-center gap-3"><button onClick={() => { deleteTask(showConfirmDelete); setShowConfirmDelete(null); }} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-all">نعم، احذف</button><button onClick={() => setShowConfirmDelete(null)} className="flex-1 px-4 py-3 bg-earth-100 dark:bg-night-800 text-earth-600 dark:text-earth-400 rounded-xl font-medium text-sm hover:bg-earth-200 dark:hover:bg-night-700 transition-all">إلغاء</button></div></div>
          </div>
        </div>
      )}

      {showConfirmEventDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm card-solid p-6 animate-scale-in border-red-200 dark:border-red-700">
            <div className="text-center"><div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" /></div><h3 className="text-lg font-bold text-earth-900 dark:text-earth-50 mb-2">حذف الحدث</h3><p className="text-sm text-earth-500 dark:text-earth-400 mb-6">هل أنت متأكد؟</p><div className="flex items-center gap-3"><button onClick={() => { deleteEvent(showConfirmEventDelete); setShowConfirmEventDelete(null); }} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-all">نعم، احذف</button><button onClick={() => setShowConfirmEventDelete(null)} className="flex-1 px-4 py-3 bg-earth-100 dark:bg-night-800 text-earth-600 dark:text-earth-400 rounded-xl font-medium text-sm hover:bg-earth-200 dark:hover:bg-night-700 transition-all">إلغاء</button></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
