import { apiClient } from '@/modules/shared/services/api';

// Types
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  publisher: string | null;
  category: string | null;
  language: string;
  year: number | null;
  pages: number | null;
  description: string | null;
  coverImage: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface BookListing {
  id: string;
  bookId: string;
  edition: string | null;
  condition: 'NEW' | 'USED';
  price: number;
  stock: number;
  coverImage: string | null;
  observations: string | null;
  physicalState: 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE' | null;
  sellerName: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SOLD_OUT' | 'ARCHIVED' | 'PENDING_APPROVAL';
  createdAt: string;
  updatedAt: string;
}

export interface BookWithListings extends Book {
  listings?: BookListing[];
}

export interface BookQueryParams {
  search?: string;
  category?: string;
  author?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface BooksResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  category?: string;
  language: string;
  year?: number;
  pages?: number;
  description?: string;
  coverImage?: string;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  category?: string;
  language?: string;
  year?: number;
  pages?: number;
  description?: string;
  coverImage?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'ARCHIVED';
}

export const booksApi = {
  getBooks: (params?: BookQueryParams) =>
    apiClient.get<BooksResponse>('/books', params),

  getBook: (id: string) =>
    apiClient.get<BookWithListings>(`/books/${id}`),

  // Admin endpoints
  createBook: (data: CreateBookDto) =>
    apiClient.post<Book>('/books', data),

  updateBook: (id: string, data: UpdateBookDto) =>
    apiClient.patch<Book>(`/books/${id}`, data),

  deleteBook: (id: string) =>
    apiClient.delete<void>(`/books/${id}`),
};
