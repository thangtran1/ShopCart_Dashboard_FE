import { Tabs } from "antd";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import Information from "./information";
import { useTranslation } from "react-i18next";
import ActivityLogs from "./activity-log";
import { Icon } from "@/components/icon";
import {
  ActivityLog,
  detailActivityLogForUser,
} from "@/api/services/activity-logApi";
import Address from "./address";

export default function UserDetailTabs({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState("information");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveKey(tabFromUrl);
    }
  }, [searchParams]);

  const tabItems = [
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

      children: (
        <ActivityLogs
          fetchLogsApi={() =>
            detailActivityLogForUser(userId) as Promise<{
              data: { success: boolean; message: string; data: ActivityLog[] };
            }>
          }
        />
      ),
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
  ];

  const handleChange = (key: string) => {
    setActiveKey(key);
    searchParams.set("tab", key);
    setSearchParams(searchParams);
  };

  return (
    <Tabs items={tabItems} activeKey={activeKey} onChange={handleChange} />
  );
}
