"use client";

import { useState } from "react";
import OrdersPage from "@/pages/user/orders/page";
import { Tabs, Select } from "antd";

const { Option } = Select;

export function HistoryContent() {
  const [activeKey, setActiveKey] = useState("all");

  const tabItems = [
    { key: "all", label: "Tất cả đơn hàng" },
    { key: "pending", label: "Chờ xử lý" },
    { key: "completed", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="col-span-1 lg:col-span-2 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 space-y-3 lg:space-y-0">
            <h2 className="text-lg font-semibold">Lịch sử mua hàng</h2>

            <div className="w-full lg:w-auto">
              <div className="block lg:hidden">
                <Select
                  value={activeKey}
                  onChange={(value) => setActiveKey(value)}
                  className="w-full"
                >
                  {tabItems.map((tab) => (
                    <Option key={tab.key} value={tab.key}>
                      {tab.label}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="hidden lg:block">
                <Tabs
                  activeKey={activeKey}
                  onChange={(key) => setActiveKey(key)}
                  items={tabItems.map((tab) => ({
                    key: tab.key,
                    label: tab.label,
                  }))}
                />
              </div>
            </div>
          </div>

          <OrdersPage hideTitle />
        </div>
      </div>
    </div>
  );
}
