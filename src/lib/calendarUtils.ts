import { MONTHS_IN_ARABIC, DayOfWeek, SHORT_DAYS_IN_ARABIC } from "@/types";

// Day name in Arabic starting from Saturday (index 6 in JS getDay())
const ARABIC_DAY_NAMES_SHORT = [
  "أحد",
  "إثن",
  "ثلاث",
  "أربع",
  "خميس",
  "جمعة",
  "سبت",
];

const ARABIC_DAY_NAMES_FULL = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateKey: string; // YYYY-MM-DD
  dayOfWeek: number; // 0=Sun, 6=Sat
}

export interface MonthData {
  year: number;
  month: number; // 0-indexed
  monthName: string;
  days: CalendarDay[];
  firstDayOfWeek: number; // day of week of 1st (0=Sun)
  totalDays: number;
}

/**
 * Get month name in Arabic
 */
export function getArabicMonthName(monthIndex: number): string {
  return MONTHS_IN_ARABIC[monthIndex] || "";
}

/**
 * Get full day name in Arabic
 */
export function getFullArabicDayName(dayIndex: number): string {
  return ARABIC_DAY_NAMES_FULL[dayIndex] || "";
}

/**
 * Get short day name in Arabic
 */
export function getShortArabicDayName(dayIndex: number): string {
  return ARABIC_DAY_NAMES_SHORT[dayIndex] || "";
}

/**
 * Get all day names (short) starting from Sunday
 */
export function getWeekDayNames(): string[] {
  return ARABIC_DAY_NAMES_SHORT;
}

/**
 * Build calendar grid data for a given month/year
 */
export function buildMonthGrid(year: number, month: number): MonthData {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay(); // 0=Sun

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const days: CalendarDay[] = [];

  // Previous month's trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const prevMonth = month - 1 < 0 ? 11 : month - 1;
    const prevYear = month - 1 < 0 ? year - 1 : year;
    days.push({
      day,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: false,
      dateKey: `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      dayOfWeek: 0,
    });
  }

  // Current month's days
  for (let day = 1; day <= totalDays; day++) {
    const dateObj = new Date(year, month, day);
    days.push({
      day,
      month,
      year,
      isCurrentMonth: true,
      isToday: day === todayDate && month === todayMonth && year === todayYear,
      dateKey: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      dayOfWeek: dateObj.getDay(),
    });
  }

  // Next month's leading days to fill the grid
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = month + 1 > 11 ? 0 : month + 1;
      const nextYear = month + 1 > 11 ? year + 1 : year;
      days.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: false,
        dateKey: `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        dayOfWeek: 0,
      });
    }
  }

  return {
    year,
    month,
    monthName: getArabicMonthName(month),
    days,
    firstDayOfWeek,
    totalDays,
  };
}

/**
 * Navigate months
 */
export function navigateMonth(
  year: number,
  month: number,
  direction: "prev" | "next"
): { year: number; month: number } {
  if (direction === "prev") {
    if (month === 0) {
      return { year: year - 1, month: 11 };
    }
    return { year, month: month - 1 };
  } else {
    if (month === 11) {
      return { year: year + 1, month: 0 };
    }
    return { year, month: month + 1 };
  }
}

/**
 * Format date to Arabic string like "15 يناير 2026"
 */
export function formatDateArabic(year: number, month: number, day: number): string {
  const monthName = getArabicMonthName(month);
  return `${day} ${monthName} ${year}`;
}
