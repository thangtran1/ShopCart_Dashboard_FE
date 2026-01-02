"use client";
import { Package } from "lucide-react";
import { Link } from "react-router";
import { useOrder } from "@/hooks/useOrder";

const OrderIcon = () => {
  const { orders } = useOrder();
  const orderCount = orders?.length || 0;
  return (
    <Link to="/orders" className="group relative !text-foreground hover:!text-primary transition-colors">
      <Package className="w-5 h-5 cursor-pointer" />
      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center border border-background">
        {orderCount}
      </span>
    </Link>
  );
};

export default OrderIcon;
