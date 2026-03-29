'use client';

import { CircularProgress, Box, Typography } from '@mui/material';

export interface LoadingSpinnerProps {
  size?: number | string;
  color?: 'primary' | 'secondary' | 'inherit';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 40,
  color = 'primary',
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const content = (
    <>
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      {content}
    </Box>
  );
}
