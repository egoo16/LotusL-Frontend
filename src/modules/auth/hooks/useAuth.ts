'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService, AuthResponse } from '../services/auth.service';
import { useAuthStore } from '../../shared/store/authStore';
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from '../../shared/schemas/auth.schema';

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
