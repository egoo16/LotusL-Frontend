'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useResetPassword } from '../../../modules/auth/hooks/useAuth';
import { resetPasswordSchema, ResetPasswordInput } from '../../../modules/shared/schemas/auth.schema';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = async (data: ResetPasswordInput) => {
    setErrorMessage(null);
    try {
      await resetPasswordMutation.mutateAsync({
        token: data.token,
        newPassword: data.newPassword,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'El enlace ha expirado o es inválido';
      setErrorMessage(Array.isArray(message) ? message[0] : message);
    }
  };

  if (!token) {
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
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              El enlace ha expirado o es inválido.
            </Alert>
            <Button onClick={() => router.push('/recovery')}>
              Solicitar nuevo enlace
            </Button>
          </Card>
        </Container>
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
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Nueva Contraseña
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa tu nueva contraseña
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              registration={register('newPassword')}
              error={errors.newPassword}
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
              label="Confirmar Nueva Contraseña"
              type="password"
              registration={register('confirmPassword')}
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
              isLoading={resetPasswordMutation.isPending}
            >
              Restablecer Contraseña
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
