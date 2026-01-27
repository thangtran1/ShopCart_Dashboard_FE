"use client";
import PriceFormatter from "@/components/user/PriceFormatter";
import { useTranslation } from "react-i18next";

interface Props {
  price?: number;
  discount?: number;
  stock?: number;
  className?: string;
}

const PriceView = ({ price = 0, discount = 0, stock = 0, className }: Props) => {
  const { t } = useTranslation();
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price - (price * discount) / 100 : price;
  const installmentPerMonth = Math.round(finalPrice / 12);
  const isOutOfStock = stock <= 0;

  return (
    <div className={`w-full bg-gradient-to-br from-primary/30 to-transparent border border-primary/20 rounded-2xl p-5 shadow-sm ${className || ""}`}>
      
      <div className="flex items-center gap-2 mb-3">
        <div className={`relative flex h-2 w-2`}>
          {!isOutOfStock && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}></span>
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isOutOfStock ? "text-red-600" : "text-foreground"}`}>
          {isOutOfStock 
            ? t("product.info.out_of_stock") 
            : t("product.info.in_stock", { count: stock })
          }
        </span>
      </div>

      <div className="relative flex items-center justify-between gap-4">
        
        <div className="flex-1">
          <PriceFormatter
            amount={finalPrice}
            className="text-2xl font-black text-foreground tracking-tighter leading-none"
          />
          {hasDiscount && (
            <div className="flex items-center gap-2 mt-1.5">
              <PriceFormatter amount={price} className="text-xs text-foreground line-through decoration-[1px]" />
              <span className="text-red-600 text-[11px] font-black">-{discount}%</span>
            </div>
          )}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center h-full py-1">
          <div className="w-[1px] h-full bg-gray-200 border-l border-dashed border-gray-300" />
          <span className="absolute top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/10 to-transparent border border-primary/40 px-2 py-0.5 rounded-full text-[9px] text-foreground font-bold uppercase z-10 shadow-sm">
            {t("product.common.or")}
          </span>
        </div>

        <div className="flex-1 text-right">
          <p className="text-[10px] font-bold text-foreground uppercase tracking-tight mb-1">
            {t("product.info.installment_online")}
          </p>
          <div className="flex items-baseline justify-end gap-0.5">
            <PriceFormatter 
                amount={installmentPerMonth} 
                className="text-xl font-bold tracking-tighter" 
            />
            <span className="text-[10px] text-foreground font-bold uppercase">
                /{t("product.common.month")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceView;