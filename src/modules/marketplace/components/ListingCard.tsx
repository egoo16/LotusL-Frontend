'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  CardActionArea,
  IconButton,
} from '@mui/material';
import { ShoppingCart, Info } from '@mui/icons-material';
import { BookListing } from '../api/books.api';
import { useCartStore } from '../store/cartStore';

interface ListingCardProps {
  listing: BookListing;
  onAddToCart?: (listing: BookListing) => void;
}

const conditionColors: Record<string, 'success' | 'warning'> = {
  NEW: 'success',
  USED: 'warning',
};

const physicalStateLabels: Record<string, string> = {
  LIKE_NEW: 'Como nuevo',
  VERY_GOOD: 'Muy bueno',
  GOOD: 'Bueno',
  ACCEPTABLE: 'Aceptable',
};

export function ListingCard({ listing, onAddToCart }: ListingCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  
  const isInCart = items.some((item) => item.listingId === listing.id);
  const defaultCover = '/images/book-placeholder.png';
  
  // Convert price to number (PostgreSQL returns decimal as string)
  const price = Number(listing.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: listing.id,
      listingId: listing.id,
      quantity: 1,
      price: price,
      title: listing.edition || 'Libro',
      coverImage: listing.coverImage,
      condition: listing.condition,
    });
    
    onAddToCart?.(listing);
  };

  const isAvailable = listing.status === 'PUBLISHED' && listing.stock > 0;

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
        href={`/marketplace/books/${listing.bookId}/listings/${listing.id}`}
        style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
      >
        <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <CardMedia
            component="img"
            height="180"
            image={listing.coverImage || defaultCover}
            alt={listing.edition || 'Libro'}
            sx={{ objectFit: 'cover', width: '100%' }}
            onError={(e: any) => {
              e.target.src = defaultCover;
            }}
          />
          <CardContent sx={{ flexGrow: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip
                label={listing.condition === 'NEW' ? 'Nuevo' : 'Usado'}
                size="small"
                color={conditionColors[listing.condition]}
              />
              {listing.physicalState && (
                <Chip
                  label={physicalStateLabels[listing.physicalState]}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>

            {listing.edition && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  mb: 1,
                }}
              >
                {listing.edition}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Vendedor: {listing.sellerName}
            </Typography>

            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Q{price.toFixed(2)}
              </Typography>
              
              <Typography variant="caption" color="text.secondary">
                Stock: {listing.stock}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
      
      {isAvailable && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={isInCart}
          >
            {isInCart ? 'En el carrito' : 'Añadir al carrito'}
          </Button>
        </Box>
      )}
    </Card>
  );
}
