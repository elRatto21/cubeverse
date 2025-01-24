import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        loading: false,
        error: null,

        login: async (credentials) => {
          set({ loading: true, error: null });
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(credentials),
              }
            );

            if (!res.ok) {
              const error = await res.json();
              throw new Error(error.message);
            }

            const data = await res.json();
            set({ user: data.user, loading: false });
          } catch (error) {
            if (error instanceof Error) {
              set({ error: error.message, loading: false });
            } else {
              set({ error: String(error), loading: false });
            }
          }
        },

        logout: async () => {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
              method: "POST",
              credentials: "include",
            });
            set({ user: null });
          } catch (error) {
            console.error("Logout failed:", error);
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
      }
    )
  )
);
