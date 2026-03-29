'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/modules/shared/store/authStore';

/**
 * Hook para manejar la hidratación de Zustand persist store
 * Evita problemas de SSR donde el store no está disponible inmediatamente
 */
export function useAuthReady() {
  const [isReady, setIsReady] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // El store está listo cuando el estado cambia de null
    setIsReady(true);
  }, []);

  return { isReady, isAuthenticated, user };
}
