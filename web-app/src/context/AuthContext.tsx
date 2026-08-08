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

  const loginWithDevRole = async (
    role: UserRole,
    fullName = "Demo User",
    email?: string,
    phone?: string
  ) => {
    setLoading(true);
    try {
      const token = createDevToken(role);
      let verifiedUid = `dev-${role.toLowerCase()}-${Date.now()}`;
      let verifiedEmail = email || `${role.toLowerCase()}@ayursutra.org`;

      // Try calling backend API; if offline or fails to fetch, fall back gracefully
      try {
        const verified = await api.verifyToken(token);
        if (verified?.uid) verifiedUid = verified.uid;
        if (verified?.email) verifiedEmail = verified.email;
      } catch (err) {
        // Standalone/offline fallback
        console.warn("Backend API offline, proceeding with local dev session", err);
      }

      persist({
        token,
        uid: verifiedUid,
        email: email?.trim() || verifiedEmail,
        phone: phone?.trim() || "+91 98765 43210",
        role: role,
        fullName: fullName.trim() || "Ayurvedic Practitioner",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => persist(null);

  const value = useMemo(
    () => ({ session, loading, loginWithDevRole, logout }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
