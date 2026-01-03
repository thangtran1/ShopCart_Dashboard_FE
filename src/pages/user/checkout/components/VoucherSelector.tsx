// src/components/checkout/VoucherSelector.tsx
import { useState, useEffect } from "react";
import { Ticket, CheckCircle2 } from "lucide-react";
import PriceFormatter from "@/components/user/PriceFormatter";
import { couponService } from "@/api/services/couponApi";

interface VoucherSelectorProps {
  orderAmount: number;
  onSelectCoupon: (coupon: any) => void;
  selectedCoupon: any;
}

const VoucherSelector = ({ orderAmount, onSelectCoupon, selectedCoupon }: VoucherSelectorProps) => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await couponService.getAvailableCoupons();
        setCoupons(res || []);
      } catch (error) {
        console.error("Lỗi lấy mã giảm giá");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading) return <div className="text-xs animate-pulse text-muted-foreground">Đang tải mã giảm giá...</div>;

  return (
    <div className="mb-4">
      <p className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
        <Ticket className="w-4 h-4 text-primary" /> Mã giảm giá của bạn
      </p>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
        {coupons.length > 0 ? (
          coupons.map((c) => {
            const isMinOrderUnmet = orderAmount < c.minOrderAmount;
            const isSelected = selectedCoupon?.code === c.code;

            return (
              <div
                key={c._id}
                onClick={() => !isMinOrderUnmet && onSelectCoupon(isSelected ? null : c)}
                className={`relative p-3 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary"
                } ${isMinOrderUnmet ? "opacity-50 cursor-not-allowed " : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`font-bold text-xs uppercase ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {c.code}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                      {c.description}
                    </p>
                    {isMinOrderUnmet && (
                      <p className="text-[10px] text-destructive mt-1 italic font-medium">
                        Thiếu <PriceFormatter amount={c.minOrderAmount - orderAmount} /> để áp dụng
                      </p>
                    )}
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground italic">Hiện không có mã nào khả dụng</p>
        )}
      </div>
    </div>
  );
};

export default VoucherSelector;