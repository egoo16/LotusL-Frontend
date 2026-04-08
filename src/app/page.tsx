'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import { FilterList, ViewModule, ViewList } from '@mui/icons-material';
import { Navbar } from '../modules/shared/components';
import { SearchBar, BookList, FiltersSidebar } from '../modules/marketplace/components';
import { useBooks } from '../modules/marketplace/hooks';
import { BookQueryParams, Book } from '../modules/marketplace/api/books.api';

interface FiltersState {
  search: string;
  category: string;
  author: string;
  language: string;
  priceRange: [number, number];
  condition: {
    new: boolean;
    used: boolean;
  };
}

const defaultFilters: FiltersState = {
  search: '',
  category: '',
  author: '',
  language: '',
  priceRange: [0, 1000],
  condition: { new: false, used: false },
};

export default function MarketplacePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [authChecked, setAuthChecked] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Build query params from filters
  const queryParams: BookQueryParams = useMemo(() => {
    const params: BookQueryParams = {
      page: 1,
      limit: 20,
    };

    if (searchValue) {
      params.search = searchValue;
    }
    if (filters.category) {
      params.category = filters.category;
    }
    if (filters.author) {
      params.author = filters.author;
    }
    if (filters.language) {
      params.language = filters.language;
    }
    if (filters.priceRange[0] > 0) {
      params.minPrice = filters.priceRange[0];
    }
    if (filters.priceRange[1] < 1000) {
      params.maxPrice = filters.priceRange[1];
    }

    return params;
  }, [searchValue, filters]);

  const { data, isLoading, error } = useBooks(queryParams);

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

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
  };

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
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Explora Nuestro Catálogo
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <SearchBar
              value={searchValue}
              onChange={handleSearchChange}
            />
            
            {/* Mobile Filter Toggle */}
            {isMobile && (
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setMobileFiltersOpen(true)}
              >
                Filtros
              </Button>
            )}

            {/* View Toggle */}
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <ViewModule />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewList />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Desktop Filters Sidebar */}
          {!isMobile && (
            <Grid item md={3}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <FiltersSidebar
                  filters={filters}
                  onChange={handleFiltersChange}
                />
              </Box>
            </Grid>
          )}

          {/* Book Grid */}
          <Grid item xs={12} md={9}>
            {error ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="error">
                  Error al cargar los libros
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Por favor, intenta de nuevo más tarde
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {data?.total || 0} libros encontrados
                  </Typography>
                </Box>
                
                <BookList
                  books={data?.books || []}
                  isLoading={isLoading}
                  emptyMessage="No se encontraron libros con los filtros seleccionados"
                  viewMode={viewMode}
                />
              </>
            )}
          </Grid>
        </Grid>

        {/* Coming Soon Message */}
        <Box sx={{ mt: 8, textAlign: 'center', py: 4, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Checkout Próximamente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Estamos trabajando en el sistema de pagos. ¡Pronto podrás completar tus compras!
          </Typography>
        </Box>
      </Container>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
          sx: { width: 300, p: 2 },
        }}
      >
        <FiltersSidebar
          filters={filters}
          onChange={(newFilters) => {
            handleFiltersChange(newFilters);
            setMobileFiltersOpen(false);
          }}
        />
      </Drawer>
    </Box>
  );
}
