"use client";

import { useCopyToClipboard } from "@/hooks";
import { Button, Tooltip } from "antd";
import {
  CalendarOutlined,
  InfoCircleOutlined,
  CarOutlined,
  GiftOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useCoupon } from "@/hooks/useCoupon";
import PriceFormatter from "@/components/user/PriceFormatter";

export function DiscountContent() {
  const { coupons, loading } = useCoupon();
  const { copyFn } = useCopyToClipboard();

  const handleCopy = (code: string) => {
    copyFn(code);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 w-full bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex flex-col mb-6 space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-primary rounded-full" />
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Ưu đãi độc quyền</h2>
        </div>
        <p className="text-muted-foreground ml-4.5">Chọn mã giảm giá tốt nhất cho đơn hàng của bạn</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {coupons?.map((voucher) => {
          const isShipping = voucher.code.toLowerCase().includes("ship");
          const expiryDate = new Date(voucher.expiryDate).toLocaleDateString("vi-VN");

          const isUnlimited = voucher.limitPerUser === 0;

          return (
            <div
              key={voucher._id}
              className="group relative flex items-stretch h-36 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`relative flex flex-col items-center justify-center w-28 sm:w-36 shrink-0 text-white shadow-md overflow-hidden
                ${isShipping
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                    : "bg-gradient-to-br from-rose-500 to-red-600"}
                rounded-l-[20px]
              `}
              >
                <div className="z-10 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">
                  {isShipping ? "Freeship" : "Giảm giá"}
                </div>

                <div className="z-10 text-2xl sm:text-3xl font-black tracking-tighter drop-shadow-sm">
                  {voucher.discountType === "percentage" ? `${voucher.discountValue}%` : `${voucher.discountValue / 1000}k`}
                </div>

                <div className="z-10 mt-2 bg-white/20 backdrop-blur-md p-1.5 rounded-full">
                  {isShipping ? <CarOutlined className="text-lg" /> : <GiftOutlined className="text-lg" />}
                </div>

                <div className="absolute -right-2 top-0 bottom-0 w-4 flex flex-col justify-around py-1 z-30">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-3.5 h-3.5 bg-background rounded-full -mr-2" />
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col p-5 border border-l-0 rounded-r-[20px] shadow-sm relative overflow-hidden">

                <div className="absolute top-3 right-3 z-20">
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => handleCopy(voucher.code)}
                  >
                    SAO CHÉP
                  </Button>
                </div>

                <div className="space-y-1.5 pr-16">
                  <h3 className="font-black text-base sm:text-lg text-foreground leading-tight">
                    Giảm {voucher.discountType === "percentage" ? `${voucher.discountValue}%` : <PriceFormatter amount={voucher.discountValue} />}
                  </h3>

                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    <div className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono text-[10px] font-bold border border-slate-200 uppercase">
                      {voucher.code}
                    </div>

                    <Tooltip title={isUnlimited ? "Bạn có thể sử dụng mã này không giới hạn số lần" : `Mỗi khách hàng được dùng tối đa ${voucher.limitPerUser} lần`}>
                      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border transition-colors
                        ${isUnlimited
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                          : "text-amber-600 bg-amber-50 border-amber-100"}
                      `}>
                        <UserOutlined />
                        {isUnlimited ? "Vô hạn lượt dùng" : `${voucher.limitPerUser} lượt dùng`}
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <div className="mt-auto space-y-1">
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground font-medium">
                    <InfoCircleOutlined className="text-blue-500 text-[10px]" />
                    <span className="">Đơn tối thiểu: <span className="font-bold"><PriceFormatter amount={voucher.minOrderAmount} /></span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                    <CalendarOutlined className="text-[10px]" />
                    <span>Hạn dùng: <span className="font-bold">{expiryDate}</span></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}