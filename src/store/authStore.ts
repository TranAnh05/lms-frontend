import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UserProfile, type AuthTokens } from '@/types/auth';
import { setTokens, clearTokens } from '@/utils/storage';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginSuccess: (user: UserProfile, tokens: AuthTokens) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      loginSuccess: (user, tokens) => {
        setTokens(tokens.accessToken, tokens.refreshToken);
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'lms_auth_store', 
      
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);