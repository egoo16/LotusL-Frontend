'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Delete,
  MenuBook,
  MoreVert,
  Sell,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { Navbar } from '@/modules/shared/components';

interface Listing {
  id: string;
  condition: string;
  price: number;
  stock: number;
  status: string;
}

interface BookWithListings {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  publisher: string | null;
  category: string | null;
  status: string;
  coverImage: string | null;
  createdAt: string;
  listings: Listing[];
}

export default function MyBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<BookWithListings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; bookId: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('auth-storage');
    
    if (!token || !storedUser) {
      window.location.href = '/login';
      return;
    }

    fetchMyBooks(token);
  }, []);

  const fetchMyBooks = async (token?: string) => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/my-books`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Error al cargar libros');
      }

      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'PENDING_APPROVAL':
        return 'warning';
      case 'DRAFT':
        return 'default';
      case 'ARCHIVED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Publicado';
      case 'PENDING_APPROVAL':
        return 'Pendiente';
      case 'DRAFT':
        return 'Borrador';
      case 'ARCHIVED':
        return 'Archivado';
      default:
        return status;
    }
  };

  // Determinar estado del libro basado en listings
  const getBookAvailability = (book: BookWithListings) => {
    const hasAvailable = book.listings.some(l => l.status === 'ACTIVE' && l.stock > 0);
    const hasSold = book.listings.some(l => l.status === 'SOLD');
    
    if (hasSold && !hasAvailable) {
      return { label: 'Vendido', color: 'error', icon: <CheckCircle /> };
    }
    if (hasAvailable) {
      return { label: 'Disponible', color: 'success', icon: <Sell /> };
    }
    if (book.listings.length === 0) {
      return { label: 'Sin listings', color: 'default', icon: <MenuBook /> };
    }
    return { label: 'Sin stock', color: 'warning', icon: <Cancel /> };
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, bookId: string) => {
    setMenuAnchor({ el: event.currentTarget, bookId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showLogoLink />

      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Mis Libros
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/dashboard/my-books/new')}
          >
            Publicar Libro
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {books.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <MenuBook sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Aún no has publicado ningún libro
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Comienza a vender tus libros publicando tu primer listing
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/dashboard/my-books/new')}
            >
              Publicar mi primer libro
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {books.map((book) => {
              const availability = getBookAvailability(book);
              return (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        height: 200,
                        backgroundColor: 'grey.100',
                        backgroundImage: book.coverImage ? `url(${book.coverImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {!book.coverImage && <MenuBook sx={{ fontSize: 60, color: 'grey.400' }} />}
                      
                      {/* Estado del libro */}
                      <Chip
                        icon={availability.icon as any}
                        label={availability.label}
                        color={availability.color as any}
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                      
                      {/* Estado del libro en base de datos */}
                      <Chip
                        label={getStatusLabel(book.status)}
                        color={getStatusColor(book.status) as any}
                        size="small"
                        variant="outlined"
                        sx={{ position: 'absolute', top: 8, left: 8 }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" noWrap>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {book.author}
                      </Typography>
                      {book.category && (
                        <Chip label={book.category} size="small" sx={{ mb: 1 }} />
                      )}
                      
                      {/* Listado de listings */}
                      <Box sx={{ mt: 2 }}>
                        {book.listings.map((listing) => (
                          <Box 
                            key={listing.id} 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              py: 0.5,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Typography variant="body2">
                              {listing.condition} - ${listing.price}
                            </Typography>
                            <Chip
                              label={listing.status === 'ACTIVE' ? 'Activo' : listing.status === 'SOLD' ? 'Vendido' : listing.status}
                              size="small"
                              color={listing.status === 'ACTIVE' ? 'success' : listing.status === 'SOLD' ? 'warning' : 'default'}
                            />
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, book.id)}>
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchor?.el}
                        open={menuAnchor?.bookId === book.id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            router.push(`/marketplace/books/${book.id}`);
                          }}
                        >
                          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
                          <ListItemText>Ver en tienda</ListItemText>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            // Edit functionality
                          }}
                        >
                          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                          <ListItemText>Editar</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            // Archive functionality
                          }}
                        >
                          <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
                          <ListItemText>Archivar</ListItemText>
                        </MenuItem>
                      </Menu>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
