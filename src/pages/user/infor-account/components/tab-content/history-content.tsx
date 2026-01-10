"use client";

import OrdersPage from "@/pages/user/orders/page";
import Title from "@/ui/title";
import { ShoppingBag } from "lucide-react";
export function HistoryContent() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="col-span-1 lg:col-span-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="flex items-start gap-2">
            <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all hover:scale-105">
              <ShoppingBag className="text-2xl" />
            </div>

            <div>
              <Title className="text-xl sm:text-2xl font-bold tracking-tight mb-0.5">
                Lịch sử mua hàng
              </Title>
              <p className="text-sm text-muted-foreground">
                Theo dõi chi tiết các đơn hàng bạn đã thực hiện tại hệ thống
              </p>
            </div>
          </div>
        </div>

        <OrdersPage hideTitle />
      </div>
    </div>
  );
}
