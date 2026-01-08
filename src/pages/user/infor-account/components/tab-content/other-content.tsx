"use client";

import { useState } from "react";
import { Tabs, Select, Typography, Badge } from "antd";
import {
  LaptopOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import Contact from "@/pages/user/contact";
import TermsPage from "@/pages/user/public/terms";

const { Title, Paragraph } = Typography;

const EMPTY_IMG =
  "https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png";

export function WarrantyContent() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const warranties: any[] = [];

  const tabs = [
    { key: "all", label: "Tất cả", icon: <LaptopOutlined /> },
    { key: "received", label: "Tiếp nhận", icon: <ClockCircleOutlined /> },
    { key: "processing", label: "Đang xử lý", icon: <CheckCircleOutlined /> },
    { key: "done", label: "Hoàn tất", icon: <CheckOutlined /> },
  ];

  return (
    <div>
      <div className="flex items-start gap-2">
        <Badge showZero color="#f43f5e" offset={[-2, 2]}>
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all hover:scale-105">
            <SafetyCertificateOutlined className="text-2xl text-emerald-600" />
          </div>
        </Badge>

        <div>
          <Title
            level={3}
            className="!text-xl !font-bold tracking-tight !mb-0.5"
          >
            Tra cứu bảo hành
          </Title>
          <Paragraph className="text-sm text-muted-foreground mb-0">
            Theo dõi tình trạng và thời hạn bảo hành của các thiết bị đã mua
          </Paragraph>
        </div>
      </div>

      <div className="hidden lg:block">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabs.map((tab) => ({ key: tab.key, label: tab.label }))}
          type="line"
          size="middle"
          className="mb-6"
        />
      </div>

      <div className="lg:hidden mb-6">
        <Select
          value={activeTab}
          onChange={setActiveTab}
          className="w-full"
          options={tabs.map((tab) => ({ label: tab.label, value: tab.key }))}
        />
      </div>

      {warranties.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <img src={EMPTY_IMG} alt="empty" className="w-48 mb-4" />
          <p className="text-base font-medium mb-2">Bạn chưa có đơn bảo hành</p>
          <a href="/" className="text-sm text-red-600 hover:underline">
            Quay về trang chủ
          </a>
        </div>
      )}
    </div>
  );
}

export function SupportContent() {
  return <Contact />;
}

export function TermsContent() {
  return <TermsPage />;
}
