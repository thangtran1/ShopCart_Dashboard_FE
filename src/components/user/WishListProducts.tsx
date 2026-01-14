"use client";

import useStore from "@/store/store";
import { useState } from "react";
import {
  DeleteOutlined,
  LoadingOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Badge } from "antd";
import { Link } from "react-router";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/types";
import { toast } from "sonner";
import Title from "@/ui/title";
import { EmptyState } from "../common/EmptyState";
import { useRouter } from "@/router/hooks";
import { useTranslation } from "react-i18next";

const WishListProducts = () => {
  const { t } = useTranslation();
  const navigate = useRouter();
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleRemoveProduct = (id: string) => {
    setIsProcessing(id);
    removeFromFavorite(id);
    toast.success(t("wishList.msg_remove_success"));
    setIsProcessing(null);
  };

  const handleResetWishlist = () => {
    setIsProcessing("clear");
    resetFavorite();
    toast.success(t("wishList.msg_clear_success"));
    setIsProcessing(null);
  };

  const handleGoToShop = () => {
    navigate.push("/shop");
  };

  return (
    <div className="pb-1">
      <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Badge
            count={favoriteProduct.length}
            showZero
            color="#1677ff"
            offset={[-2, 2]}
          >
            <div className="p-3 bg-primary/10 rounded-xl transition-colors hover:bg-primary/20">
              <HeartOutlined className="text-2xl text-primary" />
            </div>
          </Badge>

          <div>
            <Title className="text-2xl font-bold tracking-tight mb-0.5">
              {t("wishList.title")}
            </Title>
            <p className="text-sm text-muted-foreground">
              {t("wishList.sub_title")}
            </p>
          </div>
        </div>

        {favoriteProduct.length > 0 && (
          <Popconfirm
            title={t("wishList.clear_confirm")}
            description={t("wishList.clear_confirm_desc")}
            onConfirm={handleResetWishlist}
            okText={t("wishList.btn_confirm")}
            cancelText={t("wishList.btn_cancel")}
            okButtonProps={{
              danger: true,
              loading: isProcessing === "clear",
            }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="font-bold self-start sm:self-auto"
            >
              {t("wishList.clear_all")}
            </Button>
          </Popconfirm>
        )}
      </div>

      {favoriteProduct.length === 0 ? (
        <EmptyState
          height="sm"
          title={t("wishList.empty_title")}
          description={t("wishList.empty_desc")}
          actionLabel={t("wishList.explore_now")}
          onAction={handleGoToShop}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <div className="rounded-xl border shadow-sm overflow-hidden">
              {favoriteProduct.map((product: Product) => {
                const isItemLoading = isProcessing === product._id;

                return (
                  <div
                    key={product?._id}
                    className={`relative border-b p-4 md:p-5 last:border-b-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${isItemLoading
                      ? "opacity-50 pointer-events-none"
                      : "hover:bg-muted/30"
                      }`}
                  >
                    <div className="relative border rounded-xl overflow-hidden shrink-0 shadow-sm mx-auto sm:mx-0">
                      <img
                        src={product.image}
                        alt={product?.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover hover:scale-110 transition duration-500"
                      />
                    </div>

                    <div className="flex-1 w-full space-y-3">
                      <div className="space-y-1">
                        <h2 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-tight hover:text-primary transition-colors cursor-pointer">
                          {product?.name}
                        </h2>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {t("wishList.category")}:{" "}
                            <span className="text-foreground font-medium uppercase">
                              {product?.category?.name || t("wishList.category_updating")}
                            </span>
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground italic">
                            {t("wishList.stock_status")}:{" "}
                            <span className="text-emerald-500 font-medium italic">
                              {t("wishList.in_stock")}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-auto">
                        <AddToCartButton
                          product={product}
                          className="rounded-lg font-bold shadow-sm"
                        />

                        <div className="h-4 w-[1px] bg-border hidden sm:block" />

                        <Popconfirm
                          title={t("wishList.remove_confirm")}
                          onConfirm={() => handleRemoveProduct(product._id)}
                          okText={t("wishList.btn_confirm")}
                          cancelText={t("wishList.btn_cancel")}
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={
                              isItemLoading ? (
                                <LoadingOutlined />
                              ) : (
                                <DeleteOutlined />
                              )
                            }
                            className="text-xs sm:text-sm font-medium"
                          >
                            {t("wishList.remove")}
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-dashed sm:min-w-[160px]">
                      <div className="flex flex-col sm:items-end">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {t("wishList.current_price")}
                        </span>
                        <PriceFormatter
                          amount={product?.price}
                          className="font-black text-primary text-xl sm:text-2xl"
                        />
                      </div>

                      <Link
                        to={`/product/${product.slug}`}
                        className="hidden md:block"
                      >
                        <Button
                          size="small"
                          type="link"
                          className="text-xs italic"
                        >
                          {t("wishList.view_detail")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishListProducts;