"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItemData } from "@/types/product";

interface WishlistState {
  items: WishlistItemData[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  clearWishlist: () => void;
  syncFromServer: (items: WishlistItemData[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (productId) => {
        const { items } = get();
        const exists = items.some((i) => i.productId === productId);
        if (exists) {
          set({ items: items.filter((i) => i.productId !== productId) });
        } else {
          set({
            items: [
              ...items,
              { productId, addedAt: new Date().toISOString() },
            ],
          });
        }
      },

      remove: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        });
      },

      has: (productId) => get().items.some((i) => i.productId === productId),

      clearWishlist: () => set({ items: [] }),

      syncFromServer: (items) => set({ items }),
    }),
    {
      name: "mymiso-wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
