"use client";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useRouter } from "@/router/hooks";
import { useUserToken } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/ui/button";

interface BuyNowButtonProps {
  product: any;
}

const BuyNowButton = ({ product }: BuyNowButtonProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, addToCart } = useCart();
  const token = useUserToken();

  const handleBuyNow = async () => {
    if (!token?.accessToken) {
      toast.error(t("product.toast.login_buy_now"));
      return;
    }
    setIsProcessing(true);
    try {
      const existingItem = items.find((item: any) => item.product._id === product._id);

      if (!existingItem) {
        if (product.stock > 0) {
          await addToCart({ productId: product._id, quantity: 1 });
        } else {
          toast.error(t("product.toast.out_of_stock"));
          return;
        }
      }

      router.push("/checkout");
    } catch (error) {
      toast.error(t("product.toast.buy_error"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (

    <Button
      className="w-full rounded-xl text-white cursor-pointer"
      size='lg'
      variant='destructive'
      loading={isProcessing}
      onClick={handleBuyNow}
    >
      {t("product.buy_now")}
    </Button>
  );
};

export default BuyNowButton;