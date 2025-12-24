import { cn } from "@/lib/utils";
import { Link } from "react-router";

interface LogoProps {
  className?: string;
  hideText?: boolean;
  iconClassName?: string; // cho phép custom w / h
}

const Logo = ({
  className,
  hideText = false,
  iconClassName,
}: LogoProps) => {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2 select-none", className)}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shadow-sm",
          "w-8 h-8", // default
          iconClassName // override nếu truyền
        )}
      >
        <span className="text-primary font-extrabold text-sm tracking-tight">
          TVT
        </span>
      </div>

      {!hideText && (
        <span className="text-sm text-success font-semibold uppercase">
          Shopcart
        </span>
      )}
    </Link>
  );
};

export default Logo;
