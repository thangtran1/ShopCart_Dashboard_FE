"use client";
import { Product } from "@/types";
import useStore from "@/store/store";
import { Heart } from "lucide-react";
import { Link } from "react-router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product | null | undefined;
}) => {
  const { t } = useTranslation();
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const availableItem = favoriteProduct.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableItem || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
          ? t("wishlist.msg_remove_success")
          : t("wishlist.add_success")
        );
      });
    }
  };
  return (
    <>
      {!showProduct ? (
        <Link to={"/wishlist"} className="group relative !text-foreground hover:!text-primary">
          <Heart className="w-5 h-5 hover:text-primary hover:cursor-pointer" />
          <span className="absolute border border-border bg-foreground text-background -top-1 -right-1  h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {favoriteProduct?.length ? favoriteProduct?.length : 0}
          </span>
        </Link>
      ) : (
        <button
          onClick={handleFavorite}
          className="group relative hover:text-shop_light_green hoverEffect border border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm"
        >
          {existingProduct ? (
            <Heart
              fill="#3b9c3c"
              className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5 w-5 h-5"
            />
          ) : (
            <Heart className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5 w-5 h-5" />
          )}
        </button>
      )}
    </>
  );
};

export default FavoriteButton;
