"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search, RefreshCw, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NoProductAvailableProps {
  className?: string;
  /** Callback khi click "Làm mới" - reload filter hiện tại */
  onRefresh?: () => void;
  /** Callback khi click "Xem tất cả" - bỏ filter, xem toàn bộ */
  onViewAll?: () => void;
}

const NoProductAvailable = ({
  className,
  onRefresh,
  onViewAll,
}: NoProductAvailableProps) => {
  const { t } = useTranslation();
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      window.location.href = "/shop";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-5 min-h-96 space-y-6 text-center rounded-2xl w-full border border-border",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center pt-4 text-center">
        <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-md mb-6">
          <Search className="w-14 h-14 text-primary opacity-80" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("common.no_product.title")}
        </h2>

        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-3">
          {t("common.no_product.description")}
        </p>

        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center space-x-3 bg-background rounded-full px-6 py-3 shadow-md border"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <RefreshCw className="w-5 h-5 text-green-500" />
          </motion.div>
          <span className="text-green-600 font-medium">
            {t("common.no_product.status_updating")}
          </span>
        </motion.div>

        <p className="text-sm text-foreground my-3">
          {t("common.no_product.suggestions")}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-5 cursor-pointer py-2.5 rounded-lg border border-border hover:bg-primary/10 hover:border-primary transition-all duration-300 flex items-center gap-2 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            {t("common.no_product.btn_refresh")}
          </button>

          <button
            onClick={handleViewAll}
            className="px-5 cursor-pointer py-2.5 rounded-lg border border-border hover:bg-primary/10 hover:border-primary transition-all duration-300 flex items-center gap-2 text-sm font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            {t("common.no_product.btn_view_all")}
          </button>
        </div>
      </div>
      {/* Additional help */}
      <div className="pt-4 border-t border-border w-full max-w-md">
        <p className="text-xs text-foreground">
          {t("common.no_product.help_text")}{" "}
          <a href="mailto:thangtrandz04@gmail.com" className="text-primary hover:underline font-medium">
            thangtrandz04@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default NoProductAvailable;