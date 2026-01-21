"use client";

import { Typography } from "antd";
import PriceFormatter from "@/components/user/PriceFormatter";
import VoucherSelector from "./VoucherSelector";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { useUserInfo } from "@/store/userStore";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const userInfo = useUserInfo();

  return (
    <div className="lg:sticky lg:top-4 space-y-4">
      <Title level={4}>{t("checkout.summary.title")}</Title>

      <div className="space-y-4 border border-border rounded-lg p-4 bg-card shadow-sm">
        <div className="space-y-4 max-h-[300px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
          {items.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="flex items-start gap-3 w-full group"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-110"
                />
                <span className="absolute top-0 right-0 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg shadow-sm">
                  x{quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div className="w-full">
                  <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2 break-words">
                    {product.name}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <p className="text-[11px] text-muted-foreground italic">
                    {t("Đơn giá")}: <PriceFormatter amount={product.price} />
                  </p>
                  <PriceFormatter
                    amount={product.price * quantity}
                    className="text-sm font-bold text-primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-2" />

        <VoucherSelector
          orderAmount={totalAmount}
          onSelectCoupon={onSelectCoupon}
          selectedCoupon={selectedCoupon}
          currentUserId={userInfo?.id || ""}
        />

        <Separator className="my-2" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("cart.subtotal")}</span>
            <PriceFormatter amount={totalAmount} />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("cart.discount")}</span>
            {discountAmount > 0 ? (
              <span className="text-red-500 font-medium">
                - <PriceFormatter amount={discountAmount} />
              </span>
            ) : (
              <span className="text-xs italic text-muted-foreground">
                {t("checkout.summary.no_coupon")}
              </span>
            )}
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t("checkout.summary.shipping_fee")}
            </span>
            <span className="text-green-600 font-medium">
              {t("checkout.summary.free")}
            </span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between items-center">
            <span className="font-bold text-base">{t("cart.total")}</span>
            <PriceFormatter
              amount={finalTotal}
              className="text-xl font-bold text-primary"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!loading) onPlaceOrder();
          }}
          disabled={loading}
          className={`w-full h-10 text-lg text-foreground font-semibold mt-4 transition-all ${
            loading ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:scale-[1.02]"
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t("checkout.summary.processing")}
            </div>
          ) : (paymentMethod || "").toUpperCase() === "MOMO" ? (
            t("checkout.summary.btn_online")
          ) : (
            t("checkout.summary.btn_cod")
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
