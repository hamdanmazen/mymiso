"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CheckoutState {
  selectedAddressId: string | null;
  shippingSelections: Record<string, string>;
  paymentMethod: "whish" | "tap" | "cod";
  notes: string;
  setAddress: (id: string) => void;
  setShipping: (sellerId: string, optionId: string) => void;
  setPaymentMethod: (method: "whish" | "tap" | "cod") => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      selectedAddressId: null,
      shippingSelections: {},
      paymentMethod: "cod",
      notes: "",

      setAddress: (id) => set({ selectedAddressId: id }),

      setShipping: (sellerId, optionId) =>
        set((state) => ({
          shippingSelections: {
            ...state.shippingSelections,
            [sellerId]: optionId,
          },
        })),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setNotes: (notes) => set({ notes }),

      reset: () =>
        set({
          selectedAddressId: null,
          shippingSelections: {},
          paymentMethod: "cod",
          notes: "",
        }),
    }),
    {
      name: "mymiso-checkout",
      partialize: (state) => ({
        selectedAddressId: state.selectedAddressId,
        shippingSelections: state.shippingSelections,
        paymentMethod: state.paymentMethod,
        notes: state.notes,
      }),
    }
  )
);
