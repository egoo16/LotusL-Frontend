'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActionArea,
} from '@mui/material';
import { Book, BookListing } from '../api/books.api';

interface BookCardProps {
  book: Book;
  listings?: BookListing[];
}

const conditionColors: Record<string, 'success' | 'warning' | 'info'> = {
  NEW: 'success',
  USED: 'warning',
};

const physicalStateLabels: Record<string, string> = {
  LIKE_NEW: 'Como nuevo',
  VERY_GOOD: 'Muy bueno',
  GOOD: 'Bueno',
  ACCEPTABLE: 'Aceptable',
};

export function BookCard({ book, listings = [] }: BookCardProps) {
  // Get the lowest price from published listings
  const publishedListings = listings.filter(
    (l) => l.status === 'PUBLISHED' && l.stock > 0
  );
  const lowestPrice = publishedListings.length
    ? Math.min(...publishedListings.map((l) => l.price))
    : null;

  const defaultCover = '/images/book-placeholder.png';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Link
        href={`/marketplace/books/${book.id}`}
        style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
      >
        <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <CardMedia
            component="img"
            height="200"
            image={book.coverImage || defaultCover}
            alt={book.title}
            sx={{ objectFit: 'cover', width: '100%' }}
            onError={(e: any) => {
              e.target.src = defaultCover;
            }}
          />
          <CardContent sx={{ flexGrow: 1, width: '100%' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 1,
              }}
            >
              {book.title}
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 1,
              }}
            >
              {book.author}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1, alignItems: 'center' }}>
              {book.category && (
                <Chip
                  label={book.category}
                  size="small"
                />
              )}
              {lowestPrice !== null ? (
                <Chip
                  label={`${publishedListings.length} ${publishedListings.length === 1 ? 'opción' : 'opciones'}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              ) : (
                <Chip
                  label="No disponible"
                  size="small"
                  color="error"
                />
              )}
            </Box>

            {lowestPrice !== null && (
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                  Desde Q{lowestPrice.toFixed(2)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
