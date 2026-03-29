import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProviderWrapper } from './ThemeProviderWrapper';
import { Providers } from './providers';
import './globals.css';

// Configurar la URL base para resolver metadata de redes sociales
const metadataBase = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: 'LotusL - Compra y vende libros de forma segura',
  description: 'La plataforma donde los amantes de los libros encuentran tesoros literarios',
  openGraph: {
    title: 'LotusL - Compra y vende libros de forma segura',
    description: 'La plataforma donde los amantes de los libros encuentran tesoros literarios',
    type: 'website',
    locale: 'es_ES',
    siteName: 'LotusL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LotusL - Compra y vende libros de forma segura',
    description: 'La plataforma donde los amantes de los libros encuentran tesoros literarios',
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
