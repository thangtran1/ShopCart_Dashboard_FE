import { useState, useEffect } from "react";
import { Tabs } from "antd";
import { Icon } from "@/components/icon";
import { useTranslation } from "react-i18next";
import { CardTitle } from "@/ui/card";
import CategoriesManagement from "./components/CategoriesManagement";
import BrandsManagement from "./components/BrandsManagement";
import { useSearchParams } from "react-router";

type TabType = "categories" | "brands";

const tabConfig = [
  {
    key: "categories" as TabType,
    label: "catalog.categories",
    icon: "solar:folder-bold-duotone",
    component: <CategoriesManagement />,
  },
  {
    key: "brands" as TabType,
    label: "catalog.brands",
    icon: "solar:star-bold-duotone",
    component: <BrandsManagement />,
  },
];

export default function CatalogManagement() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("categories");

  // Đồng bộ tab với URL
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as TabType;
    if (tabFromUrl && ["categories", "brands"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (key: string) => {
    const newTab = key as TabType;
    setActiveTab(newTab);

    // Cập nhật URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", newTab);
    setSearchParams(newSearchParams);
  };

  const items = tabConfig.map((tab) => ({
    key: tab.key,
    label: (
      <div className="flex items-center gap-2">
        <Icon icon={tab.icon} className="w-5 h-5" />
        <span>{t(tab.label)}</span>
      </div>
    ),
    children: tab.component,
  }));

  return (
    <div className="bg-card text-card-foreground p-4 rounded-xl border shadow-sm">
      {/* Header */}
      <div>
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("catalog.title", "Quản lý Danh mục & Thương hiệu")}
        </CardTitle>
      </div>

      <Tabs
        size="large"
        activeKey={activeTab}
        onChange={handleTabChange}
        items={items}
      />
    </div>
  );
}
