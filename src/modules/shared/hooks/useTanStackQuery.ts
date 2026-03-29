'use client';

import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function useTanStackQuery() {
  return { useQuery, useMutation, useQueryClient };
}

export { QueryClient, QueryClientProvider };

// Default query client configuration
export const defaultQueryClientOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  },
};
