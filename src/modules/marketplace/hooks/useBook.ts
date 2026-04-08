'use client';

import { useQuery } from '@tanstack/react-query';
import { booksApi, BookWithListings } from '../api/books.api';

export function useBook(id: string) {
  return useQuery<BookWithListings>({
    queryKey: ['book', id],
    queryFn: async () => {
      return booksApi.getBook(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
