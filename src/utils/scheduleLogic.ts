import { DayOfWeek, Task } from "@/types";
import { defaultDailyTasks, defaultCourseTasks, restDayTasks } from "@/data/defaultTasks";

/**
 * Get the current day of week in English
 */
export function getCurrentDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[new Date().getDay()];
}

/**
 * Get day name in Arabic
 */
export function getDayNameInArabic(day: DayOfWeek): string {
  const names: Record<DayOfWeek, string> = {
    sunday: "الأحد",
    monday: "الإثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
  };
  return names[day];
}

/**
 * Determine the schedule type for a given day
 */
export function getDayRoutineType(day: DayOfWeek): "daily" | "course" | "rest" {
  if (day === "friday") {
    return "rest";
  }
  if (day === "saturday" || day === "tuesday") {
    return "course";
  }
  return "daily";
}

/**
 * Get the routine description in Arabic
 */
export function getRoutineDescription(day: DayOfWeek): string {
  const type = getDayRoutineType(day);
  const dayName = getDayNameInArabic(day);

  switch (type) {
    case "rest":
      return `📅 ${dayName} - يوم راحة كامل 🎉`;
    case "course":
      return `📅 ${dayName} - جدول الدورة 💻`;
    case "daily":
      return `📅 ${dayName} - الروتين اليومي ☀️`;
  }
}

/**
 * Get default tasks for a given day
 */
export function getDefaultTasksForDay(day: DayOfWeek): Omit<Task, "id" | "createdAt" | "isCompleted">[] {
  const routineType = getDayRoutineType(day);

  if (routineType === "rest") {
    return restDayTasks;
  }

  if (routineType === "course") {
    // Course days: course tasks + daily tasks (without prayer duplicates)
    const courseTasksForDay = defaultCourseTasks.filter(
      (task) => !task.dayOfWeek || task.dayOfWeek === day
    );
    // Add daily tasks but exclude prayer ones that are already covered
    // Actually, let's include all daily tasks for course days too
    return [...defaultDailyTasks, ...courseTasksForDay];
  }

  return defaultDailyTasks;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Check if current time matches a given time (within a window)
 */
export function isTimeMatch(timeStr: string, windowMinutes: number = 1): boolean {
  const now = new Date();
  const [hours, minutes] = timeStr.split(":").map(Number);
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = hours * 60 + minutes;

  return Math.abs(totalMinutes - targetMinutes) <= windowMinutes;
}

/**
 * Sort tasks by time
 */
export function sortTasksByTime(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const [aH, aM] = a.time.split(":").map(Number);
    const [bH, bM] = b.time.split(":").map(Number);
    return aH * 60 + aM - (bH * 60 + bM);
  });
}

/**
 * Get tasks for the current day from a full task list
 */
export function getTasksForToday(tasks: Task[]): Task[] {
  const today = getCurrentDayOfWeek();
  return tasks.filter((task) => {
    if (task.category === "course") {
      return task.dayOfWeek === today;
    }
    return task.category === "daily" || task.category === "side";
  });
}
