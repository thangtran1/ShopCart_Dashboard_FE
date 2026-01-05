"use client";

import OrdersPage from "@/pages/user/orders/page";
export function HistoryContent() {

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <div className="col-span-1 lg:col-span-2">
        <h2 className="text-lg font-semibold">Lịch sử mua hàng</h2>
        <OrdersPage hideTitle />
      </div>
    </div>
  );
}
