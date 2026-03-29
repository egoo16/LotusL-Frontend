'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Container,
  Typography,
  Alert,
  Collapse,
} from '@mui/material';
import { Button, TextField, Card } from '../../../modules/shared/components';
import { useForgotPassword } from '../../../modules/auth/hooks/useAuth';
import { forgotPasswordSchema, ForgotPasswordInput } from '../../../modules/shared/schemas/auth.schema';

export default function RecoveryPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setShowSuccess(true);
    } catch (error) {
      // Even on error, show success for security reasons
      setShowSuccess(true);
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
              Recuperar Contraseña
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </Typography>
          </Box>

          <Collapse in={showSuccess}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Si el correo existe, recibirás un enlace de recuperación.
            </Alert>
          </Collapse>

          {!showSuccess && (
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
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                isLoading={forgotPasswordMutation.isPending}
              >
                Enviar Enlace
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/login">
              <Button variant="text">
                Volver a Iniciar Sesión
              </Button>
            </Link>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
