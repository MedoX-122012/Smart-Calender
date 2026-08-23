import { create } from "zustand";
import { Task, TaskFormData, DayOfWeek, CalendarEvent, EventFormData, Habit, HabitLog } from "@/types";
import { getCurrentDayOfWeek } from "@/utils/scheduleLogic";
import { requestNotificationPermission, shouldTriggerAlarm, triggerAlarm } from "@/utils/alarmManager";
import { db } from "@/lib/database";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

interface AppState {
  tasks: Task[];
  events: CalendarEvent[];
  habits: Habit[];
  habitLogs: HabitLog[];
  isAlarmReady: boolean;
  activeToast: { taskName: string; time: string } | null;
  lastAlarmTriggers: Record<string, number>;

  // Task Actions
  loadTasks: () => Promise<void>;
  addTask: (data: TaskFormData) => Promise<void>;
  editTask: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;

  // Event Actions
  loadEvents: () => Promise<void>;
  addEvent: (data: EventFormData) => Promise<void>;
  editEvent: (id: string, data: Partial<EventFormData>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Habit Actions
  loadHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => Promise<void>;
  editHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitLog: (habitId: string, date: string) => Promise<void>;
  getHabitStreak: (habitId: string) => { current: number; best: number };

  // Alarm actions
  setupAlarms: () => void;
  dismissToast: () => void;

  // Helpers
  getTasksForDay: (day: DayOfWeek) => Task[];
  getTodayTasks: () => Task[];
}

export const useStore = create<AppState>()((set, get) => ({
  tasks: [],
  events: [],
  habits: [],
  habitLogs: [],
  isAlarmReady: false,
  activeToast: null,
  lastAlarmTriggers: {},

  // === Task Actions ===
  loadTasks: async () => {
    try {
      const savedTasks = await db.getAllTasks();
      set({ tasks: savedTasks });
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
    requestNotificationPermission().then((granted) => set({ isAlarmReady: granted }));
  },

  addTask: async (data: TaskFormData) => {
    const newTask: Task = {
      id: generateId(), title: data.title, description: data.description, category: data.category,
      time: data.time, dayOfWeek: data.dayOfWeek, isRecurring: data.isRecurring,
      isCompleted: false, hasAlarm: data.hasAlarm, alarmTime: data.hasAlarm ? data.alarmTime : null,
      priority: data.priority, createdAt: Date.now(),
    };
    try {
      await db.addTask(newTask);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (err) { console.error("Error adding task:", err); }
  },

  editTask: async (id: string, data: Partial<TaskFormData>) => {
    const changes: Partial<Task> = {};
    if (data.title !== undefined) changes.title = data.title;
    if (data.description !== undefined) changes.description = data.description;
    if (data.category !== undefined) changes.category = data.category;
    if (data.time !== undefined) changes.time = data.time;
    if (data.dayOfWeek !== undefined) changes.dayOfWeek = data.dayOfWeek;
    if (data.isRecurring !== undefined) changes.isRecurring = data.isRecurring;
    if (data.hasAlarm !== undefined) { changes.hasAlarm = data.hasAlarm; changes.alarmTime = data.hasAlarm ? data.alarmTime : null; }
    if (data.priority !== undefined) changes.priority = data.priority;
    try {
      await db.updateTask(id, changes);
      set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)) }));
    } catch (err) { console.error("Error editing task:", err); }
  },

