import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UserProfile, type AuthResponseData, type PermissionCode } from '../types/auth';
import { setTokens, clearTokens } from '../utils/storage';

interface AuthState {
  user: UserProfile | null;
  permissions: PermissionCode[]; 
  isAuthenticated: boolean;
  loginSuccess: (data: AuthResponseData) => void; 
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      permissions: [],
      isAuthenticated: false,

      loginSuccess: (data) => {
        setTokens(data.accessToken, data.refreshToken);
        
        set({ 
          user: data.user, 
          permissions: data.permissions, 
          isAuthenticated: true 
        });
      },

      // Bổ sung hàm cập nhật token ngầm mà không làm ảnh hưởng state user/permissions hiện tại
      updateTokens: (accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken);
      },

      logout: () => {
        clearTokens();
        set({ user: null, permissions: [], isAuthenticated: false });
      },
    }),
    {
      name: 'lms_auth_store',
      partialize: (state) => ({ 
        user: state.user, 
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);