"use client";

import { useState } from "react";
import OrdersPage from "@/pages/user/orders/page";
import { Tabs, Select, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
    <div className="rounded-lg shadow-sm space-y-6">
      <Title level={2} className="!text-2xl !font-semibold">
        Lịch sử mua hàng
      </Title>

      <div className="hidden lg:block">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={statusTabs.map((tab) => ({
            key: tab.key,
            label: tab.label,
          }))}
          type="line"
          size="middle"
          className="mb-6"
        />
      </div>

      <div className="lg:hidden">
        <Select
          value={activeTab}
          onChange={setActiveTab}
          className="w-full"
          options={statusTabs.map((tab) => ({
            label: tab.label,
            value: tab.key,
          }))}
          suffixIcon={<MenuOutlined />}
        />
      </div>
        <OrdersPage hideTitle />
    </div>
  );
}
