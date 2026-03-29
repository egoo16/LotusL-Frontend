'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService, AuthResponse } from '../services/auth.service';
import { useAuthStore } from '../../shared/store/authStore';
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput, ProfileInput, ChangePasswordInput } from '../../shared/schemas/auth.schema';
import { apiClient } from '../../shared/services/api';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  provider: string;
  profileImage: string | null;
  bio: string | null;
  birthDate: string | null;
  phone: string | null;
  location: string | null;
  interests: string[];
  favoriteGenres: string[];
  preferredLanguage: string;
  twitterHandle: string | null;
  instagramHandle: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useLogin(redirectTo: string = '/') {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      return authService.login(data);
    },
    onSuccess: (response: AuthResponse) => {
      login(response.user, response.access_token, response.refresh_token);
      router.push(redirectTo);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      return authService.register(data);
    },
    onSuccess: () => {
      router.push('/login?registered=true');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      return authService.forgotPassword(data);
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      return authService.resetPassword(token, newPassword);
    },
    onSuccess: () => {
      router.push('/login?reset=true');
    },
  });
}

export function useLogout(redirectTo: string = '/landing') {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      // Ignorar errores del endpoint, lo importante es limpiar el estado local
      try {
        await authService.logout();
      } catch {
        // Ignorar errores de logout
      }
    },
    onSettled: () => {
      logout();
      router.push(redirectTo);
    },
  });
}

// Hook para obtener el perfil del usuario
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return apiClient.get<UserProfile>('/users/profile');
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para actualizar el perfil
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (data: ProfileInput) => {
      return apiClient.patch<UserProfile>('/users/profile', data);
    },
    onSuccess: (updatedProfile) => {
      // Actualizar el store de auth con los nuevos datos
      if (user) {
        updateUser(
          { ...user, ...updatedProfile },
          localStorage.getItem('access_token') || '',
          localStorage.getItem('refresh_token') || ''
        );
      }
      // Invalidar el query cache
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Hook para cambiar la contraseña
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      return apiClient.post('/users/profile/password', data);
    },
  });
}