  deleteTask: async (id: string) => {
    try { await db.deleteTask(id); set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })); }
    catch (err) { console.error("Error deleting task:", err); }
  },

  toggleTaskCompletion: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const newCompleted = !task.isCompleted;
    try {
      await db.toggleTaskCompletion(id, newCompleted);
      set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, isCompleted: newCompleted } : t)) }));
    } catch (err) { console.error("Error toggling task:", err); }
  },

  // === Event Actions ===
  loadEvents: async () => {
    try { const savedEvents = await db.getAllEvents(); set({ events: savedEvents }); }
    catch (err) { console.error("Error loading events:", err); }
  },

  addEvent: async (data: EventFormData) => {
    const newEvent: CalendarEvent = {
      id: generateId(), title: data.title, description: data.description, date: data.date,
      type: data.type, color: data.color, isRecurring: data.isRecurring,
      recurringYearly: data.recurringYearly, createdAt: Date.now(),
    };
    try { await db.addEvent(newEvent); set((state) => ({ events: [...state.events, newEvent] })); }
    catch (err) { console.error("Error adding event:", err); }
  },

  editEvent: async (id: string, data: Partial<EventFormData>) => {
    const changes: Partial<CalendarEvent> = {};
    if (data.title !== undefined) changes.title = data.title;
    if (data.description !== undefined) changes.description = data.description;
    if (data.date !== undefined) changes.date = data.date;
    if (data.type !== undefined) { changes.type = data.type; changes.color = data.color; }
    if (data.isRecurring !== undefined) changes.isRecurring = data.isRecurring;
    if (data.recurringYearly !== undefined) changes.recurringYearly = data.recurringYearly;
    try { await db.updateEvent(id, changes); set((state) => ({ events: state.events.map((e) => (e.id === id ? { ...e, ...changes } : e)) })); }
    catch (err) { console.error("Error editing event:", err); }
  },

  deleteEvent: async (id: string) => {
    try { await db.deleteEvent(id); set((state) => ({ events: state.events.filter((e) => e.id !== id) })); }
    catch (err) { console.error("Error deleting event:", err); }
  },

  // === Habit Actions ===
  loadHabits: async () => {
    try {
      const [habits, habitLogs] = await Promise.all([db.getAllHabits(), db.getAllHabitLogs()]);
      set({ habits, habitLogs });
    } catch (err) { console.error("Error loading habits:", err); }
  },

  addHabit: async (data) => {
    const newHabit: Habit = { ...data, id: generateId(), createdAt: Date.now() };
    try { await db.addHabit(newHabit); set((state) => ({ habits: [...state.habits, newHabit] })); }
    catch (err) { console.error("Error adding habit:", err); }
  },

  editHabit: async (id: string, data: Partial<Habit>) => {
    try { await db.updateHabit(id, data); set((state) => ({ habits: state.habits.map((h) => (h.id === id ? { ...h, ...data } : h)) })); }
    catch (err) { console.error("Error editing habit:", err); }
  },

  deleteHabit: async (id: string) => {
    try {
      await Promise.all([
        db.deleteHabit(id),
        ...get().habitLogs.filter((l) => l.habitId === id).map((l) => db.deleteHabitLog(l.id)),
      ]);
      set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
        habitLogs: state.habitLogs.filter((l) => l.habitId !== id),
      }));
    } catch (err) { console.error("Error deleting habit:", err); }
  },

  toggleHabitLog: async (habitId: string, date: string) => {
    const existingLog = get().habitLogs.find((l) => l.habitId === habitId && l.date === date);
    try {
      if (existingLog) {
        await db.deleteHabitLog(existingLog.id);
        set((state) => ({ habitLogs: state.habitLogs.filter((l) => l.id !== existingLog.id) }));
      } else {
        const newLog: HabitLog = { id: generateId(), habitId, date, completed: true };
        await db.addHabitLog(newLog);
        set((state) => ({ habitLogs: [...state.habitLogs, newLog] }));
      }
    } catch (err) { console.error("Error toggling habit log:", err); }
  },

  getHabitStreak: (habitId: string) => {
    const logs = get().habitLogs.filter((l) => l.habitId === habitId && l.completed);
    const dates = [...new Set(logs.map((l) => l.date))].sort((a, b) => b.localeCompare(a));
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    if (dates.length === 0) return { current: 0, best: 0 };

    // Calculate current streak
    const today = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    if (dates[0] === today || dates[0] === yesterdayDate) {
      let streakDate = dates[0];
      for (let i = 0; i < dates.length; i++) {
        const expected = new Date(new Date(streakDate).getTime() - i * 86400000).toISOString().split("T")[0];
        if (dates.includes(expected)) {
          currentStreak++;
        } else break;
      }
    }

    // Calculate best streak
    const sortedAsc = [...dates].sort((a, b) => a.localeCompare(b));
    for (let i = 0; i < sortedAsc.length; i++) {
      if (i === 0) { tempStreak = 1; }
      else {
        const prevDate = new Date(new Date(sortedAsc[i]).getTime() - 86400000).toISOString().split("T")[0];
        if (sortedAsc[i - 1] === prevDate) { tempStreak++; }
        else { bestStreak = Math.max(bestStreak, tempStreak); tempStreak = 1; }
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    return { current: currentStreak, best: bestStreak };
  },

  // === Alarm Actions ===
  setupAlarms: () => {
    setInterval(() => {
      const state = get();
      const today = getCurrentDayOfWeek();
      state.tasks.filter((task) => task.hasAlarm && task.alarmTime && (task.category !== "course" || task.dayOfWeek === today))
        .forEach((task) => {
          if (task.alarmTime) {
            const lastTriggered = state.lastAlarmTriggers[task.id] || null;
            if (shouldTriggerAlarm(task.alarmTime, lastTriggered)) {
              triggerAlarm(task.title, task.time);
              set({ activeToast: { taskName: task.title, time: task.time }, lastAlarmTriggers: { ...state.lastAlarmTriggers, [task.id]: Date.now() } });
            }
          }
        });
    }, 30000);
  },

  dismissToast: () => set({ activeToast: null }),

  // === Helpers ===
  getTasksForDay: (day: DayOfWeek) => {
    return get().tasks.filter((task) => {
      if (task.category === "course") return task.dayOfWeek === day;
      return task.category === "daily" || task.category === "side";
    });
  },

  getTodayTasks: () => {
    return get().getTasksForDay(getCurrentDayOfWeek());
  },
}));
