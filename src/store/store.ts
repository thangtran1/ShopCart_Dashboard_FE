import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  favoriteProduct: Product[];
  viewedProducts: Product[];
  removeItem: (productId: string) => void;
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
  addViewedProduct: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      items: [],
      favoriteProduct: [],
      viewedProducts: [],

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),
      addToFavorite: (product) => {
        return new Promise<void>((resolve) => {
          set((state) => {
            const isFavorite = state.favoriteProduct.some((item) => item._id === product._id);
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter((item) => item._id !== product._id)
                : [...state.favoriteProduct, product],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId) =>
        set((state) => ({
          favoriteProduct: state.favoriteProduct.filter((item) => item?._id !== productId),
        })),

      resetFavorite: () => set({ favoriteProduct: [] }),

      addViewedProduct: (product) => {
        set((state) => {
          const MAX_ITEMS = 10; 
          const filtered = state.viewedProducts.filter((p) => p._id !== product._id);
          return {
            viewedProducts: [product, ...filtered].slice(0, MAX_ITEMS),
          };
        });
      },

      clearRecentlyViewed: () => set({ viewedProducts: [] }),
    }),
    {
      name: "cart-store",
    }
  )
);

export default useStore;