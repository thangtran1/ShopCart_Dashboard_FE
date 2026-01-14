"use client";

import OrdersPage from "@/pages/user/orders/page";
import Title from "@/ui/title";
import { ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HistoryContent() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="col-span-1 lg:col-span-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all hover:scale-105 shrink-0">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>

            <div className="min-w-0">
              <Title className="text-xl sm:text-2xl font-bold tracking-tight mb-0.5">
                {t("history.title")}
              </Title>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("history.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <OrdersPage hideTitle />
        </div>
      </div>
    </div>
  );
}