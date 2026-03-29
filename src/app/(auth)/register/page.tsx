'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Container,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Collapse,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, TextField, Card } from '../../../modules/shared/components';
import { useRegister } from '../../../modules/auth/hooks/useAuth';
import { registerSchema, RegisterInput } from '../../../modules/shared/schemas/auth.schema';
import { useAuthStore } from '../../../modules/shared/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister();

  const onSubmit = async (data: RegisterInput) => {
    setErrorMessage(null);
    try {
      await registerMutation.mutateAsync(data);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Error al crear la cuenta';
      setErrorMessage(Array.isArray(message) ? message[0] : message);
    }
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
              Crear Cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Únete a la comunidad de lectores
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Nombre"
                registration={registerForm('firstName')}
                error={errors.firstName}
              />
              <TextField
                label="Apellido"
                registration={registerForm('lastName')}
                error={errors.lastName}
              />
            </Box>

            <TextField
              label="Correo electrónico"
              type="email"
              registration={registerForm('email')}
              error={errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              registration={registerForm('password')}
              error={errors.password}
              onFocus={() => setShowPasswordReqs(true)}
              sx={{ mb: 0.5 }}
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

            <Collapse in={showPasswordReqs}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Mínimo 8 caracteres, una mayúscula y un número
              </Typography>
            </Collapse>

            <TextField
              label="Confirmar Contraseña"
              type="password"
              registration={registerForm('confirmPassword')}
              error={errors.confirmPassword}
              sx={{ mb: 3 }}
            />

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              size="large"
              isLoading={registerMutation.isPending}
              sx={{ mb: 3 }}
            >
              Registrarse
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" style={{ color: 'primary.main', fontWeight: 600 }}>
                Inicia Sesión
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
