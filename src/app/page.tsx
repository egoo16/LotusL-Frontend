'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Container, Button, AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Brightness4, Brightness7, BrightnessAuto, Logout, Search, Menu as MenuIcon } from '@mui/icons-material';
import { useThemeStore } from '../modules/shared/store';
import { useAuthStore } from '../modules/shared/store/authStore';

export default function MarketplacePage() {
  const router = useRouter();
  const { mode, setMode } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentAuth, setCurrentAuth] = useState({ isAuthenticated: false, user: null as any });

  // Verificar auth desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('auth-storage');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentAuth({
            isAuthenticated: !!token && !!parsed?.state?.user,
            user: parsed?.state?.user || null,
          });
        } catch {
          setCurrentAuth({ isAuthenticated: false, user: null });
        }
      } else {
        setCurrentAuth({ isAuthenticated: false, user: null });
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

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeAnchorEl(null);
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleThemeMenuClose();
  };

  const handleLogout = () => {
    logout();
    setUserMenuAnchorEl(null);
    // Recargar la página para que se rehidrate Zustand correctamente
    window.location.href = '/landing';
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const themeIcon = {
    light: <Brightness7 />,
    dark: <Brightness4 />,
    system: <BrightnessAuto />,
  }[mode];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Link href="/" style={{ textDecoration: 'none', flexGrow: 1 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                LotusL
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
              <IconButton onClick={handleThemeMenuOpen} color="inherit">
                {themeIcon}
              </IconButton>
              <Menu
                anchorEl={themeAnchorEl}
                open={Boolean(themeAnchorEl)}
                onClose={handleThemeMenuClose}
              >
                <MenuItem onClick={() => handleThemeChange('light')}>
                  <Brightness7 sx={{ mr: 1 }} /> Claro
                </MenuItem>
                <MenuItem onClick={() => handleThemeChange('dark')}>
                  <Brightness4 sx={{ mr: 1 }} /> Oscuro
                </MenuItem>
                <MenuItem onClick={() => handleThemeChange('system')}>
                  <BrightnessAuto sx={{ mr: 1 }} /> Sistema
                </MenuItem>
              </Menu>

              {currentAuth.isAuthenticated ? (
                // Usuario autenticado
                <>
                  <Button
                    color="inherit"
                    startIcon={<Search />}
                    onClick={() => router.push('/')}
                  >
                    Buscar Libros
                  </Button>
                  <Button
                    onClick={handleUserMenuOpen}
                    startIcon={
                      <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                        {currentAuth.user?.firstName?.[0] || currentAuth.user?.email?.[0] || 'U'}
                      </Avatar>
                    }
                  >
                    {currentAuth.user?.firstName || currentAuth.user?.email?.split('@')[0]}
                  </Button>
                  <Menu
                    anchorEl={userMenuAnchorEl}
                    open={Boolean(userMenuAnchorEl)}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1 }} /> Cerrar Sesión
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                // Usuario no autenticado
                <>
                  <Link href="/login">
                    <Button color="inherit">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="contained" color="primary">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Marketplace Content - Placeholder */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Marketplace LotusL
        </Typography>
        {currentAuth.isAuthenticated ? (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Bienvenido, {currentAuth.user?.firstName || currentAuth.user?.email}
          </Typography>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Descubrí miles de libros para comprar y vender
          </Typography>
        )}
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
          El marketplace está en desarrollo. Pronto podrás buscar, comprar y vender libros aquí.
        </Typography>
      </Box>
    </Box>
  );
}
