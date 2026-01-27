"use client";
import { Product } from "@/types";
import { ShoppingBag, Loader2 } from "lucide-react";
import PriceFormatter from "@/components/user/PriceFormatter";
import QuantityButtons from "@/components/user/QuantityButtons";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useUserToken } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/ui/button";

interface Props {
  product: Product;
}

const AddToCartButton = ({ product }: Props) => {
  const { t } = useTranslation();
  const { items, addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const token = useUserToken();
  const currentItem = items.find((item: any) => item.product._id === product._id);
  const itemCount = currentItem ? currentItem.quantity : 0;
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = async () => {
    if (!token?.accessToken) {
      toast.error(t("cart.toast.login_required"));
      return;
    }

    if (product.stock > itemCount) {
      setIsLoading(true);
      try {
        await addToCart({ productId: product._id, quantity: 1 });
        toast.success(
          t("cart.toast.add_success", { name: product?.name?.substring(0, 12) })
        );
      } catch (error) {
        toast.error(t("cart.toast.add_error"));
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error(t("cart.toast.stock_limit"));
    }
  };

  return (
    <div className="h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs mr-5">{t("cart.quantity")}</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">{t("cart.total")}</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full rounded-xl text-white cursor-pointer"
          size='lg'
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("cart.adding")}
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 mr-2" />
              {isOutOfStock ? t("cart.out_of_stock") : t("cart.add_to_cart")}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;