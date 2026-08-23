import { create } from "zustand";
import { User, AuthFormData } from "@/types";
import { db } from "@/lib/database";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "jadwal-salt-2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

function generateToken(): string {
  return crypto.randomUUID?.() || generateId() + "-" + Date.now().toString(36);
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;

  signUp: (data: AuthFormData) => Promise<boolean>;
  logIn: (data: AuthFormData) => Promise<boolean>;
  logOut: () => Promise<void>;
  enterAsGuest: () => void;
  exitGuest: () => void;
  checkSession: () => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
  error: null,
  success: null,

  signUp: async (data) => {
    set({ error: null });
    try {
      if (!data.name?.trim()) {
        set({ error: "الاسم مطلوب" });
        return false;
      }
      if (!data.email.trim()) {
        set({ error: "البريد الإلكتروني مطلوب" });
        return false;
      }
      if (data.password.length < 6) {
        set({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
        return false;
      }

      const existingUser = await db.getUserByEmail(data.email.toLowerCase().trim());
      if (existingUser) {
        set({ error: "البريد الإلكتروني مستخدم بالفعل" });
        return false;
      }

      const passwordHash = await hashPassword(data.password);
      const newUser: User = {
        id: generateId(),
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash,
        createdAt: Date.now(),
      };

      await db.addUser(newUser);

      // Create session
      const token = generateToken();
      const session = {
        userId: newUser.id,
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      await db.createSession(session);
      localStorage.setItem("jadwal-session-token", token);

      const { passwordHash: _, ...safeUser } = newUser;
      localStorage.removeItem("jadwal-guest-mode");
      set({ user: safeUser as User, isAuthenticated: true, isGuest: false, isLoading: false });
      return true;
    } catch (err) {
      console.error("Sign up error:", err);
      set({ error: "حدث خطأ أثناء إنشاء الحساب" });
      return false;
    }
  },

  logIn: async (data) => {
    set({ error: null });
    try {
      if (!data.email.trim() || !data.password) {
        set({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
        return false;
      }

      const existingUser = await db.getUserByEmail(data.email.toLowerCase().trim());
      if (!existingUser) {
        set({ error: "البريد الإلكتروني غير مسجل" });
        return false;
      }

      const isValid = await verifyPassword(data.password, existingUser.passwordHash);
      if (!isValid) {
        set({ error: "كلمة المرور غير صحيحة" });
        return false;
      }

      // Create session
      const token = generateToken();
      const session = {
        userId: existingUser.id,
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };
      await db.createSession(session);
      localStorage.setItem("jadwal-session-token", token);

      const { passwordHash: _, ...safeUser } = existingUser;
      localStorage.removeItem("jadwal-guest-mode");
      set({ user: safeUser as User, isAuthenticated: true, isGuest: false, isLoading: false });
      return true;
    } catch (err) {
      console.error("Log in error:", err);
      set({ error: "حدث خطأ أثناء تسجيل الدخول" });
      return false;
    }
  },

  logOut: async () => {
    try {
      const token = localStorage.getItem("jadwal-session-token");
      if (token) {
        await db.deleteSession(token);
        localStorage.removeItem("jadwal-session-token");
      }
    } catch (err) {
      console.error("Log out error:", err);
    }
    set({ user: null, isAuthenticated: false, isGuest: false, isLoading: false });
  },

  enterAsGuest: () => {
    set({ isGuest: true, isAuthenticated: false, isLoading: false });
    localStorage.setItem("jadwal-guest-mode", "true");
  },

  exitGuest: () => {
    set({ isGuest: false, isAuthenticated: false, isLoading: false });
    localStorage.removeItem("jadwal-guest-mode");
  },

  checkSession: async () => {
    try {
      // Check guest mode first
      const isGuestMode = localStorage.getItem("jadwal-guest-mode");
      if (isGuestMode === "true") {
        set({ isGuest: true, isAuthenticated: false, isLoading: false });
        return;
      }

      const token = localStorage.getItem("jadwal-session-token");
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const session = await db.getSession(token);
      if (!session || session.expiresAt < Date.now()) {
        localStorage.removeItem("jadwal-session-token");
        if (session) await db.deleteSession(token);
        set({ isLoading: false });
        return;
      }

      // Session is valid, but we don't store user on session. Let's use userId to load user.
      const users = await db.users.toArray();
      const user = users.find((u) => u.id === session.userId);
      if (!user) {
        localStorage.removeItem("jadwal-session-token");
        await db.deleteSession(token);
        set({ isLoading: false });
        return;
      }

      const { passwordHash: _, ...safeUser } = user;
      set({ user: safeUser as User, isAuthenticated: true, isLoading: false });
    } catch (err) {
      console.error("Session check error:", err);
      localStorage.removeItem("jadwal-session-token");
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),

  updateProfile: async (data) => {
    const user = get().user;
    if (!user) return false;
    set({ error: null, success: null });
    try {
      // If email is changing, check uniqueness
      if (data.email && data.email.toLowerCase().trim() !== user.email) {
        const existing = await db.getUserByEmail(data.email.toLowerCase().trim());
        if (existing && existing.id !== user.id) {
          set({ error: "البريد الإلكتروني مستخدم بالفعل" });
          return false;
        }
        data.email = data.email.toLowerCase().trim();
      }
      if (data.name) data.name = data.name.trim();

      await db.updateUser(user.id, data);
      set({ user: { ...user, ...data }, success: "تم تحديث الملف الشخصي بنجاح" });
      return true;
    } catch (err) {
      console.error("Update profile error:", err);
      set({ error: "حدث خطأ أثناء تحديث الملف الشخصي" });
      return false;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const user = get().user;
    if (!user) return false;
    set({ error: null, success: null });
    try {
      // Load full user from DB to verify current password
      const fullUser = await db.users.get(user.id);
      if (!fullUser) {
        set({ error: "المستخدم غير موجود" });
        return false;
      }

      const isValid = await verifyPassword(currentPassword, fullUser.passwordHash);
      if (!isValid) {
        set({ error: "كلمة المرور الحالية غير صحيحة" });
        return false;
      }

      if (newPassword.length < 6) {
        set({ error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" });
        return false;
      }

      const newHash = await hashPassword(newPassword);
      await db.updateUser(user.id, { passwordHash: newHash });
      set({ success: "تم تغيير كلمة المرور بنجاح" });
      return true;
    } catch (err) {
      console.error("Change password error:", err);
      set({ error: "حدث خطأ أثناء تغيير كلمة المرور" });
      return false;
    }
  },
}));
