'use client';

import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface CardProps extends MuiCardProps {
  variant?: 'elevation' | 'outlined';
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<CardProps>(({ theme, variant = 'elevation' }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  ...(variant === 'elevation' && {
    boxShadow: theme.shadows[2],
  }),
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
  }),
}));

export function Card({ children, variant = 'elevation', ...props }: CardProps) {
  return (
    <StyledCard variant={variant} {...props}>
      {children}
    </StyledCard>
  );
}
