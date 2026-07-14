import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: !!accessToken }),
}));
