"use client";

import { useCopyToClipboard } from "@/hooks";
import { Badge } from "antd";
import { CalendarOutlined, GiftOutlined } from "@ant-design/icons";
import { useCoupon } from "@/hooks/useCoupon";
import PriceFormatter from "@/components/user/PriceFormatter";
import Title from "@/ui/title";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { useTranslation } from "react-i18next";

export function DiscountContent() {
  const { t, i18n } = useTranslation();
  const { coupons, loading } = useCoupon();
  const { copyFn } = useCopyToClipboard();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    copyFn(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  if (loading) {
    return (
      <>
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="p-3 w-12 h-12 rounded-xl bg-slate-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-48 bg-slate-200 animate-pulse rounded-lg" />
              <div className="h-4 w-92 bg-slate-100 animate-pulse rounded hidden sm:block" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-stretch h-28 w-full border border-border rounded-2xl overflow-hidden"
            >
              <div className="w-24 sm:w-28 shrink-0 bg-slate-200 animate-pulse flex flex-col items-center justify-center gap-2">
                <div className="h-2 w-10 bg-slate-300 rounded" />
                <div className="h-6 w-14 bg-slate-300 rounded" />
              </div>
              <div className="flex-1 p-3 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="h-4 w-32 bg-slate-200 animate-pulse rounded" />
                  <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-full" />
                </div>
                <div className="h-3 w-20 bg-slate-200 animate-pulse rounded" />
                <div className="border-t border-dashed border-border pt-2 flex justify-between">
                  <div className="h-2 w-24 bg-slate-100 animate-pulse rounded" />
                  <div className="h-2 w-16 bg-slate-100 animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-col mb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge count="Hot" color="#f59e0b" offset={[2, 2]}>
              <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all hover:scale-105">
                <GiftOutlined className="text-2xl text-amber-500" />
              </div>
            </Badge>

            <div>
              <Title className="text-xl sm:text-2xl font-bold tracking-tight mb-0.5">
                {t("discount.title")}
              </Title>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {t("discount.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {coupons && coupons.length > 0 ? (
          <ScrollArea>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 overflow-y-auto max-h-[450px] pr-3">
              {coupons.map((voucher) => {
                const isShipping = voucher.code.toLowerCase().includes("ship");
                const expiryDate = new Date(voucher.expiryDate).toLocaleDateString(
                  i18n.language === "vi" ? "vi-VN" : "en-US"
                );
                const isUnlimited = voucher.limitPerUser === 0;

                return (
                  <div
                    key={voucher._id}
                    className="group relative flex items-stretch h-28 transition-all duration-300 hover:shadow-md border border-primary/30 rounded-2xl overflow-hidden bg-card"
                  >
                    <div
                      className={`relative flex flex-col items-center justify-center w-24 sm:w-28 shrink-0 text-white
                        ${isShipping
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                          : "bg-gradient-to-br from-rose-500 to-red-600"
                        }
                      `}
                    >
                      <div className="z-10 text-[9px] font-bold uppercase tracking-tighter opacity-90">
                        {isShipping ? t("discount.freeship") : t("discount.discount_label")}
                      </div>
                      <div className="z-10 text-xl sm:text-2xl font-black tracking-tighter">
                        {voucher.discountType === "percentage"
                          ? `${voucher.discountValue}%`
                          : `${voucher.discountValue / 1000}k`}
                      </div>

                      <div className="absolute -right-[7px] top-0 bottom-0 w-4 flex flex-col justify-around py-1 z-30">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-card rounded-full"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-2.5 px-4 relative">
                      <div className="absolute top-2.5 right-3">
                        <button
                          onClick={() => handleCopy(voucher.code)}
                          className={`px-3 py-1 rounded-full cursor-pointer text-[10px] font-bold transition-all duration-300 active:scale-90 ${
                            copiedCode === voucher.code
                            ? "bg-blue-500 text-white"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          {copiedCode === voucher.code ? t("discount.copied") : t("discount.copy")}
                        </button>
                      </div>

                      <div className="pr-14">
                        <h3 className="font-bold text-sm text-foreground line-clamp-1 mb-1">
                          {t("discount.off")}{" "}
                          {voucher.discountType === "percentage" ? (
                            `${voucher.discountValue}%`
                          ) : (
                            <PriceFormatter amount={voucher.discountValue} />
                          )}
                        </h3>

                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-primary/20 text-foreground rounded text-[10px] font-mono font-bold uppercase border border-primary/5">
                            {voucher.code}
                          </span>
                          <span
                            className={`text-[10px] font-medium ${
                              isUnlimited ? "text-primary" : "text-warning"
                            }`}
                          >
                            •{" "}
                            {isUnlimited
                              ? t("discount.unlimited")
                              : t("discount.usage_limit", { count: voucher.limitPerUser })}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-dashed pt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>
                            {t("discount.min_order")}{" "}
                            <span className="ml-1 font-bold text-foreground">
                              <PriceFormatter amount={voucher.minOrderAmount} />
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarOutlined className="text-[9px]" />
                          <span>{t("discount.expiry")} {expiryDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        ) : (
          <EmptyState
            height="sm"
            title={t("discount.empty.title")}
            description={t("discount.empty.description")}
          />
        )}
      </div>
    </div>
  );
}