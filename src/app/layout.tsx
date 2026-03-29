import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProviderWrapper } from './ThemeProviderWrapper';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'LotusL - Compra y vende libros de forma segura',
  description: 'La plataforma donde los amantes de los libros encuentran tesoros literarios',
  openGraph: {
    title: 'LotusL - Compra y vende libros de forma segura',
    description: 'La plataforma donde los amantes de los libros encuentran tesoros literarios',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <ThemeProviderWrapper>
              {children}
            </ThemeProviderWrapper>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
