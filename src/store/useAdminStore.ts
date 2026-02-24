import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  hasAuth: () => boolean;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      token: null,
      login: (token: string) => set({ token }),
      logout: () => set({ token: null }),
      hasAuth: () => !!get().token,
    }),
    {
      name: 'admin-store',
    }
  )
);
