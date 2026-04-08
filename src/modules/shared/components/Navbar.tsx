'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  BrightnessAuto,
  Logout,
  Person,
  LocationOn,
  ArrowBack,
  Menu as MenuIcon,
  Close,
  Search,
  ShoppingCart,
  MenuBook,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../../marketplace/store/cartStore';
import { Badge, Tooltip } from '@mui/material';

interface NavbarProps {
  showBackButton?: boolean;
  backButtonHref?: string;
  title?: string;
  showLogoLink?: boolean;
  extra?: ReactNode;
  showSearchButton?: boolean;
}

export function Navbar({ 
  showBackButton = false, 
  backButtonHref = '/profile', 
  title,
  showLogoLink = false,
  extra,
  showSearchButton = false,
}: NavbarProps) {
  const router = useRouter();
  const { mode, setMode } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);
  
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentAuth, setCurrentAuth] = useState({ isAuthenticated: false, user: null as any });
  
  // Cart count from store
  const getCount = useCartStore((state) => state.getCount);
  const cartCount = getCount();

  // Verificar auth status
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

  // Handlers
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
    window.location.href = '/landing';
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleNavigateToProfile = () => {
    handleUserMenuClose();
    router.push('/profile');
  };

  const handleNavigateToAddresses = () => {
    handleUserMenuClose();
    router.push('/profile/addresses');
  };

  const handleNavigateToMyBooks = () => {
    handleUserMenuClose();
    router.push('/dashboard/my-books');
  };

  // Funciones de navegación ya no usadas - ahora todo está en /dashboard/my-books

  const themeIcon = {
    light: <Brightness7 />,
    dark: <Brightness4 />,
    system: <BrightnessAuto />,
  }[mode];

  // Si no está autenticado, no mostrar nada o mostrar algo básico
  if (!authChecked) {
    return null;
  }

  const LogoComponent = (
    <Typography
      variant="h5"
      component="div"
      sx={{
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        cursor: 'pointer',
      }}
      onClick={() => router.push('/')}
    >
      {title || 'LotusL'}
    </Typography>
  );

  const UserMenuContent = currentAuth.isAuthenticated ? (
    <>
      {/* Sección de Gestión */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
          Gestión
        </Typography>
      </Box>
      <MenuItem onClick={handleNavigateToMyBooks}>
        <MenuBook sx={{ mr: 1 }} /> Mis Libros
      </MenuItem>
      <Divider sx={{ my: 1 }} />
      {/* Sección de Cuenta */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
          Cuenta
        </Typography>
      </Box>
      <MenuItem onClick={handleNavigateToProfile}>
        <Person sx={{ mr: 1 }} /> Mi Perfil
      </MenuItem>
      <MenuItem onClick={handleNavigateToAddresses}>
        <LocationOn sx={{ mr: 1 }} /> Mis Direcciones
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 1 }} /> Cerrar Sesión
      </MenuItem>
    </>
  ) : (
    <>
      <MenuItem component={Link} href="/login">
        Iniciar Sesión
      </MenuItem>
      <MenuItem component={Link} href="/register">
        Registrarse
      </MenuItem>
    </>
  );

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Botón de atrás o espacio vacío */}
            {showBackButton ? (
              <IconButton onClick={() => router.push(backButtonHref)} sx={{ mr: 2 }}>
                <ArrowBack />
              </IconButton>
            ) : (
              <Box sx={{ width: 48 }} />
            )}

            {/* Título/Logo */}
            {showLogoLink ? (
              <Link href="/" style={{ textDecoration: 'none', flexGrow: 1 }}>
                {LogoComponent}
              </Link>
            ) : (
              <Box sx={{ flexGrow: 1 }}>{LogoComponent}</Box>
            )}

            {/* Contenido extra (solo visible en desktop) */}
            {extra && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
                {extra}
              </Box>
            )}

            {/* Botón de búsqueda (solo visible en desktop para usuarios autenticados) */}
            {showSearchButton && currentAuth.isAuthenticated && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
                <Button
                  color="inherit"
                  startIcon={<Search />}
                  onClick={() => router.push('/')}
                >
                  Buscar Libros
                </Button>
              </Box>
            )}

            {/* Menú derecho - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
              {/* Theme Toggle */}
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

              {/* Cart Button */}
              <Tooltip title="Carrito de compras">
                <IconButton
                  color="inherit"
                  onClick={() => router.push('/cart')}
                >
                  {cartCount > 0 ? (
                    <Badge badgeContent={cartCount} color="secondary">
                      <ShoppingCart />
                    </Badge>
                  ) : (
                    <ShoppingCart />
                  )}
                </IconButton>
              </Tooltip>

              {/* User Menu */}
              {currentAuth.isAuthenticated ? (
                <>
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
                    {UserMenuContent}
                  </Menu>
                </>
              ) : (
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
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {/* Theme Toggle en móvil */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleThemeChange(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light')}>
              {themeIcon}
              <ListItemText primary={`Tema: ${mode === 'light' ? 'Claro' : mode === 'dark' ? 'Oscuro' : 'Sistema'}`} />
            </ListItemButton>
          </ListItem>
          
          {/* Cart en móvil */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => { router.push('/cart'); setMobileMenuOpen(false); }}>
              <Badge badgeContent={cartCount} color="secondary" sx={{ mr: 2 }}>
                <ShoppingCart />
              </Badge>
              <ListItemText primary="Carrito" />
            </ListItemButton>
          </ListItem>
          
          {currentAuth.isAuthenticated ? (
            <>
              {/* Sección de Gestión */}
              <ListItem>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Gestión
                </Typography>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { router.push('/dashboard/my-books'); setMobileMenuOpen(false); }}>
                  <MenuBook sx={{ mr: 2 }} />
                  <ListItemText primary="Mis Libros" />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ my: 1 }} />
              {/* Sección de Cuenta */}
              <ListItem>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Cuenta
                </Typography>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { router.push('/profile'); setMobileMenuOpen(false); }}>
                  <Person sx={{ mr: 2 }} />
                  <ListItemText primary="Mi Perfil" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { router.push('/profile/addresses'); setMobileMenuOpen(false); }}>
                  <LocationOn sx={{ mr: 2 }} />
                  <ListItemText primary="Mis Direcciones" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <Logout sx={{ mr: 2 }} />
                  <ListItemText primary="Cerrar Sesión" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <ListItemText primary="Iniciar Sesión" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <ListItemText primary="Registrarse" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
