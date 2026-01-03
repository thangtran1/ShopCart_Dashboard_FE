import { Ticket, CheckCircle2 } from "lucide-react";
import PriceFormatter from "@/components/user/PriceFormatter";
import { useCoupon } from "@/hooks/useCoupon";

interface VoucherSelectorProps {
  orderAmount: number;
  onSelectCoupon: (coupon: any) => void;
  selectedCoupon: any;
}

const VoucherSelector = ({ orderAmount, onSelectCoupon, selectedCoupon }: VoucherSelectorProps) => {
  const { coupons, loading, error } = useCoupon();

  if (loading) {
    return <div className="text-xs animate-pulse text-muted-foreground py-2">Đang tải mã giảm giá...</div>;
  }

  if (error) {
    return <div className="text-xs text-destructive py-2">{error}</div>;
  }

  return (
    <div className="mb-4">
      <p className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
        <Ticket className="w-4 h-4 text-primary" /> Mã giảm giá của bạn
      </p>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        {coupons.length > 0 ? (
          coupons.map((c) => {
            const isMinOrderUnmet = orderAmount < c.minOrderAmount;
            const isSelected = selectedCoupon?.code === c.code;

            return (
              <div
                key={c._id}
                onClick={() => !isMinOrderUnmet && onSelectCoupon(isSelected ? null : c)}
                className={`relative p-3 border rounded-lg cursor-pointer transition-all ${isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary"
                  } ${isMinOrderUnmet ? "opacity-50 cursor-not-allowed bg-muted/20" : "bg-card"}`}
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
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary animate-in zoom-in-50 duration-300" />}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground italic bg-muted/30 p-3 rounded-lg border border-dashed">
            Hiện không có mã nào khả dụng
          </p>
        )}
      </div>
    </div>
  );
};

export default VoucherSelector;