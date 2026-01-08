"use client";

import { useCopyToClipboard } from "@/hooks";
import { Badge, Button, Tooltip } from "antd";
import {
  CalendarOutlined,
  InfoCircleOutlined,
  CarOutlined,
  GiftOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useCoupon } from "@/hooks/useCoupon";
import PriceFormatter from "@/components/user/PriceFormatter";
import Title from "@/ui/title";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { useState } from "react";

export function DiscountContent() {
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-36 w-full bg-slate-100 animate-pulse rounded-2xl"
          />
        ))}
      </div>
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
                Ưu đãi độc quyền
              </Title>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Săn voucher và mã giảm giá dành riêng cho thành viên thân thiết
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {coupons && coupons.length > 0 ? (
          <ScrollArea className="h-[450px] pr-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {coupons.map((voucher) => {
                const isShipping = voucher.code.toLowerCase().includes("ship");
                const expiryDate = new Date(
                  voucher.expiryDate
                ).toLocaleDateString("vi-VN");
                const isUnlimited = voucher.limitPerUser === 0;

                return (
                  <div
                    key={voucher._id}
                    className="group relative flex items-stretch h-36 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div
                      className={`relative flex flex-col items-center justify-center w-28 sm:w-36 shrink-0 text-white shadow-md overflow-hidden
                ${
                  isShipping
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                    : "bg-gradient-to-br from-rose-500 to-red-600"
                } rounded-l-[20px]`}
                    >
                      <div className="z-10 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">
                        {isShipping ? "Freeship" : "Giảm giá"}
                      </div>
                      <div className="z-10 text-2xl sm:text-3xl font-black tracking-tighter drop-shadow-sm">
                        {voucher.discountType === "percentage"
                          ? `${voucher.discountValue}%`
                          : `${voucher.discountValue / 1000}k`}
                      </div>
                      <div className="z-10 mt-2 bg-white/20 backdrop-blur-md p-1.5 rounded-full">
                        {isShipping ? (
                          <CarOutlined className="text-lg" />
                        ) : (
                          <GiftOutlined className="text-lg" />
                        )}
                      </div>

                      <div className="absolute -right-2 top-0 bottom-0 w-4 flex flex-col justify-around py-1 z-30">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="w-3.5 h-3.5 bg-background rounded-full -mr-2"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col p-5 border border-l-0 rounded-r-[20px] shadow-sm relative overflow-hidden bg-card">
                      <div className="absolute top-3 right-3 z-20">
                        <Button
                          type="primary"
                          size="small"
                          className="font-bold text-[10px]"
                          onClick={() => handleCopy(voucher.code)}
                        >
                          {copiedCode === voucher.code ? "ĐÃ CHÉP" : "SAO CHÉP"}
                        </Button>
                      </div>

                      <div className="space-y-1.5 pr-16">
                        <h3 className="font-black text-base text-foreground leading-tight line-clamp-1">
                          Giảm{" "}
                          {voucher.discountType === "percentage" ? (
                            `${voucher.discountValue}%`
                          ) : (
                            <PriceFormatter amount={voucher.discountValue} />
                          )}
                        </h3>

                        <div className="flex flex-wrap gap-2 items-center">
                          <div className="px-2 py-0.5 bg-muted text-muted-foreground rounded font-mono text-[10px] font-bold border border-border uppercase">
                            {voucher.code}
                          </div>

                          <Tooltip
                            title={
                              isUnlimited
                                ? "Không giới hạn số lần dùng"
                                : `Tối đa ${voucher.limitPerUser} lần/người`
                            }
                          >
                            <div
                              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                                isUnlimited
                                  ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                                  : "text-amber-600 bg-amber-50 border-amber-100"
                              }`}
                            >
                              <UserOutlined />
                              {isUnlimited
                                ? "Vô hạn"
                                : `${voucher.limitPerUser} lượt`}
                            </div>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="mt-auto space-y-1 border-t border-dashed pt-2">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                          <InfoCircleOutlined className="text-blue-500 text-[10px]" />
                          <span>
                            Đơn tối thiểu:{" "}
                            <span className="font-bold text-foreground">
                              <PriceFormatter amount={voucher.minOrderAmount} />
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                          <CalendarOutlined className="text-[10px]" />
                          <span>
                            HSD:{" "}
                            <span className="font-bold text-foreground">
                              {expiryDate}
                            </span>
                          </span>
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
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-2xl bg-muted/10">
            <div className="p-4 bg-muted/20 rounded-full mb-4">
              <GiftOutlined className="text-4xl text-muted-foreground opacity-20" />
            </div>
            <p className="text-muted-foreground font-medium">
              Hiện không có mã giảm giá nào khả dụng
            </p>
            <p className="text-xs text-muted-foreground/60">
              Hãy quay lại sau bạn nhé!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
