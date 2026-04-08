'use client';

import { useQuery } from '@tanstack/react-query';
import { listingsApi, ListingQueryParams, ListingsResponse } from '../api/listings.api';

export function useListings(params?: ListingQueryParams) {
  return useQuery<ListingsResponse>({
    queryKey: ['listings', params],
    queryFn: async () => {
      return listingsApi.getListings(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      return listingsApi.getListing(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useListingsByBook(bookId: string) {
  return useQuery({
    queryKey: ['listings', 'book', bookId],
    queryFn: async () => {
      return listingsApi.getListingsByBook(bookId);
    },
    enabled: !!bookId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
