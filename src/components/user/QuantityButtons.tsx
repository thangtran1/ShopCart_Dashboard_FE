"use client";
import { Product } from "@/types";
import { Minus, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  product: Product;
  className?: string;
}

const QuantityButtons = ({ product, className }: Props) => {
  const { t } = useTranslation();
  const { items, addToCart, decreaseItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const currentItem = items.find((item: any) => item.product._id === product._id);
  const itemCount = currentItem ? currentItem.quantity : 0;
  const isOutOfStock = product?.stock === 0;

  const handleDecreaseProduct = async () => {
    setIsUpdating(true);
    try {
      await decreaseItem(product._id);
      if (itemCount > 1) {
        toast.success(t("cart.toast.decrease_success"));
      } else {
        toast.success(
          t("cart.toast.remove_success", { name: product?.name?.substring(0, 12) })
        );
      }
    } catch (error) {
      toast.error(t("cart.toast.update_error"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock > itemCount) {
      setIsUpdating(true);
      try {
        await addToCart({ productId: product._id, quantity: 1 });
        toast.success(t("cart.toast.increase_success"));
      } catch (error) {
        toast.error(t("cart.toast.update_error"));
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.error(t("cart.toast.stock_limit"));
    }
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={handleDecreaseProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock || isUpdating}
        className="w-6 h-6 border-[1px] hover:bg-muted hover:border-border cursor-pointer"
      >
        <Minus className="w-3 h-3" />
      </Button>

      <div className="w-6 flex justify-center">
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
        ) : (
          <span className="font-semibold text-sm text-center">
            {itemCount}
          </span>
        )}
      </div>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={isOutOfStock || isUpdating}
        className="w-6 h-6 border-[1px] hover:bg-muted hover:border-border cursor-pointer"
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default QuantityButtons;