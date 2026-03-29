'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  BrightnessAuto,
  Logout,
  Search,
} from '@mui/icons-material';
import { useThemeStore } from '../../modules/shared/store';
import { useAuthStore } from '../../modules/shared/store/authStore';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, setMode } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);

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
    router.push('/landing');
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

  // Verificar auth desde localStorage directamente (más confiable que Zustand en hydration)
  const [authChecked, setAuthChecked] = useState(false);
  const [currentAuth, setCurrentAuth] = useState({ isAuthenticated: false, user: null as any });

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

  // Loading state mientras verificamos auth
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
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Link href="/landing" style={{ textDecoration: 'none', flexGrow: 1 }}>
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
                // Usuario autenticado - mostrar avatar y logout
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
                // Usuario no autenticado - mostrar botones de auth
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

            {/* Mobile Menu Button */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' } }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Compra y vende libros de forma segura
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}
          >
            La plataforma donde los amantes de los libros encuentran tesoros
            literarios
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {currentAuth.isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  startIcon={<Search />}
                  onClick={() => router.push('/')}
                >
                  Buscar Libros
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                  onClick={handleLogout}
                  startIcon={<Logout />}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="contained" size="large" color="primary">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outlined" size="large" color="primary">
                    Crear Cuenta
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* How to Buy Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}
          >
            Cómo Comprar
          </Typography>
          <Grid container spacing={4}>
            {[
              'Explora nuestro catálogo de libros nuevos y usados',
              'Agrega tus favoritos al carrito',
              'Realiza el pago de forma segura',
              'Recibe tu libro en tu puerta',
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body1">{step}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How to Sell Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}
          >
            Cómo Vender
          </Typography>
          <Grid container spacing={4}>
            {[
              'Publica los libros que ya no necesites',
              'Envíanos tus libros para inspección',
              'Recibe el pago cuando verifiquemos su estado',
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'secondary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body1">{step}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works (Inspection) Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}
          >
            Cómo Funciona la Inspección
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 6, maxWidth: 700, mx: 'auto' }}
          >
            Todos los libros son inspectionados por nuestro equipo antes de ser
            enviados al comprador. Esto garantiza que recibas exactamente lo que esperas.
          </Typography>
          <Grid container spacing={4}>
            {[
              { title: 'Recepción', desc: 'Recibimos tu libro en nuestras oficinas' },
              { title: 'Verificación', desc: 'Nuestro equipo verifica el estado del libro' },
              { title: 'Almacenamiento', desc: 'Guardamos tu libro hasta que sea vendido' },
              { title: 'Envío', desc: 'Enviamos el libro al comprador' },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.default',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} LotusL. Todos los derechos reservados.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="/terms">
                <Typography variant="body2" color="text.secondary">
                  Términos y Condiciones
                </Typography>
              </Link>
              <Link href="/privacy">
                <Typography variant="body2" color="text.secondary">
                  Política de Privacidad
                </Typography>
              </Link>
              <Link href="/contact">
                <Typography variant="body2" color="text.secondary">
                  Contacto
                </Typography>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
