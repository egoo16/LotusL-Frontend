'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { lightTheme, darkTheme } from '../config/theme';
import { useThemeStore } from '../modules/shared/store';

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  const resolvedMode = useThemeStore((state) => state.resolvedMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider theme={resolvedMode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
