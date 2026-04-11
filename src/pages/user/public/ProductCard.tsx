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
import { Statistic } from "antd";
import { useFlashSales } from "@/hooks/useFlashSales";
import { useQueryClient } from "@tanstack/react-query";

const { Countdown } = Statistic;

const ProductCard = ({ product }: { product: any }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { useActiveFlashSale } = useFlashSales();
  const { data: activeFlashSale } = useActiveFlashSale();

  // Check if product is in flash sale
  const flashSaleItem = activeFlashSale?.items?.find((item: any) => 
    item.product?._id === product._id || item.product === product._id
  );
  
  const isFlashSale = !!flashSaleItem && new Date(activeFlashSale.endTime).getTime() > Date.now();
  
  // Calculate price to display
  const displayPrice = isFlashSale ? flashSaleItem.flashPrice : product?.price;
  const discountPercent = isFlashSale 
    ? Math.round((1 - (flashSaleItem.flashPrice / product?.price)) * 100) 
    : product?.discount;

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

          {/* Flash Sale Banner & Countdown */}
          {isFlashSale ? (
            <div className="absolute bottom-0 left-0 w-full z-10 flex flex-col pointer-events-none">
              <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white text-[11px] font-bold px-2 py-1.5 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
                <span className="flex items-center gap-1 italic tracking-widest text-[12px] drop-shadow-md">
                  <Icon icon="solar:bolt-bold" className="text-yellow-200 fill-current animate-pulse" size={16} /> 
                  FLASH SALE
                </span>
                <div className="bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">
                  <Countdown 
                    value={new Date(activeFlashSale.endTime).getTime()} 
                    format="HH:mm:ss"
                    valueStyle={{ fontSize: 11, fontWeight: '900', color: '#ffef00', letterSpacing: '0.5px' }}
                    onFinish={() => {
                      // Xoá Flash Sale hoặc nạp cái mới khi hết giờ
                      setTimeout(() => {
                        queryClient.invalidateQueries({ queryKey: ["flash-sales", "active"] });
                      }, 1000);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            product?.discount > 0 && (
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
            )
          )}

          <div className={`absolute left-3 flex gap-1.5 flex-wrap ${isFlashSale ? 'top-3' : 'bottom-3'}`}>
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
        
        {isFlashSale ? (
           <div className="flex flex-col gap-2">
             <div className="flex flex-wrap items-baseline gap-2">
               <span className="text-red-600 font-extrabold text-xl leading-none">
                 {displayPrice?.toLocaleString()}đ
               </span>
               <span className="text-muted-foreground text-xs font-medium line-through leading-none">
                 {product.price?.toLocaleString()}đ
               </span>
               <span className="text-[10px] text-white font-bold bg-red-500 px-1 py-0.5 rounded shadow-sm border border-red-400">
                 -{discountPercent}%
               </span>
             </div>
             
             {/* Progress Bar */}
             <div className="relative w-full h-3.5 bg-[#ffbda6] rounded-full overflow-hidden flex items-center justify-center">
                 <div 
                   className="absolute top-0 left-0 bottom-0 bg-[url('https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/flashsale/bb9bc2980db18c4c.png')] bg-cover bg-no-repeat transition-all duration-1000 ease-out"
                   style={{ width: `${Math.min((flashSaleItem.soldQuantity / flashSaleItem.stockLimit) * 100, 100)}%` }}
                 />
                 <span className="relative z-10 text-[9px] text-white font-bold uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] leading-none">
                   {flashSaleItem.soldQuantity >= flashSaleItem.stockLimit ? 'ĐÃ BÁN HẾT' : `ĐÃ BÁN ${flashSaleItem.soldQuantity}`}
                 </span>
             </div>
           </div>
        ) : (
          <PriceView price={product?.price} discount={product?.discount} />
        )}
        
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