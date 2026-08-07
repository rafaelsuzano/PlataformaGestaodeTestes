import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: localStorage.getItem('auth') === 'true',
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  
  login: (token, user) => {
    localStorage.setItem('auth', 'true');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, token, user });
  },
  
  logout: () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, token: null, user: null });
  },
}));
