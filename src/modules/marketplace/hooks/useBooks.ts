'use client';

import { useQuery } from '@tanstack/react-query';
import { booksApi, BookQueryParams, BooksResponse } from '../api/books.api';

export function useBooks(params?: BookQueryParams) {
  return useQuery<BooksResponse>({
    queryKey: ['books', params],
    queryFn: async () => {
      return booksApi.getBooks(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
