import { type LoginResponse } from '@/types/auth';
import apiClient from '@/services/apiClient'; 

export interface LoginCredentials {
  username: string; 
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          resolve({
            status: 'success',
            message: 'Đăng nhập thành công',
            data: {
              tokens: {
                accessToken: 'mock_jwt_access_token_header.payload.signature',
                refreshToken: 'mock_jwt_refresh_token_string',
                expiresIn: 3600, 
              },
              user: {
                id: 'ADM-001',
                email: 'admin@lms.edu.vn', 
                fullName: 'Quản trị viên Hệ thống',
                avatar: 'https://api.lms.com/uploads/avatars/admin.jpg',
                role: {
                  code: 'ADMIN',
                  name: 'Quản trị viên',
                },
                permissions: [
                  'USER_VIEW', 'USER_CREATE', 'USER_ASSIGN_ROLE', 'USER_UPDATE', 'USER_LOCK', 'USER_UNLOCK',
                  'MAJOR_VIEW', 'MAJOR_CREATE', 'MAJOR_UPDATE', 'MAJOR_DELETE',
                  'COURSE_VIEW', 'COURSE_PROPOSE', 'COURSE_APPROVE_LIST', 'COURSE_APPROVE', 'COURSE_UPDATE', 'COURSE_DELETE',
                  'PROFILE_VIEW', 'PROFILE_UPDATE',
                  'SEMESTER_VIEW', 'SEMESTER_CREATE', 'SEMESTER_UPDATE', 'SEMESTER_DELETE', 'SEMESTER_FINISH'
                ],
              },
            },
          });
        } else {
          reject(new Error('Tài khoản hoặc mật khẩu không chính xác! (Gợi ý: admin / admin123)'));
        }
      }, 1000); 
    });
  },
};