export type TaskCategory = "daily" | "course" | "side";
export type DayOfWeek = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  time: string;
  dayOfWeek?: DayOfWeek;
  isRecurring: boolean;
  isCompleted: boolean;
  hasAlarm: boolean;
  alarmTime: string | null;
  createdAt: number;
  priority: "low" | "medium" | "high";
}

export interface TaskFormData {
  title: string;
  description: string;
  category: TaskCategory;
  time: string;
  dayOfWeek?: DayOfWeek;
  isRecurring: boolean;
  hasAlarm: boolean;
  alarmTime: string;
  priority: "low" | "medium" | "high";
}

// === Calendar Event Types ===
export type EventType = "birthday" | "festival" | "appointment" | "reminder" | "holiday" | "other";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: EventType;
  color: string;
  isRecurring: boolean;
  recurringYearly: boolean;
  createdAt: number;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  type: EventType;
  color: string;
  isRecurring: boolean;
  recurringYearly: boolean;
}

// === Habit Types ===
export type HabitType = "good" | "bad";

export interface Habit {
  id: string;
  title: string;
  description: string;
  type: HabitType;
  targetCount: number;
  createdAt: number;
  color: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export const HABIT_TYPE_LABELS: Record<HabitType, string> = {
  good: "عادة حسنة",
  bad: "عادة سيئة",
};

export const HABIT_TYPE_COLORS: Record<HabitType, string> = {
  good: "#6d8c56",  // accent-500 - earthy green
  bad: "#e8905a",   // warm-500 - earthy orange
};

export const HABIT_TYPE_BG: Record<HabitType, string> = {
  good: "bg-accent-50 border-accent-200 text-accent-700",
  bad: "bg-warm-50 border-warm-200 text-warm-700",
};

// === Islamic Types ===
export interface Surah {
  id: number;
  name: string;
  nameEnglish: string;
  versesCount: number;
  revelationType: "meccan" | "medinan";
}

export interface AthkarItem {
  id: string;
  category: "morning" | "evening" | "sleep" | "waking" | "prayer" | "general";
  text: string;
  translation?: string;
  count: number;
  reference?: string;
}

export interface SunnahItem {
  id: string;
  title: string;
  description: string;
  category: "prayer" | "fasting" | "daily" | "manners" | "worship";
  source?: string;
  isCompleted?: boolean;
}

export interface ZekrProgress {
  id: string;
  zekrId: string;
  date: string;
  currentCount: number;
  completed: boolean;
}

// === Auth Types ===
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  createdAt: number;
}

export interface UserSession {
  userId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

// === Constants ===
export const DAYS_IN_ARABIC: Record<DayOfWeek, string> = {
  sunday: "الأحد", monday: "الإثنين", tuesday: "الثلاثاء", wednesday: "الأربعاء",
  thursday: "الخميس", friday: "الجمعة", saturday: "السبت",
};

export const SHORT_DAYS_IN_ARABIC: Record<DayOfWeek, string> = {
  sunday: "أحد", monday: "إثن", tuesday: "ثلاث", wednesday: "أربع",
  thursday: "خميس", friday: "جمعة", saturday: "سبت",
};

export const MONTHS_IN_ARABIC: string[] = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export const CATEGORIES_IN_ARABIC: Record<TaskCategory, string> = {
  daily: "مهام يومية", course: "مهام الدورة", side: "مهام جانبية",
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  daily: "bg-primary-500", course: "bg-accent-500", side: "bg-warm-500",
};

export const CATEGORY_BG_LIGHT: Record<TaskCategory, string> = {
  daily: "bg-primary-50 border-primary-200", course: "bg-accent-50 border-accent-200", side: "bg-warm-50 border-warm-200",
};

export const PRIORITY_LABELS: Record<string, string> = { low: "منخفضة", medium: "متوسطة", high: "عالية" };
export const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-earth-100 text-earth-600 border-earth-300",
  medium: "bg-warm-50 text-warm-700 border-warm-300",
  high: "bg-red-50 text-red-700 border-red-300",
};

export const EVENT_TYPES_IN_ARABIC: Record<EventType, string> = {
  birthday: "عيد ميلاد", festival: "مناسبة / عيد", appointment: "موعد", reminder: "تذكير", holiday: "إجازة", other: "أخرى",
};
export const EVENT_TYPE_ICONS: Record<EventType, string> = {
  birthday: "🎂", festival: "🎉", appointment: "📅", reminder: "🔔", holiday: "🏖️", other: "📌",
};
export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  birthday: "#ec4899", festival: "#f59e0b", appointment: "#3b82f6", reminder: "#8b5cf6", holiday: "#10b981", other: "#6b7280",
};
export const EVENT_TYPE_BG: Record<EventType, string> = {
  birthday: "bg-pink-50 border-pink-200 text-pink-700",
  festival: "bg-warm-50 border-warm-200 text-warm-700",
  appointment: "bg-primary-50 border-primary-200 text-primary-700",
  reminder: "bg-violet-50 border-violet-200 text-violet-700",
  holiday: "bg-accent-50 border-accent-200 text-accent-700",
  other: "bg-earth-50 border-earth-200 text-earth-700",
};

export const ATHKAR_CATEGORIES: Record<string, string> = {
  morning: "أذكار الصباح",
  evening: "أذكار المساء",
  sleep: "أذكار النوم",
  waking: "أذكار الاستيقاظ",
  prayer: "أذكار الصلاة",
  general: "أذكار عامة",
};

export const SUNNAH_CATEGORIES: Record<string, string> = {
  prayer: "سنن الصلاة",
  fasting: "سنن الصيام",
  daily: "سنن يومية",
  manners: "الآداب الإسلامية",
  worship: "العبادات",
};
