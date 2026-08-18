import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { api, createDevToken } from "@/lib/api-client";
import type { AuthSession, UserRole } from "@/lib/types";

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  loginWithDevRole: (
    role: UserRole,
    fullName?: string,
    email?: string,
    phone?: string
  ) => Promise<void>;
  signUp: (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    role?: UserRole;
  }) => Promise<void>;
  signIn: (identifier: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "ayursutra_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = (next: AuthSession | null) => {
    setSession(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Sign Up into MongoDB
  const signUp = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    role?: UserRole;
  }) => {
    setLoading(true);
    try {
      const res = await api.signUp({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password || "Password@123",
        role: data.role || "PATIENT",
      });

      if (res?.token && res?.user) {
        persist({
          token: res.token,
          uid: res.user.uid,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role as UserRole,
          fullName: res.user.full_name,
        });
        return;
      }
    } catch (err) {
      console.warn("Direct MongoDB signup notice, proceeding with session:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sign In from MongoDB
  const signIn = async (identifier: string, password = "Password@123") => {
    setLoading(true);
    try {
      const res = await api.signIn({ identifier, password });
      if (res?.token && res?.user) {
        persist({
          token: res.token,
          uid: res.user.uid,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role as UserRole,
          fullName: res.user.full_name,
        });
        return;
      }
    } catch (err) {
      console.warn("Direct MongoDB signin notice, falling back to local session:", err);
    } finally {
      setLoading(false);
    }
  };

  // Universal Role Login (Saves to MongoDB)
  const loginWithDevRole = async (
    role: UserRole,
    fullName = "Demo User",
    email?: string,
    phone?: string
  ) => {
    setLoading(true);
    try {
      const userEmail = email?.trim() || `${role.toLowerCase()}@ayursutra.org`;
      const userPhone = phone?.trim() || "+91 98765 43210";
      const userFullName = fullName.trim() || `${role} User`;

      // Try registering/saving into MongoDB
      try {
        const res = await api.signUp({
          full_name: userFullName,
          email: userEmail,
          phone: userPhone,
          password: "Password@123",
          role: role,
        });

        if (res?.token && res?.user) {
          persist({
            token: res.token,
            uid: res.user.uid,
            email: res.user.email,
            phone: res.user.phone,
            role: role,
            fullName: res.user.full_name,
          });
          return;
        }
      } catch (signupErr) {
        // If already exists in MongoDB, sign in
        try {
          const signinRes = await api.signIn({ identifier: userEmail, password: "Password@123" });
          if (signinRes?.token && signinRes?.user) {
            persist({
              token: signinRes.token,
              uid: signinRes.user.uid,
              email: signinRes.user.email,
              phone: signinRes.user.phone,
              role: role,
              fullName: signinRes.user.full_name,
            });
            return;
          }
        } catch (signinErr) {
          console.warn("MongoDB API offline, using local fallback token");
        }
      }

      // Standalone fallback
      const token = createDevToken(role);
      persist({
        token,
        uid: `usr-${role.toLowerCase()}-${Date.now()}`,
        email: userEmail,
        phone: userPhone,
        role: role,
        fullName: userFullName,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => persist(null);

  const value = useMemo(
    () => ({ session, loading, loginWithDevRole, signUp, signIn, logout }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
