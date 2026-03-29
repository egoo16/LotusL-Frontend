'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Container,
  Typography,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, TextField, Card } from '../../../modules/shared/components';
import { useLogin } from '../../../modules/auth/hooks/useAuth';
import { loginSchema, LoginInput } from '../../../modules/shared/schemas/auth.schema';
import { useAuthStore } from '../../../modules/shared/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const registered = searchParams.get('registered');
  const reset = searchParams.get('reset');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = async (data: LoginInput) => {
    setErrorMessage(null);
    try {
      await loginMutation.mutateAsync(data);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Error al iniciar sesión';
      setErrorMessage(Array.isArray(message) ? message[0] : message);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    window.location.href = googleAuthUrl;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bienvenido de vuelta
            </Typography>
          </Box>

          {registered && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.
            </Alert>
          )}

          {reset && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Contraseña actualizada correctamente. Ya puedes iniciar sesión.
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              label="Correo electrónico"
              type="email"
              registration={register('email')}
              error={errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              registration={register('password')}
              error={errors.password}
              sx={{ mb: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link href="/recovery" style={{ color: 'primary.main' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              size="large"
              isLoading={loginMutation.isPending}
              sx={{ mb: 2 }}
            >
              Iniciar Sesión
            </Button>

            <Button
              type="button"
              variant="outlined"
              fullWidth
              size="large"
              onClick={handleGoogleLogin}
              sx={{ mb: 3 }}
            >
              Continuar con Google
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              ¿No tienes cuenta?{' '}
              <Link href="/register" style={{ color: 'primary.main', fontWeight: 600 }}>
                Regístrate
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
