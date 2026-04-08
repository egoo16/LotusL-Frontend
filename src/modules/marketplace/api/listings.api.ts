import { apiClient } from '@/modules/shared/services/api';
import { BookListing } from './books.api';

export interface ListingQueryParams {
  condition?: 'NEW' | 'USED';
  minPrice?: number;
  maxPrice?: number;
  physicalState?: 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE';
  page?: number;
  limit?: number;
}

export interface ListingsResponse {
  listings: BookListing[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateListingDto {
  bookId: string;
  edition?: string;
  condition: 'NEW' | 'USED';
  price: number;
  stock: number;
  coverImage?: string;
  observations?: string;
  physicalState?: 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE';
}

export interface UpdateListingDto {
  edition?: string;
  condition?: 'NEW' | 'USED';
  price?: number;
  stock?: number;
  coverImage?: string;
  observations?: string;
  physicalState?: 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE';
  status?: 'DRAFT' | 'PUBLISHED' | 'SOLD_OUT' | 'ARCHIVED' | 'PENDING_APPROVAL';
}

export const listingsApi = {
  getListings: (params?: ListingQueryParams) =>
    apiClient.get<ListingsResponse>('/listings', params),

  getListing: (id: string) =>
    apiClient.get<BookListing>(`/listings/${id}`),

  getListingsByBook: (bookId: string) =>
    apiClient.get<BookListing[]>(`/listings/book/${bookId}`),

  // Admin endpoints
  createListing: (data: CreateListingDto) =>
    apiClient.post<BookListing>('/listings', data),

  updateListing: (id: string, data: UpdateListingDto) =>
    apiClient.patch<BookListing>(`/listings/${id}`, data),

  deleteListing: (id: string) =>
    apiClient.delete<void>(`/listings/${id}`),
};
