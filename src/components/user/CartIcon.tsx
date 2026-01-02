"use client";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "@/hooks/useCart";

const CartIcon = () => {
  const { items } = useCart();
  const totalItemsCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;
  return (
    <Link to={"/cart"} className="group relative !text-foreground hover:!text-primary">
      <ShoppingBag className="w-5 h-5 hover:cursor-pointer" />
      <span className="absolute border border-border bg-foreground text-background -top-1.5 -right-1.5 h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center transition-all">
        {totalItemsCount > 99 ? "99+" : totalItemsCount}
      </span>
    </Link>
  );
};

export default CartIcon;