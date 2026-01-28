import { useState, useEffect } from "react";
import { CardTitle } from "@/ui/card";
import { Tabs } from "antd";
import { Icon } from "@/components/icon";
import { useSearchParams } from "react-router";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getSystemSettings, SystemSettings } from "@/api/services/profileApi";
import { Separator } from "@/ui/separator";
import PersonalInfoTab from "./components/PersonalInfoTab";
import SecurityTab from "./components/SecurityTab";
import PreferencesTab from "./components/PreferencesTab";
import { useTranslation } from "react-i18next";
import ActivityLogs from "../../management/user/[id]/tabs/activity-log";
import { useAdminActivityLog } from "@/hooks/useActivityLog";

export default function ProfilePage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile, updateProfile } = useUserProfile();
  
  const { data: adminLogs, isLoading: isAdminLogsLoading } = useAdminActivityLog();

  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const fetchSystemSettings = async () => {
    const settingsData = await getSystemSettings();
    setSystemSettings(settingsData);
  };

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const tabItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:user" className="h-4 w-4" />
          {t("profile.title")}
        </span>
      ),
      children: (
        <PersonalInfoTab profile={profile} onProfileUpdate={updateProfile} />
      ),
    },
    {
      key: "activity-log",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:history" className="h-4 w-4" />
          {t("profile.activity-log")}
        </span>
      ),
      children: (
        <ActivityLogs 
          logs={adminLogs} 
          isLoading={isAdminLogsLoading} 
        />
      ),
    },
    {
      key: "security",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:shield" className="h-4 w-4" />
          {t("profile.security")}
        </span>
      ),
      children: <SecurityTab />,
    },
    {
      key: "preferences",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:settings" className="h-4 w-4" />
          {t("profile.preferences")}
        </span>
      ),
      children: (
        <PreferencesTab
          setSystemSettings={setSystemSettings}
          systemSettings={systemSettings}
        />
      ),
    },
  ];

  return (
    <div className="bg-card text-card-foreground px-6 pb-6 flex flex-col gap-6 rounded-xl border shadow-sm">
      <div>
        <div className="flex pt-4 items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon icon="lucide:user" className="h-7 w-7 text-primary" />
              {t("profile.title")}
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              {t("profile.description")}
            </p>
          </div>
        </div>
        <Separator className="my-2" />
        <Tabs
          defaultActiveKey={activeTab}
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          className="mt-6"
        />
      </div>
    </div>
  );
}
