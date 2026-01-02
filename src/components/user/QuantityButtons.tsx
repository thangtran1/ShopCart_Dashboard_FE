"use client";
import { Product } from "@/types";
import { Minus, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface Props {
  product: Product;
  className?: string;
}

const QuantityButtons = ({ product, className }: Props) => {
  const { items, addToCart, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const currentItem = items.find((item: any) => item.product._id === product._id);
  const itemCount = currentItem ? currentItem.quantity : 0;

  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = async () => {
    setIsUpdating(true);
    try {
      await removeItem(product._id);
      if (itemCount > 1) {
        toast.success("Quantity Decreased successfully!");
      } else {
        toast.success(
          `${product?.name?.substring(0, 12)}... removed successfully!`
        );
      }
    } catch (error) {
      toast.error("Không thể cập nhật giỏ hàng");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock > itemCount) {
      setIsUpdating(true);
      try {
        await addToCart({ productId: product._id, quantity: 1 });
        toast.success("Đã tăng số lượng!");
      } catch (error) {
        toast.error("Không thể cập nhật giỏ hàng");
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.error("Đã đạt giới hạn tồn kho!");
    }
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock || isUpdating}
        className="w-6 h-6 border-[1px] hover:bg-border hover:border-border"
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
        className="w-6 h-6 border-[1px] hover:bg-border hover:border-border"
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default QuantityButtons;