import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authService } from "../services";
import toast from "react-hot-toast";

const AdminAuthContext = createContext(null);
const LS_KEY = "uni_admin_session";
const MAX_TIMEOUT_MS = 2147483647; // 32-bit int limit (~24.8 days)

/**
 * Normalizes backend expiration times (handles seconds vs milliseconds)
 */
const normalizeExpiresInMs = (expiresIn) => {
  if (!expiresIn) return 24 * 60 * 60 * 1000; // Default: 24h
  const num = Number(expiresIn);
  // If less than 1 year in seconds (~3.15e7), it was likely provided in seconds
  return num < 31536000 ? num * 1000 : num;
};

export default function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearStoredSession = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    sessionStorage.removeItem(LS_KEY);
  }, []);

  const logout = useCallback(
    async (expired = false) => {
      clearTimer();

      if (!expired) {
        try {
          await authService.logout();
        } catch (err) {
          console.error("Logout request failed:", err);
        }
      }

      setAdmin(null);
      setToken(null);
      clearStoredSession();

      if (expired) {
        toast.error("Session expired. Please log in again.");
      }
    },
    [clearTimer, clearStoredSession]
  );

  const scheduleAutoLogout = useCallback(
    (expiresInMs) => {
      clearTimer();

      if (expiresInMs <= 0) {
        logout(true);
        return;
      }

      // Guard against 32-bit setTimeout integer overflow
      const delay = Math.min(expiresInMs, MAX_TIMEOUT_MS);
      timerRef.current = setTimeout(() => logout(true), delay);
    },
    [clearTimer, logout]
  );

  const login = useCallback(
    async ({ email, password, remember }) => {
      try {
        const result = await authService.login({ email, password });

        const payload =
          result?.data && typeof result.data === "object"
            ? result.data
            : result;

        const adminObj =
          payload?.admin || payload?.user || payload?.data || payload;
        const jwtToken = payload?.token || result?.token;
        const rawExpiresIn =
          payload?.expiresIn ||
          result?.expiresIn ||
          payload?.expiresInMs ||
          result?.expiresInMs;

        if (!jwtToken) {
          throw new Error("Authentication token missing in server response");
        }

        const expiresInMs = normalizeExpiresInMs(rawExpiresIn);
        const expiresAtMs = Date.now() + expiresInMs;

        setAdmin(adminObj);
        setToken(jwtToken);
        scheduleAutoLogout(expiresInMs);

        // Store session based on "remember me"
        clearStoredSession();
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(
          LS_KEY,
          JSON.stringify({
            admin: adminObj,
            token: jwtToken,
            expiresAtMs,
          })
        );

        return adminObj;
      } catch (error) {
        console.error("Login failed:", error);
        toast.error(
          error?.response?.data?.message || error?.message || "Login failed"
        );
        throw error;
      }
    },
    [clearStoredSession, scheduleAutoLogout]
  );

  // Initial Session Hydration
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY) || sessionStorage.getItem(LS_KEY);

    if (!raw) {
      setLoading(false);
      return;
    }

    try {
      const saved = JSON.parse(raw);

      if (!saved?.expiresAtMs || saved.expiresAtMs <= Date.now()) {
        clearStoredSession();
      } else {
        setAdmin(saved.admin || null);
        setToken(saved.token || null);
        scheduleAutoLogout(saved.expiresAtMs - Date.now());
      }
    } catch {
      clearStoredSession();
    } finally {
      setLoading(false);
    }

    return () => clearTimer();
  }, [clearStoredSession, scheduleAutoLogout, clearTimer]);

  // Sync session across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === LS_KEY && !e.newValue) {
        // Logged out in another tab
        setAdmin(null);
        setToken(null);
        clearTimer();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [clearTimer]);

  const value = useMemo(
    () => ({
      admin,
      token,
      loading,
      isAuthed: !!token,
      login,
      logout,
    }),
    [admin, token, loading, login, logout]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};