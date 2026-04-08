'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { History, ShoppingBag } from '@mui/icons-material';
import { Navbar } from '@/modules/shared/components';
import { useAuthStore } from '@/modules/shared/store/authStore';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showLogoLink />

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
          Mis Compras
        </Typography>

        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <ShoppingBag sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Aún no tienes compras
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Cuando realices tu primera compra, aparecerá aquí
            </Typography>
            <Typography variant="body2" color="text.secondary">
              💡 El checkout estará disponible próximamente
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
