import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    token: string | null;
    masterPhone: string | null;
    setAuth: (token: string, masterPhone: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            masterPhone: null,
            setAuth: (token, masterPhone) => set({ token, masterPhone }),
            logout: () => set({ token: null, masterPhone: null }),
        }),
        {
            name: "auth-storage", // name of the item in the storage (must be unique)
        }
    )
);
