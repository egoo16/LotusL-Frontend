'use client';

import Link from 'next/link';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { useCartStore } from '../store/cartStore';

interface CartButtonProps {
  showBadge?: boolean;
}

export function CartButton({ showBadge = true }: CartButtonProps) {
  const getCount = useCartStore((state) => state.getCount);
  const count = getCount();

  return (
    <Tooltip title="Carrito de compras">
      <Link href="/cart" style={{ textDecoration: 'none' }}>
        <IconButton color="inherit">
          {showBadge && count > 0 ? (
            <Badge badgeContent={count} color="secondary">
              <CartIcon />
            </Badge>
          ) : (
            <CartIcon />
          )}
        </IconButton>
      </Link>
    </Tooltip>
  );
}
