import { useState, useMemo } from "react";
import { CalendarEvent, EVENT_TYPES_IN_ARABIC, EVENT_TYPE_ICONS, EVENT_TYPE_COLORS } from "@/types";
import { buildMonthGrid, navigateMonth, formatDateArabic, getWeekDayNames } from "@/lib/calendarUtils";
import { ChevronRight, ChevronLeft, CalendarDays, Plus, Cake, Star, Sparkles } from "lucide-react";

interface CalendarProps {
  events: CalendarEvent[];
  onDateClick: (dateKey: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: () => void;
}

export default function Calendar({ events, onDateClick, onEventClick, onAddEvent }: CalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthData = useMemo(() => buildMonthGrid(currentYear, currentMonth), [currentYear, currentMonth]);
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => { if (!map[event.date]) map[event.date] = []; map[event.date].push(event); });
    return map;
  }, [events]);
  const selectedDateEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  const goToPrevMonth = () => { const r = navigateMonth(currentYear, currentMonth, "prev"); setCurrentYear(r.year); setCurrentMonth(r.month); setSelectedDate(null); };
  const goToNextMonth = () => { const r = navigateMonth(currentYear, currentMonth, "next"); setCurrentYear(r.year); setCurrentMonth(r.month); setSelectedDate(null); };
  const goToToday = () => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); setSelectedDate(null); };
  const handleDayClick = (dateKey: string) => { setSelectedDate(dateKey === selectedDate ? null : dateKey); onDateClick(dateKey); };

  const weekDayNames = getWeekDayNames();

  return (
    <div className="card-solid rounded-3xl overflow-hidden shadow-xl shadow-black/5">
      <div className="p-4 sm:p-6 border-b border-earth-100 dark:border-night-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-earth-500 rounded-xl flex items-center justify-center shadow-sm">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-earth-900 dark:text-earth-50">التقويم</h2>
              <p className="text-xs text-earth-500 dark:text-earth-400">{formatDateArabic(currentYear, currentMonth, 1)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goToToday}
              className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-medium border border-primary-200 dark:border-primary-700 hover:bg-primary-100 transition-all">
              اليوم
            </button>
            <button onClick={onAddEvent}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-earth-600 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <Plus className="w-3.5 h-3.5" />إضافة
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-earth-50 dark:bg-night-800/50 rounded-2xl p-2">
          <button onClick={goToPrevMonth} className="p-2 rounded-xl text-earth-500 dark:text-earth-400 hover:bg-white dark:hover:bg-night-700 hover:text-earth-700 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-earth-900 dark:text-earth-50">{monthData.monthName}</h3>
            <p className="text-xs text-earth-500 dark:text-earth-400">{currentYear}</p>
          </div>
          <button onClick={goToNextMonth} className="p-2 rounded-xl text-earth-500 dark:text-earth-400 hover:bg-white dark:hover:bg-night-700 hover:text-earth-700 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDayNames.map((name, index) => (
            <div key={index} className="text-center py-2 text-xs font-bold text-earth-400 dark:text-earth-500">{name}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthData.days.map((dayData, index) => {
            const dateKey = dayData.dateKey;
            const dayEvents = eventsByDate[dateKey] || [];
            const hasEvents = dayEvents.length > 0;
            return (
              <button key={index} onClick={() => handleDayClick(dateKey)}
                className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl text-sm transition-all duration-200 min-h-[48px] sm:min-h-[56px] ${
                  !dayData.isCurrentMonth ? "text-earth-300 dark:text-earth-700" :
                  dayData.isToday ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-200 dark:ring-primary-700" :
                  selectedDate === dateKey ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-200" :
                  "text-earth-700 dark:text-earth-300 hover:bg-earth-50 dark:hover:bg-night-800"
                }`}>
                <span className={`text-sm leading-tight ${dayData.isToday ? "font-bold" : ""}`}>{dayData.day}</span>
                {hasEvents && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span key={event.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: EVENT_TYPE_COLORS[event.type] || "#6b7280" }} />
                    ))}
                    {dayEvents.length > 3 && <span className="text-[8px] text-earth-400">+{dayEvents.length - 3}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-earth-100 dark:border-night-800 flex-wrap">
          {Object.entries(EVENT_TYPES_IN_ARABIC).slice(0, 4).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EVENT_TYPE_COLORS[type as keyof typeof EVENT_TYPE_COLORS] }} />
              <span className="text-[10px] text-earth-400 dark:text-earth-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="border-t border-earth-100 dark:border-night-800 bg-earth-50/50 dark:bg-night-800/30">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-earth-900 dark:text-earth-50">
                أحداث {formatDateArabic(parseInt(selectedDate.split("-")[0]), parseInt(selectedDate.split("-")[1]) - 1, parseInt(selectedDate.split("-")[2]))}
              </h3>
              <button onClick={onAddEvent} className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 transition-colors">
                <Plus className="w-3 h-3" />إضافة حدث
              </button>
            </div>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedDateEvents.map((event) => (
                  <button key={event.id} onClick={() => onEventClick(event)}
                    className="w-full flex items-center gap-3 p-3 card-solid rounded-xl border border-earth-200 dark:border-night-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-right">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: EVENT_TYPE_COLORS[event.type] + "20" }}>
                      {EVENT_TYPE_ICONS[event.type]}
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <h4 className="text-sm font-semibold text-earth-900 dark:text-earth-50 truncate">{event.title}</h4>
                      <p className="text-xs text-earth-500 dark:text-earth-400 truncate">{EVENT_TYPES_IN_ARABIC[event.type]}{event.recurringYearly && " • سنوي"}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-6 text-center">
                <div>
                  <Sparkles className="w-8 h-8 text-earth-300 dark:text-earth-600 mx-auto mb-2" />
                  <p className="text-sm text-earth-400 dark:text-earth-500">لا توجد أحداث في هذا اليوم</p>
                  <button onClick={onAddEvent} className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 transition-colors">أضف حدثاً جديداً</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
