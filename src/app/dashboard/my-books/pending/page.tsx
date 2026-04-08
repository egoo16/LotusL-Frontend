'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Check,
  Close,
  Visibility,
  Pending,
} from '@mui/icons-material';
import { Navbar } from '@/modules/shared/components';
import { useAuthStore } from '@/modules/shared/store/authStore';

interface PendingListing {
  id: string;
  bookId: string;
  edition: string | null;
  condition: string;
  price: number;
  stock: number;
  observations: string | null;
  sellerName: string;
  createdAt: string;
  book: {
    id: string;
    title: string;
    author: string;
    coverImage: string | null;
  };
}

export default function PendingListingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [listings, setListings] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<PendingListing | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Verificar token directamente de localStorage
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('auth-storage');
    
    if (!token || !storedUser) {
      window.location.href = '/login';
      return;
    }

    let parsedUser: any = null;
    try {
      parsedUser = JSON.parse(storedUser);
      if (parsedUser?.state?.user) {
        parsedUser = parsedUser.state.user;
      }
    } catch {
      window.location.href = '/login';
      return;
    }

    if (parsedUser?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchPendingListings(token);
  }, [router]);

  const fetchPendingListings = async (token?: string) => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/pending`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Error al cargar listings pendientes');
      }

      const data = await response.json();
      setListings(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}/approve`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al aprobar listing');
      }

      // Remove from list
      setListings(listings.filter((l) => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}/reject`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al rechazar listing');
      }

      // Remove from list
      setListings(listings.filter((l) => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setActionLoading(false);
    }
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

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
          Listings Pendientes de Aprobación
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {listings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Pending sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay listings pendientes
            </Typography>
            <Typography color="text.secondary">
              Todos los listings han sido procesados
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {listings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <Card>
                  <Box
                    sx={{
                      height: 150,
                      backgroundColor: 'grey.100',
                      backgroundImage: listing.book.coverImage
                        ? `url(${listing.book.coverImage})`
                        : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {!listing.book.coverImage && <Visibility sx={{ fontSize: 40, color: 'grey.400' }} />}
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h2" noWrap>
                      {listing.book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {listing.book.author}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={listing.condition === 'NEW' ? 'Nuevo' : 'Usado'}
                        size="small"
                        color={listing.condition === 'NEW' ? 'primary' : 'default'}
                      />
                      <Chip label={`Q${listing.price}`} size="small" />
                      <Chip label={`Stock: ${listing.stock}`} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <strong>Vendedor:</strong> {listing.sellerName}
                    </Typography>
                    {listing.observations && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Observaciones:</strong> {listing.observations}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Creado: {new Date(listing.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<Check />}
                      onClick={() => handleApprove(listing.id)}
                      disabled={actionLoading}
                      fullWidth
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Close />}
                      onClick={() => handleReject(listing.id)}
                      disabled={actionLoading}
                      fullWidth
                    >
                      Rechazar
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
