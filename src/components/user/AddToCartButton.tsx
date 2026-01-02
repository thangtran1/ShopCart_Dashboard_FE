"use client";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import PriceFormatter from "@/components/user/PriceFormatter";
import QuantityButtons from "@/components/user/QuantityButtons";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { useCart } from "@/hooks/useCart";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { items, addToCart } = useCart();
  const currentItem = items.find((item: any) => item.product._id === product._id);
  const itemCount = currentItem ? currentItem.quantity : 0;
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = async () => {
    if (product.stock > itemCount) {
      try {
        await addToCart({ productId: product._id, quantity: 1 });
        toast.success(
          `${product?.name?.substring(0, 12)}... added successfully!`
        );
      } catch (error) {
        toast.error("Vui lòng đăng nhập để thực hiện");
      }
    } else {
      toast.error("Can not add more than available stock");
    }
  };
  return (
    <div className="h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs mr-5">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "shadow-none text-foreground font-semibold hover:bg-primary/80 cursor-pointer",
            className
          )}
        >
          <ShoppingBag /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;