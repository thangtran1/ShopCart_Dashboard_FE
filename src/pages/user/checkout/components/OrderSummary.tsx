"use client";

import { Typography } from "antd";
import { Shield, Truck } from "lucide-react";
import PriceFormatter from "@/components/user/PriceFormatter";
import VoucherSelector from "./VoucherSelector";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";

const { Title } = Typography;

interface OrderSummaryProps {
  items: any[];
  totalAmount: number;
  discountAmount: number;
  finalTotal: number;
  selectedCoupon: any;
  onSelectCoupon: (coupon: any) => void;
  onPlaceOrder: () => void;
  loading: boolean;
  paymentMethod: string;
}

const OrderSummary = ({
  items,
  totalAmount,
  discountAmount,
  finalTotal,
  selectedCoupon,
  onSelectCoupon,
  onPlaceOrder,
  loading,
  paymentMethod,
}: OrderSummaryProps) => {
  return (
    <div className="lg:sticky lg:top-4 space-y-4">
      <Title level={4}>Tóm Tắt Đơn Hàng</Title>

      <div className="space-y-4 border border-border rounded-lg p-4 bg-card shadow-sm">
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-border">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] px-1.5 rounded-bl-md">
                  x{quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <PriceFormatter amount={product.price * quantity} className="text-xs text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-2" />

        <VoucherSelector
          orderAmount={totalAmount}
          onSelectCoupon={onSelectCoupon}
          selectedCoupon={selectedCoupon}
        />

        <Separator className="my-2" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính</span>
            <PriceFormatter amount={totalAmount} />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá</span>
            {discountAmount > 0 ? (
              <span className="text-red-500 font-medium">- <PriceFormatter amount={discountAmount} /></span>
            ) : (
              <span className="text-xs italic text-muted-foreground">Chưa có mã</span>
            )}
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phí vận chuyển</span>
            <span className="text-green-600 font-medium">Miễn phí</span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between items-center">
            <span className="font-bold text-base">Tổng cộng</span>
            <PriceFormatter amount={finalTotal} className="text-xl font-bold text-primary" />
          </div>
        </div>

        <Button
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            if (!loading) onPlaceOrder();
          }}
          disabled={loading}
          className={`w-full h-10 text-lg font-semibold mt-4 ${
            loading ? "cursor-not-allowed opacity-80" : "cursor-pointer"
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-border border-t-transparent rounded-full animate-spin" />
              Đang xử lý...
            </div>
          ) : (
            paymentMethod === "COD" || paymentMethod === "cod" 
              ? "Đặt hàng (COD)" 
              : "Thanh toán ngay"
          )}
        </Button>

        {/* Cam kết an toàn */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-green-600" />
            Bảo mật 100%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Truck className="w-3.5 h-3.5 text-primary" />
            Giao hàng nhanh
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;