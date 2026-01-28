import { Tabs } from "antd";
import { useSearchParams } from "react-router";
import { useEffect, useState, useMemo } from "react";
import Information from "./information";
import { useTranslation } from "react-i18next";
import ActivityLogs from "./activity-log";
import { Icon } from "@/components/icon";
import Address from "./address";
import { useActivityLog } from "@/hooks/useActivityLog"; 

export default function UserDetailTabs({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState("information");

  const { data: logs, isLoading: isLogsLoading } = useActivityLog(userId);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveKey(tabFromUrl);
    }
  }, [searchParams]);

  const tabItems = useMemo(() => [
    {
      key: "information",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:user" className="h-4 w-4" />
          {t("management.user.user-detail.information")}
        </span>
      ),
      children: <Information userId={userId} />,
    },
    {
      key: "activity-log",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:history" className="h-4 w-4" />
          {t("management.user.user-detail.activity-log")}
        </span>
      ),
      children: <ActivityLogs logs={logs} isLoading={isLogsLoading} />,
    },
    {
      key: "address",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:map-pin" className="h-4 w-4" />
          {t("management.user.address")}
        </span>
      ),
      children: <Address userId={userId} />,
    },
  ], [userId, t, logs, isLogsLoading]); 

  const handleChange = (key: string) => {
    setActiveKey(key);
    setSearchParams({ tab: key });
  };

  return (
    <Tabs 
        items={tabItems} 
        activeKey={activeKey} 
        onChange={handleChange} 
        destroyInactiveTabPane={false} 
    />
  );
}
