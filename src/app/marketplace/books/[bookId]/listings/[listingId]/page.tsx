'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import { ArrowBack, ShoppingCart, Store, Inventory } from '@mui/icons-material';
import Link from 'next/link';
import { Navbar } from '@/modules/shared/components';
import { useListing, useBook } from '@/modules/marketplace/hooks';
import { useCartStore } from '@/modules/marketplace/store/cartStore';

const defaultCover = '/images/book-placeholder.png';

const conditionLabels: Record<string, string> = {
  NEW: 'Nuevo',
  USED: 'Usado',
};

const physicalStateLabels: Record<string, string> = {
  LIKE_NEW: 'Como nuevo',
  VERY_GOOD: 'Muy bueno',
  GOOD: 'Bueno',
  ACCEPTABLE: 'Aceptable',
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const listingId = params.listingId as string;
  
  const { data: listing, isLoading, error } = useListing(listingId);
  const { data: book } = useBook(bookId);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const isInCart = items.some((item) => item.listingId === listingId);

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

  const handleAddToCart = () => {
    if (!listing) return;

    // Convert price to number (PostgreSQL returns decimal as string)
    const price = Number(listing.price);

    addItem({
      id: listing.id,
      listingId: listing.id,
      quantity: 1,
      price: price,
      title: book?.title || listing.edition || 'Libro',
      coverImage: listing.coverImage,
      condition: listing.condition,
    });

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

  if (error || !listing) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar showBackButton backButtonHref="/" showLogoLink />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">
            Error al cargar los detalles del listing. Por favor, intenta de nuevo.
          </Alert>
        </Container>
      </Box>
    );
  }

  const isAvailable = listing.status === 'PUBLISHED' && listing.stock > 0;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showBackButton backButtonHref={`/marketplace/books/${bookId}`} showLogoLink />

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Back to book */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Volver al libro
        </Button>

        <Grid container spacing={4}>
          {/* Listing Image */}
          <Grid item xs={12} md={5}>
            <Card>
              <CardMedia
                component="img"
                image={listing.coverImage || defaultCover}
                alt={listing.edition || 'Libro'}
                sx={{ objectFit: 'cover' }}
                onError={(e: any) => {
                  e.target.src = defaultCover;
                }}
              />
            </Card>
          </Grid>

          {/* Listing Details */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {book?.title}
            </Typography>

            {listing.edition && (
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {listing.edition}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
              <Chip
                label={conditionLabels[listing.condition]}
                color={listing.condition === 'NEW' ? 'success' : 'warning'}
              />
              {listing.physicalState && (
                <Chip
                  label={physicalStateLabels[listing.physicalState]}
                  variant="outlined"
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Seller Info */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Store fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Vendedor
                </Typography>
              </Box>
              <Typography variant="body1">
                {listing.sellerName}
              </Typography>
            </Paper>

            {/* Stock */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Inventory color="action" />
              <Typography variant="body1">
                Stock disponible: <strong>{listing.stock}</strong> unidades
              </Typography>
            </Box>

            {/* Observations */}
            {listing.observations && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Observaciones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.observations}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Price and Add to Cart */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  Q{Number(listing.price).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Impuestos incluidos
                </Typography>
              </Box>

              {isAvailable ? (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {isInCart ? 'En el carrito' : 'Añadir al carrito'}
                </Button>
              ) : (
                <Alert severity="warning">
                  Este producto no está disponible actualmente.
                </Alert>
              )}

              <Alert severity="info" sx={{ mt: 2 }}>
                CheckoutPróximamente - Estamos trabajando en el sistema de pagos
              </Alert>
            </Box>
          </Grid>
        </Grid>
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
