"use client";

import { useState } from "react";
import { Tabs } from "antd";
import OrdersPage from "@/pages/user/orders/page";

export function HistoryContent() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const statusTabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "shipping", label: "Đang vận chuyển" },
    { key: "delivered", label: "Đã giao hàng" },
    { key: "cancel", label: "Đã hủy" },
  ];

  return (
    <div className="rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Lịch sử mua hàng</h2>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={statusTabs.map((tab) => ({ key: tab.key, label: tab.label }))}
        className="mb-6"
        type="line"
        size="middle"
      />

      <OrdersPage hideTitle />
    </div>
  );
}
