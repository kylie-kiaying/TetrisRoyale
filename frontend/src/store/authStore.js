import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),

  username: null,
  setUsername: (username) => set({ username }),
  clearUsername: () => set({ username: null }),

  userType: null,
  setUsertype: (userType) => set({ userType }),
  clearUsertype: () => set({ userType: null }),
}));
