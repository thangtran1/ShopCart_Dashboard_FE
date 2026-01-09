import { Ticket, CheckCircle2, AlertCircle } from "lucide-react";
import PriceFormatter from "@/components/user/PriceFormatter";
import { useCoupon } from "@/hooks/useCoupon";

interface VoucherSelectorProps {
  orderAmount: number;
  onSelectCoupon: (coupon: any) => void;
  selectedCoupon: any;
  currentUserId: string;
}
const VoucherSelector = ({ orderAmount, onSelectCoupon, selectedCoupon, currentUserId }: VoucherSelectorProps) => {
  const { coupons, loading, error } = useCoupon();

  if (loading) return <div className="text-xs animate-pulse text-muted-foreground py-2">Đang tải mã giảm giá...</div>;
  if (error) return <div className="text-xs text-destructive py-2">{error}</div>;


  return (
    <div className="mb-4">
      <p className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
        <Ticket className="w-4 h-4 text-primary" /> Mã giảm giá khả dụng
      </p>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        {coupons.length > 0 ? (
          coupons.map((c) => {
            // Kiểm tra số tiền tối thiểu
            const isMinOrderUnmet = orderAmount < c.minOrderAmount;
            const isSelected = selectedCoupon?.code === c.code;

            // Lấy lượt dùng để hiển thị badge
            const userUsage = c.usedBy?.find((u: any) => String(u.userId) === String(currentUserId));
            const userUsedCount = userUsage ? userUsage.count : 0;

            return (
              <div
                key={c._id}
                onClick={() => !isMinOrderUnmet && onSelectCoupon(isSelected ? null : c)}
                className={`relative p-3 border rounded-lg transition-all ${isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary bg-card"
                  } ${isMinOrderUnmet ? "opacity-60 cursor-not-allowed bg-muted/20" : "cursor-pointer"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-xs uppercase ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {c.code}
                      </p>

                      {c.limitPerUser > 0 && (
                        <span className="text-[9px] bg-secondary border border-primary/30 text-primary px-1.5 py-0.5 rounded-full font-medium">
                          Còn {c.limitPerUser - userUsedCount} lần dùng
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                      {c.description}
                    </p>

                    {isMinOrderUnmet && (
                      <div className="mt-2 flex items-center gap-1.5 text-error bg-danger p-1.5 rounded-lg border border-primary/30">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <p className="text-[10px] font-medium">
                          Mua thêm <PriceFormatter amount={c.minOrderAmount - orderAmount} /> để áp dụng
                        </p>
                      </div>
                    )}
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary animate-in zoom-in-50 duration-300" />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-6 px-4 border border-dashed rounded-xl bg-muted/10">
            <Ticket className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground text-center italic">
              Bạn không có mã giảm giá nào khả dụng <br /> hoặc đã sử dụng hết lượt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default VoucherSelector;