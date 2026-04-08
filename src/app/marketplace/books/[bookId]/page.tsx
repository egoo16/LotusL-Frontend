'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';
import Link from 'next/link';
import { Navbar } from '@/modules/shared/components';
import { ListingCard } from '@/modules/marketplace/components';
import { useBook } from '@/modules/marketplace/hooks';
import { useCartStore } from '@/modules/marketplace/store/cartStore';

const defaultCover = '/images/book-placeholder.png';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  
  const { data: book, isLoading, error } = useBook(bookId);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
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
          }
        } catch {
          // Ignorar
        }
      }
      setAuthChecked(true);
    }
  }, []);

  const handleAddToCart = (listing: any) => {
    setSnackbarMessage('¡Añadido al carrito!');
    setSnackbarOpen(true);
  };

  if (!authChecked || isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar showBackButton backButtonHref="/" showLogoLink />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">
            Error al cargar los detalles del libro. Por favor, intenta de nuevo.
          </Alert>
        </Container>
      </Box>
    );
  }

  const publishedListings = book.listings?.filter(
    (l) => l.status === 'PUBLISHED' && l.stock > 0
  ) || [];

  const lowestPrice = publishedListings.length
    ? Math.min(...publishedListings.map((l) => l.price))
    : null;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showBackButton backButtonHref="/" showLogoLink />

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Book Header */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Cover Image */}
          <Grid item xs={12} md={4}>
            <Card sx={{ maxWidth: 400, mx: 'auto' }}>
              <CardMedia
                component="img"
                image={book.coverImage || defaultCover}
                alt={book.title}
                sx={{ objectFit: 'cover' }}
                onError={(e: any) => {
                  e.target.src = defaultCover;
                }}
              />
            </Card>
          </Grid>

          {/* Book Info */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {book.title}
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              por {book.author}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
              {book.category && <Chip label={book.category} color="primary" variant="outlined" />}
              <Chip label={book.language} variant="outlined" />
              {book.year && <Chip label={`${book.year}`} variant="outlined" />}
              {book.pages && <Chip label={`${book.pages} páginas`} variant="outlined" />}
            </Box>

            {book.isbn && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ISBN: {book.isbn}
              </Typography>
            )}

            {book.publisher && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Editorial: {book.publisher}
              </Typography>
            )}

            {book.description && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Descripción
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {book.description}
                </Typography>
              </Box>
            )}

            {lowestPrice !== null && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  Desde Q{lowestPrice.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {publishedListings.length} {publishedListings.length === 1 ? 'opción disponible' : 'opciones disponibles'}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Listings Section */}
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Disponibles ({publishedListings.length})
        </Typography>

        {publishedListings.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No hay ejemplares disponibles en este momento.
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {publishedListings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
                <ListingCard listing={listing} onAddToCart={handleAddToCart} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
