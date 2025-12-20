import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "@/components/user/PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  return (
   <div className="flex items-center justify-between gap-5 min-w-0">
  <div className="flex items-center gap-2 min-w-0">
    <PriceFormatter
      amount={price}
      className={cn("text-success text-lg font-bold", className)}
    />

    {price && discount && (
      <div className="max-w-[120px] truncate">
        <PriceFormatter
          amount={price + (discount * price) / 100}
          className={twMerge(
            "line-through text-sm font-normal text-muted-foreground whitespace-nowrap",
            className
          )}
        />
      </div>
    )}
  </div>
</div>

  );
};

export default PriceView;
