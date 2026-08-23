import Dexie, { type Table } from "dexie";
import { Task, CalendarEvent, Habit, HabitLog, User, UserSession } from "@/types";

export class JadwalDatabase extends Dexie {
  tasks!: Table<Task, string>;
  events!: Table<CalendarEvent, string>;
  habits!: Table<Habit, string>;
  habitLogs!: Table<HabitLog, string>;
  users!: Table<User, string>;
  sessions!: Table<UserSession, string>;

  constructor() {
    super("jadwal-yawmi");

    this.version(1).stores({
      tasks: "id, category, dayOfWeek, isCompleted, priority, createdAt",
      events: "id, date, type, isRecurring, recurringYearly, createdAt",
    });

    this.version(2).stores({
      tasks: "id, category, dayOfWeek, isCompleted, priority, createdAt",
      events: "id, date, type, isRecurring, recurringYearly, createdAt",
      habits: "id, type, createdAt",
      habitLogs: "id, habitId, date, completed",
    });

    this.version(3).stores({
      tasks: "id, category, dayOfWeek, isCompleted, priority, createdAt",
      events: "id, date, type, isRecurring, recurringYearly, createdAt",
      habits: "id, type, createdAt",
      habitLogs: "id, habitId, date, completed",
      users: "id, email",
      sessions: "token, userId",
    });
  }

  // === Task Operations ===
  async getAllTasks(): Promise<Task[]> { return this.tasks.orderBy("createdAt").toArray(); }
  async addTask(task: Task): Promise<string> { return this.tasks.add(task); }
  async updateTask(id: string, changes: Partial<Task>): Promise<void> { await this.tasks.update(id, changes); }
  async deleteTask(id: string): Promise<void> { await this.tasks.delete(id); }
  async toggleTaskCompletion(id: string, isCompleted: boolean): Promise<void> { await this.tasks.update(id, { isCompleted }); }
  async getTasksByCategory(category: string): Promise<Task[]> { return this.tasks.where("category").equals(category).toArray(); }
  async clearTasks(): Promise<void> { await this.tasks.clear(); }

  // === Event Operations ===
  async getAllEvents(): Promise<CalendarEvent[]> { return this.events.orderBy("date").toArray(); }
  async addEvent(event: CalendarEvent): Promise<string> { return this.events.add(event); }
  async updateEvent(id: string, changes: Partial<CalendarEvent>): Promise<void> { await this.events.update(id, changes); }
  async deleteEvent(id: string): Promise<void> { await this.events.delete(id); }
  async getEventsByDate(date: string): Promise<CalendarEvent[]> { return this.events.where("date").equals(date).toArray(); }
  async getEventsByMonth(year: number, month: number): Promise<CalendarEvent[]> {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    return this.events.where("date").between(startDate, endDate, true, true).toArray();
  }
  async getEventsByType(type: string): Promise<CalendarEvent[]> { return this.events.where("type").equals(type).toArray(); }

  // === Habit Operations ===
  async getAllHabits(): Promise<Habit[]> { return this.habits.orderBy("createdAt").toArray(); }
  async getHabitsByType(type: string): Promise<Habit[]> { return this.habits.where("type").equals(type).toArray(); }
  async addHabit(habit: Habit): Promise<string> { return this.habits.add(habit); }
  async updateHabit(id: string, changes: Partial<Habit>): Promise<void> { await this.habits.update(id, changes); }
  async deleteHabit(id: string): Promise<void> { await this.habits.delete(id); }

  // === Habit Log Operations ===
  async getHabitLogsByHabit(habitId: string): Promise<HabitLog[]> { return this.habitLogs.where("habitId").equals(habitId).toArray(); }
  async getHabitLogsByDate(date: string): Promise<HabitLog[]> { return this.habitLogs.where("date").equals(date).toArray(); }
  async getHabitLogsByHabitAndDate(habitId: string, date: string): Promise<HabitLog | undefined> {
    return this.habitLogs.where({ habitId, date }).first();
  }
  async addHabitLog(log: HabitLog): Promise<string> { return this.habitLogs.add(log); }
  async updateHabitLog(id: string, changes: Partial<HabitLog>): Promise<void> { await this.habitLogs.update(id, changes); }
  async deleteHabitLog(id: string): Promise<void> { await this.habitLogs.delete(id); }
  async getAllHabitLogs(): Promise<HabitLog[]> { return this.habitLogs.toArray(); }

  // === User Operations ===
  async getUserByEmail(email: string): Promise<User | undefined> { return this.users.where("email").equals(email).first(); }
  async addUser(user: User): Promise<string> { return this.users.add(user); }
  async updateUser(id: string, changes: Partial<User>): Promise<void> { await this.users.update(id, changes); }
  async deleteUser(id: string): Promise<void> { await this.users.delete(id); }

  // === Session Operations ===
  async createSession(session: UserSession): Promise<string> { return this.sessions.add(session); }
  async getSession(token: string): Promise<UserSession | undefined> { return this.sessions.where("token").equals(token).first(); }
  async deleteSession(token: string): Promise<void> { await this.sessions.delete(token); }
  async deleteSessionsForUser(userId: string): Promise<void> {
    await this.sessions.where("userId").equals(userId).delete();
  }
}

export const db = new JadwalDatabase();
