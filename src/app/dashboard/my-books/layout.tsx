'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
} from '@mui/material';
import {
  MenuBook,
  Add,
  History,
  Pending,
  Dashboard,
  Close,
} from '@mui/icons-material';

interface MyBooksLayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 260;

const menuItems = [
  { text: 'Mis Libros', href: '/dashboard/my-books', icon: <Dashboard /> },
  { text: 'Publicar Libro', href: '/dashboard/my-books/new', icon: <Add /> },
  { text: 'Mis Compras', href: '/dashboard/my-books/orders', icon: <History /> },
  { text: 'Pendientes', href: '/dashboard/my-books/pending', icon: <Pending />, adminOnly: true },
];

export default function MyBooksLayout({ children }: MyBooksLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentAuth, setCurrentAuth] = useState({ user: null as any });

  // Verificar usuario actual
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('auth-storage');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentAuth({ user: parsed?.state?.user || null });
        } catch {
          setCurrentAuth({ user: null });
        }
      }
    }
  }, []);

  const isAdmin = currentAuth.user?.role === 'admin';
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (href: string) => pathname === href;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del Drawer */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Mi Gestión
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        )}
      </Box>
      <Divider />
      
      {/* Menú de navegación */}
      <List sx={{ px: 1, py: 2 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              selected={isActive(item.href)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: isActive(item.href) ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Drawer permanente en desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Drawer temporal en móvil */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
