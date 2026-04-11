"use client";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useCartUIActions } from "@/store/cartUIStore";

const CartIcon = () => {
  const { items } = useCart();
  const { openDrawer } = useCartUIActions();

  const itemCount = items?.length || 0;

  return (
    <div onClick={openDrawer} className="group relative flex items-center justify-center !text-foreground hover:!text-primary transition-colors cursor-pointer">
      <ShoppingBag className="w-5 h-5" />
      <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full border border-background bg-foreground text-background text-[10px] font-black flex items-center justify-center transition-all shadow-sm">
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </div>
  );
};

export default CartIcon;