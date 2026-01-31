import { useState } from "react";
import { Tabs, Button } from "antd";
import { Icon } from "@/components/icon";
import { useTranslation } from "react-i18next";
import { PlusCircleOutlined } from "@ant-design/icons";
import BannerList from "./components/BannerList";
import BannerSettings from "./components/BannerSettings";
import { Separator } from "@/ui/separator";

export default function BannerConfigPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"list" | "settings">("list");

  const handleTabChange = (key: string) => {
    setActiveTab(key as "list" | "settings");
  };

  const tabItems = [
    {
      key: "list",
      label: (
        <div className="flex items-center gap-2 px-2">
          <Icon icon="lucide:list" className="h-4 w-4" />
          <span>{t("management.banner.banner-list")}</span>
        </div>
      ),
      children: <BannerList />,
    },
    {
      key: "settings",
      label: (
        <div className="flex items-center gap-2 px-2">
          <Icon icon="lucide:settings" className="h-4 w-4" />
          <span>{t("management.banner.global-settings")}</span>
        </div>
      ),
      children: <BannerSettings />,
    },
  ];

  return (
    <div className="bg-card text-card-foreground px-4 flex flex-col gap-6 rounded-xl border shadow-sm">
      {/* Header */}
      <div className="pt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex flex-wrap items-center gap-2">
              🎯 {t("management.banner.manager-banner")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("management.banner.manager-banner-config-description")}
            </p>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setActiveTab("list");
              // Trigger create modal in BannerList component
              const event = new CustomEvent("openCreateModal");
              window.dispatchEvent(event);
            }}
            className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
          >
            {t("management.banner.manager-banner-config-create")}
          </Button>
        </div>
      </div>


      <Separator className="my-0" />

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        size="large"
      />
    </div>
  );
}
