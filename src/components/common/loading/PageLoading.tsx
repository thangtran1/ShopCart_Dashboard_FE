import { Loader2 } from "lucide-react";

interface PageLoadingProps {
  height?: number | string; // 300 | "60vh" | "calc(100vh-200px)"
  text?: string;
  spinnerSize?: number;
  textClassName?: string;
}

const PageLoading = ({
  height = 300,
  text = "Đang tải...",
  spinnerSize = 40,
  textClassName = "text-sm font-medium text-muted-foreground",
}: PageLoadingProps) => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-4"
      style={{
        minHeight: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <div className="relative flex items-center justify-center">
        <div
          className="absolute rounded-full border-4 border-primary/20 border-t-primary animate-spin"
          style={{
            width: spinnerSize + 20,
            height: spinnerSize + 20,
            animationDuration: "1.2s",
          }}
        />
        <Loader2
          className="animate-spin text-primary relative z-10"
          style={{
            width: spinnerSize,
            height: spinnerSize,
            animationDuration: "0.8s",
          }}
        />
      </div>

      <p className={`${textClassName} animate-pulse`}>{text}</p>
    </div>
  );
};

export default PageLoading;
