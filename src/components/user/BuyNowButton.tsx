"use client";
import { toast } from "sonner";
import { Button } from "antd";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useRouter } from "@/router/hooks";
import { useUserToken } from "@/store/userStore";

const BuyNowButton = ({ product }: { product: any }) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, addToCart } = useCart();
  const token = useUserToken()

  const handleBuyNow = async () => {
    if (!token?.accessToken) {
      toast.error("Vui lòng đăng nhập để mua hàng ngay");
      return;
    }
    setIsProcessing(true);
    try {
      const existingItem = items.find((item: any) => item.product._id === product._id);

      if (!existingItem) {
        if (product.stock > 0) {
          await addToCart({ productId: product._id, quantity: 1 });
        } else {
          toast.error("Sản phẩm đã hết hàng!");
          return;
        }
      }

      router.push("/checkout");
    } catch (error) {
      toast.error("Vui lòng đăng nhập để mua hàng");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      type="primary"
      danger
      className="flex-1 min-h-[50px] font-bold"
      onClick={handleBuyNow}
      loading={isProcessing}
    >
      Mua ngay - Giao nhanh
    </Button>
  );
};

export default BuyNowButton;