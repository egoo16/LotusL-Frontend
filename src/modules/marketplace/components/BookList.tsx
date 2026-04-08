'use client';

import { 
  Box, 
  Grid, 
  CircularProgress, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import { Book, BookListing } from '../api/books.api';
import { BookCard } from './BookCard';

interface BookListProps {
  books: Book[];
  listingsMap?: Record<string, BookListing[]>;
  isLoading?: boolean;
  emptyMessage?: string;
  viewMode?: 'grid' | 'list';
}

export function BookList({
  books,
  listingsMap = {},
  isLoading = false,
  emptyMessage = 'No se encontraron libros',
  viewMode = 'grid',
}: BookListProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (books.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  if (viewMode === 'list') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {books.map((book) => (
          <BookRowCard
            key={book.id}
            book={book}
            listings={(book as any).listings || listingsMap[book.id] || []}
          />
        ))}
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {books.map((book) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
          <BookCard
            book={book}
            listings={(book as any).listings || listingsMap[book.id] || []}
          />
        </Grid>
      ))}
    </Grid>
  );
}

// Componente de fila para vista de lista
// Especificación: marketplace.md líneas 203-212
function BookRowCard({ book, listings }: { book: Book; listings: BookListing[] }) {
  const publishedListings = listings.filter(
    (l) => l.status === 'PUBLISHED' && l.stock > 0
  );
  const lowestPrice = publishedListings.length
    ? Math.min(...publishedListings.map((l) => l.price))
    : null;
  
  // Cantidad total disponible (suma de stock de todas las publicaciones activas)
  const totalStock = publishedListings.reduce((sum, l) => sum + l.stock, 0);
  const isAvailable = publishedListings.length > 0;

  const defaultCover = '/images/book-placeholder.png';

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
      <Link
        href={`/marketplace/books/${book.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}
      >
        <CardActionArea sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>
          {/* Izquierda: portada */}
          <CardMedia
            component="img"
            sx={{ width: { xs: '100%', sm: 120 }, height: { xs: 180, sm: 140 } }}
            image={book.coverImage || defaultCover}
            alt={book.title}
            onError={(e: any) => {
              e.target.src = defaultCover;
            }}
          />
          
          {/* Centro: título, autor, descripción */}
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 2 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
              {book.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {book.author}
            </Typography>
            
            {book.description && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {book.description}
              </Typography>
            )}
            
            {book.category && (
              <Chip label={book.category} size="small" sx={{ mt: 1, alignSelf: 'flex-start' }} />
            )}
          </CardContent>
          
          {/* Derecha: estado, cantidad disponible, precio */}
          <CardContent sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'flex-end',
            minWidth: 140,
            borderLeft: { sm: 1 },
            borderColor: 'divider',
          }}>
            {/* Estado */}
            <Chip 
              label={isAvailable ? 'Disponible' : 'No disponible'} 
              size="small" 
              color={isAvailable ? 'success' : 'error'}
              sx={{ mb: 1 }}
            />
            
            {/* Cantidad disponible */}
            {isAvailable && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {totalStock} {totalStock === 1 ? 'unidad' : 'unidades'} disponible{totalStock !== 1 ? 's' : ''}
              </Typography>
            )}
            
            {/* Precio */}
            {lowestPrice !== null && (
              <Typography variant="h6" color="primary" fontWeight="bold">
                Desde Q{lowestPrice.toFixed(2)}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
