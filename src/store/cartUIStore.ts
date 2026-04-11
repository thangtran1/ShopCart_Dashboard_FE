import { create } from "zustand";

type CartUIStore = {
  isDrawerOpen: boolean;
  actions: {
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
  };
};

const useCartUIStore = create<CartUIStore>((set) => ({
  isDrawerOpen: false,
  actions: {
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  },
}));

export const useCartDrawerOpen = () => useCartUIStore((state) => state.isDrawerOpen);
export const useCartUIActions = () => useCartUIStore((state) => state.actions);

export default useCartUIStore;
