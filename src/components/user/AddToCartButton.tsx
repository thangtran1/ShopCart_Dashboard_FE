"use client";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ShoppingBag, Loader2 } from "lucide-react";
import PriceFormatter from "@/components/user/PriceFormatter";
import QuantityButtons from "@/components/user/QuantityButtons";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useUserToken } from "@/store/userStore";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { items, addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const token = useUserToken();
  const currentItem = items.find((item: any) => item.product._id === product._id);
  const itemCount = currentItem ? currentItem.quantity : 0;
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = async () => {
    if (!token?.accessToken) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    if (product.stock > itemCount) {
      setIsLoading(true); 
      try {
        await addToCart({ productId: product._id, quantity: 1 });
        toast.success(
          `${product?.name?.substring(0, 12)}... added successfully!`
        );
      } catch (error) {
        toast.error("Vui lòng đăng nhập để thực hiện");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Can not add more than available stock");
    }
  };

  return (
    <div className="h-12 w-full flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs mr-5">Số lượng</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Tổng</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className={cn(
            "!w-full shadow-none dark:text-foreground font-semibold hover:bg-primary/80 cursor-pointer",
            className
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang thêm...
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> 
              {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;