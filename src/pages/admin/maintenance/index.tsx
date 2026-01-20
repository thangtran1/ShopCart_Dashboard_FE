import { Tabs, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { Icon } from "@/components/icon";
import { useTranslation } from "react-i18next";
import { MaintenanceTabKey, useMaintenceTabs } from "./hooks/useMaintenceTabs";
import MaintenanceAllTab from "./components/MaintenanceAllTab";
import { Link } from "react-router";
import MaintenanceScheduledTab from "./components/MaintenanceScheduledTab";

export default function MaintenceSystemPage() {
  const { t } = useTranslation();
  const { activeTab, handleTabChange } = useMaintenceTabs();

  const tabItems = [
    {
      key: "all",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:list-check" className="h-4 w-4" />
          {t("maintenance.maintenance-all")}
        </span>
      ),
      children: <MaintenanceAllTab />,
    },
    {
      key: "scheduled",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:calendar-clock" className="h-4 w-4" />
          {t("maintenance.maintenance-scheduled")}
        </span>
      ),
      children: <MaintenanceScheduledTab />,
    },
  ];

  return (
    <div className="bg-card text-card-foreground px-6 flex flex-col gap-6 rounded-xl border shadow-sm">
      <div className="space-y-6">
        <div className="flex pt-4 items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon icon="lucide:wrench" className="h-7 w-7 text-primary" />
              {t("maintenance.title")}
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              {t("maintenance.description-text")} 
            </p>
          </div>

          <div>
            <Link to="/admin/maintenance/created-new-maintenance">
              <Button
                type="primary"
                size="large"
                icon={<PlusCircleOutlined />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("maintenance.add-maintenance")}
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="mb-0" />

        <Tabs
          activeKey={activeTab}
          onChange={(key) => handleTabChange(key as MaintenanceTabKey)}
          items={tabItems}
          size="large"
          className="maintenance-tabs"
        />
      </div>
    </div>
  );
}
