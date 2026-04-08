'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemState {
  id: string;
  listingId: string;
  quantity: number;
  price: number;
  title: string;
  coverImage: string | null;
  condition: 'NEW' | 'USED';
}

interface CartStore {
  items: CartItemState[];
  addItem: (item: CartItemState) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  getCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.listingId === item.listingId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.listingId === item.listingId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (listingId) =>
        set((state) => ({
          items: state.items.filter((i) => i.listingId !== listingId),
        })),

      updateQuantity: (listingId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.listingId === listingId ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Selector hooks for better performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartCount = () => useCartStore((state) => state.getCount());
export const useCartTotal = () => useCartStore((state) => state.getTotal());
