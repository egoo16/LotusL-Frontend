'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Add, ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import { Navbar } from '@/modules/shared/components';
import { useAuthStore } from '@/modules/shared/store/authStore';

const steps = ['Información del Libro', 'Detalles del Listing'];

const conditionOptions = [
  { value: 'NEW', label: 'Nuevo' },
  { value: 'USED', label: 'Usado' },
];

const physicalStateOptions = [
  { value: 'LIKE_NEW', label: 'Como nuevo' },
  { value: 'VERY_GOOD', label: 'Muy bueno' },
  { value: 'GOOD', label: 'Bueno' },
  { value: 'ACCEPTABLE', label: 'Aceptable' },
];

const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
  { value: 'pt', label: 'Portugués' },
  { value: 'fr', label: 'Francés' },
];

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  category: string;
  language: string;
  year: string;
  pages: string;
  description: string;
  coverImage: string;
}

interface ListingFormData {
  edition: string;
  condition: string;
  price: string;
  stock: string;
  physicalState: string;
  observations: string;
}

export default function NewBookPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [bookData, setBookData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category: '',
    language: 'es',
    year: '',
    pages: '',
    description: '',
    coverImage: '',
  });

  const [listingData, setListingData] = useState<ListingFormData>({
    edition: '',
    condition: 'NEW',
    price: '',
    stock: '1',
    physicalState: '',
    observations: '',
  });

  useEffect(() => {
    // Verificar token directamente de localStorage
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('auth-storage');
    
    if (!token || !storedUser) {
      window.location.href = '/login';
      return;
    }
  }, []);

  const handleBookDataChange = (field: keyof BookFormData, value: string) => {
    setBookData({ ...bookData, [field]: value });
  };

  const handleListingDataChange = (field: keyof ListingFormData, value: string) => {
    setListingData({ ...listingData, [field]: value });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate book data
      if (!bookData.title.trim()) {
        setError('El título es requerido');
        return;
      }
      if (!bookData.author.trim()) {
        setError('El autor es requerido');
        return;
      }
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async () => {
    // Validate listing data
    if (!listingData.condition) {
      setError('La condición es requerida');
      return;
    }
    if (!listingData.price || parseFloat(listingData.price) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');

      // 1. Create book
      const bookResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn || null,
          publisher: bookData.publisher || null,
          category: bookData.category || null,
          language: bookData.language,
          year: bookData.year ? parseInt(bookData.year) : null,
          pages: bookData.pages ? parseInt(bookData.pages) : null,
          description: bookData.description || null,
          coverImage: bookData.coverImage || null,
          status: 'PUBLISHED',
        }),
      });

      if (!bookResponse.ok) {
        const bookError = await bookResponse.json();
        throw new Error(bookError.message || 'Error al crear el libro');
      }

      const book = await bookResponse.json();

      // 2. Create listing for this book
      const listingPayload: any = {
        bookId: book.id,
        condition: listingData.condition,
        price: parseFloat(listingData.price),
        stock: listingData.stock ? parseInt(listingData.stock) : 1,
      };

      if (listingData.edition) {
        listingPayload.edition = listingData.edition;
      }
      if (listingData.observations) {
        listingPayload.observations = listingData.observations;
      }
      if (listingData.condition === 'USED' && listingData.physicalState) {
        listingPayload.physicalState = listingData.physicalState;
      }
      if (bookData.coverImage) {
        listingPayload.coverImage = bookData.coverImage;
      }

      const listingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listingPayload),
      });

      if (!listingResponse.ok) {
        const listingError = await listingResponse.json();
        throw new Error(listingError.message || 'Error al crear el listing');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/books');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar showLogoLink />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', flex: 1 }}>
          <Check sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            ¡Libro publicado exitosamente!
          </Typography>
          <Typography color="text.secondary">
            Redirigiendo a Mis Libros...
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar showLogoLink showBackButton backButtonHref="/dashboard/books" />

      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
          Publicar un Libro
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Información del Libro
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Título *"
                    value={bookData.title}
                    onChange={(e) => handleBookDataChange('title', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Autor *"
                    value={bookData.author}
                    onChange={(e) => handleBookDataChange('author', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ISBN"
                    value={bookData.isbn}
                    onChange={(e) => handleBookDataChange('isbn', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Editorial"
                    value={bookData.publisher}
                    onChange={(e) => handleBookDataChange('publisher', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Categoría"
                    value={bookData.category}
                    onChange={(e) => handleBookDataChange('category', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    select
                    label="Idioma"
                    value={bookData.language}
                    onChange={(e) => handleBookDataChange('language', e.target.value)}
                  >
                    {languageOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Año de publicación"
                    type="number"
                    value={bookData.year}
                    onChange={(e) => handleBookDataChange('year', e.target.value)}
                    inputProps={{ min: 1000, max: new Date().getFullYear() }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Número de páginas"
                    type="number"
                    value={bookData.pages}
                    onChange={(e) => handleBookDataChange('pages', e.target.value)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL de portada"
                    value={bookData.coverImage}
                    onChange={(e) => handleBookDataChange('coverImage', e.target.value)}
                    placeholder="https://..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción / Sinopsis"
                    multiline
                    rows={4}
                    value={bookData.description}
                    onChange={(e) => handleBookDataChange('description', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeStep === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Detalles del Listing
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Condición *"
                    value={listingData.condition}
                    onChange={(e) => handleListingDataChange('condition', e.target.value)}
                    required
                  >
                    {conditionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Precio (Q) *"
                    type="number"
                    value={listingData.price}
                    onChange={(e) => handleListingDataChange('price', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Q</InputAdornment>,
                    }}
                    inputProps={{ min: 0.01, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Edición"
                    value={listingData.edition}
                    onChange={(e) => handleListingDataChange('edition', e.target.value)}
                    placeholder="Ej: 1ra edición, 2024"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock"
                    type="number"
                    value={listingData.stock}
                    onChange={(e) => handleListingDataChange('stock', e.target.value)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                {listingData.condition === 'USED' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Estado físico"
                      value={listingData.physicalState}
                      onChange={(e) => handleListingDataChange('physicalState', e.target.value)}
                    >
                      {physicalStateOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observaciones del ejemplar"
                    multiline
                    rows={3}
                    value={listingData.observations}
                    onChange={(e) => handleListingDataChange('observations', e.target.value)}
                    placeholder="Describe el estado del libro: manchas, subrayados, firmas, etc."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBack />}
          >
            Anterior
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Check />}
            >
              {loading ? 'Publicando...' : 'Publicar Libro'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}
