'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuthStore } from '@/modules/shared/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string | null;
}

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      
      if (!accessToken || !refreshToken) {
        setError('Token no proporcionado');
        return;
      }

      try {
        // Guardar tokens en localStorage PRIMERO
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // Hacer request al profile con el token
        const response = await axios.get<User>(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Guardar usuario en el store
        login(response.data, accessToken, refreshToken);
        
        // Limpiar la URL de los tokens (por seguridad)
        window.history.replaceState({}, '', '/auth/success');
        
        // Redirigir al home
        router.push('/');
      } catch (err: any) {
        console.error('Error al procesar callback de Google:', err);
        // Limpiar tokens si hay error
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setError(err?.response?.data?.message || 'Error al autenticar con Google');
      }
    };

    handleCallback();
  }, [searchParams, login, router]);

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer', color: 'primary.main' }}
          onClick={() => router.push('/login')}
        >
          Volver al login
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Completando autenticación...
      </Typography>
    </Box>
  );
}
