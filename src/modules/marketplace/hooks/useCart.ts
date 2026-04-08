'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, Cart, AddToCartDto, UpdateCartItemDto } from '../api/cart.api';
import { useCartStore, CartItemState } from '../store/cartStore';

export function useCart() {
  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      return cartApi.getCart();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);

  return useMutation({
    mutationFn: async (data: AddToCartDto & { 
      listingDetails?: {
        price: number;
        title: string;
        coverImage: string | null;
        condition: 'NEW' | 'USED';
      };
    }) => {
      const result = await cartApi.addItem({
        listingId: data.listingId,
        quantity: data.quantity,
      });

      // Also add to local store for optimistic UI
      if (data.listingDetails) {
        const cartItem: CartItemState = {
          id: result.id,
          listingId: data.listingId,
          quantity: data.quantity,
          price: data.listingDetails.price,
          title: data.listingDetails.title,
          coverImage: data.listingDetails.coverImage,
          condition: data.listingDetails.condition,
        };
        addItem(cartItem);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCartItemDto }) => {
      // Update local store for optimistic UI
      // Note: We need listingId but the mutation only has item id
      // This is handled by the API response
      
      return cartApi.updateItem(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const removeItem = useCartStore((state) => state.removeItem);

  return useMutation({
    mutationFn: async (listingId: string) => {
      // Remove from local store for optimistic UI
      removeItem(listingId);
      
      return cartApi.removeItem(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: async () => {
      // Clear local store
      clearCart();
      
      return cartApi.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
