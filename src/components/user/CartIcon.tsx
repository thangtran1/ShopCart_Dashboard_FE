"use client";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "@/hooks/useCart";

const CartIcon = () => {
  const { items } = useCart();

  const itemCount = items?.length || 0;

  return (
    <Link to={"/cart"} className="group relative flex items-center justify-center !text-foreground hover:!text-primary transition-colors">
      <ShoppingBag className="w-5 h-5 cursor-pointer group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full border border-background bg-foreground text-background text-[10px] font-black flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </Link>
  );
};

export default CartIcon;