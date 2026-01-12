import { Empty } from "antd";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
  height?: "sm" | "md" | "lg";
  actionLabel?: string; 
  onAction?: () => void;
}

export const EmptyState = ({
  title = "Trống",
  description = "Không có dữ liệu hiển thị",
  className,
  height = "md",
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  const heightStyles = {
    sm: "py-8",
    md: "py-16",
    lg: "py-24",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[2rem] border-1 border-dashed border-border transition-all duration-300 w-full",
        heightStyles[height],
        className
      )}
    >
      <Empty
        className="!mb-0"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.2em] text-zinc-500">
              {title}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium text-center px-4">
              {description}
            </span>

            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className="mt-1 text-sm font-bold cursor-pointer text-primary/80 hover:text-primary underline-offset-4 underline transition-all"
              >
                {actionLabel}
              </button>
            )}
          </div>
        }
      />
    </div>
  );
};