import { apiClient } from '../../shared/services/api';
import { User } from '../../shared/store/authStore';
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from '../../shared/schemas/auth.schema';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const { confirmPassword, ...registerData } = data;
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  async forgotPassword(data: ForgotPasswordInput): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', data);
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  async logout(): Promise<void> {
    return apiClient.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    return apiClient.post('/auth/refresh', { refresh_token: refreshToken });
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/users/profile');
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.patch<User>('/users/profile', data);
  },
};
