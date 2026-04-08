import { apiClient } from '@/modules/shared/services/api';
import { BookListing } from './books.api';

export interface CartItem {
  id: string;
  userId: string;
  listingId: string;
  quantity: number;
  createdAt: string;
  listing?: BookListing;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface AddToCartDto {
  listingId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export const cartApi = {
  getCart: () =>
    apiClient.get<Cart>('/cart'),

  addItem: (data: AddToCartDto) =>
    apiClient.post<CartItem>('/cart/items', data),

  updateItem: (id: string, data: UpdateCartItemDto) =>
    apiClient.patch<CartItem>(`/cart/items/${id}`, data),

  removeItem: (id: string) =>
    apiClient.delete<void>(`/cart/items/${id}`),

  clearCart: () =>
    apiClient.delete<void>('/cart'),
};
