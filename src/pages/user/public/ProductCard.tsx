"use client";

import { Link } from "react-router";
import { StarIcon, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import PriceView from "./PriceView";
import Title from "@/ui/title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "@/components/user/AddToCartButton";
import {
  FireOutlined,
  StarFilled,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Separator } from "@/ui/separator";
import { Icon } from "@/components/icon";

const ProductCard = ({ product }: { product: any }) => {
  const { t } = useTranslation();

  return (
    <div className="text-sm border rounded-2xl border-border group">
      <div className="overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        <div className="relative aspect-square group overflow-hidden bg-background rounded-t-2xl">
          {product?.image && (
            <Link to={`/product/${product?.slug}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
              />
            </Link>
          )}
          
          <ProductSideMenu product={product} />

          {product?.discount > 0 && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
              {product.discount >= 20 ? (
                <Link
                  to={"/?tab=deal"}
                  className="border border-warning/50 p-1 rounded-full bg-background/80 backdrop-blur group-hover:border-warning"
                >
                  <Flame size={18} fill="#fb6c08" className="text-warning" />
                </Link>
              ) : (
                <p className="text-xs border border-primary/30 px-2 py-1 rounded-full text-white bg-primary">
                  {t("product.status-filter.sale")}
                </p>
              )}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                -{product.discount}%
              </div>
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {product.isNew && (
              <span className="bg-blue-500/90 backdrop-blur text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <ThunderboltOutlined /> {t("product.status-filter.new")}
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-amber-500/90 backdrop-blur text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <StarFilled /> {t("product.status-filter.featured")}
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-orange-500/90 backdrop-blur text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <FireOutlined /> {t("product.status-filter.best_seller")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.category?.name || t("product.info.no_category")}
          </span>
          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
            {product.brand?.name || t("product.info.no_brand")}
          </span>
        </div>

        <Title className="text-base line-clamp-1 mt-1 font-bold">{product.name}</Title>
        
        <PriceView price={product?.price} discount={product?.discount} />
        
        <Separator className="my-1" />

        {/* Ratings */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`${index < 4 ? "text-warning" : "text-muted"} size-3.5`}
                fill={index < 4 ? "#f59e0b" : "#e5e7eb"}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-xs line-clamp-1 ml-1">
            | {product?.reviews?.length > 0 
                ? `${product.reviews.length} ${t("product.info.reviews")}`
                : t("product.info.no_reviews")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 mt-1">
          <div className="flex gap-1 min-w-0 flex-1 text-xs"> 
            <span className="text-muted-foreground">{t("product.info.stock")}:</span>
            <span className={`truncate font-semibold ${product?.stock === 0 ? "text-destructive" : "text-success"}`}>
              {product?.stock > 0 
                ? t("product.info.in_stock", { count: product.stock }) 
                : t("product.info.out_of_stock")}
            </span>
          </div>

          <div className="flex gap-2 flex-shrink-0 text-muted-foreground">
            <span className="flex items-center gap-1 text-[10px]">
              <Icon icon="solar:eye-bold" className="w-3 h-3" />
              {product.viewCount || 0}
            </span>
            <span className="flex items-center gap-1 text-[10px]">
              <Icon icon="solar:cart-check-bold" className="w-3 h-3" />
              {product.soldCount || 0}
            </span>
          </div>
        </div>

        <div className="mt-2">
          <AddToCartButton
            product={product}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;