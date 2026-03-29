'use client';

import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Container, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Navbar } from '../modules/shared/components';

export default function MarketplacePage() {
  const [authChecked, setAuthChecked] = useState(false);

  // Verificar auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('auth-storage');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (!token || !parsed?.state?.user) {
            // Redirigir a landing si no está autenticado
            // Por ahora solo verificamos
          }
        } catch {
          // Ignorar
        }
      }
      setAuthChecked(true);
    }
  }, []);

  // Loading state
  if (!authChecked) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar showLogoLink showSearchButton />

      {/* Contenido principal del Marketplace */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Explora Nuestro Catálogo
        </Typography>
        
        {/* Aquí iría el contenido del Marketplace (libros, búsqueda, etc.) */}
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Próximamente: Catálogo de libros
          </Typography>
          <Button variant="contained" startIcon={<Search />}>
            Buscar Libros
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
