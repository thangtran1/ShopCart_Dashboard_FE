import { Tabs, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { Icon } from "@/components/icon";
import { useTranslation } from "react-i18next";
import { useUserTabs } from "./hooks/useUserTabs";
import ActiveUsersTab from "./components/ActiveUsersTab";
import DeletedUsersTab from "./components/DeletedUsersTab";
import NewUsersTab from "./components/NewUsersTab";
import { Link } from "react-router";

export default function UserManagement() {
  const { t } = useTranslation();
  const { activeTab, handleTabChange } = useUserTabs();

  const tabItems = [
    {
      key: "active",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:users" className="h-4 w-4" />
          {t("management.user.active-users-tab")}
        </span>
      ),
      children: <ActiveUsersTab />,
    },
    {
      key: "new",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:user-plus" className="h-4 w-4" />
          {t("management.user.new-users-tab")}
        </span>
      ),
      children: <NewUsersTab />,
    },
    {
      key: "deleted",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:trash-2" className="h-4 w-4" />
          {t("management.user.deleted-users-tab")}
        </span>
      ),
      children: <DeletedUsersTab />,
    },
  ];

  return (
    <div className="bg-card text-card-foreground px-6 flex flex-col gap-6 rounded-xl border shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon icon="lucide:users" className="h-7 w-7 text-primary" />
              {t("management.user.title")}
            </CardTitle>

            <p className="text-muted-foreground mt-1">
              {t("management.user.description")}
            </p>
          </div>

          <div className="flex gap-3 md:flex-shrink-0">
            <Link
              to="/admin/management/user/created-new-user"
              className="w-full md:w-auto"
            >
              <Button
                type="primary"
                size="large"
                icon={<PlusCircleOutlined />}
                className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
              >
                {t("management.user.add-user")}
              </Button>
            </Link>
          </div>
        </div>


        <Separator className="my-0" />

        <Tabs
          activeKey={activeTab}
          onChange={(key) =>
            handleTabChange(key as "active" | "deleted" | "new")
          }
          items={tabItems}
          size="large"
        />
      </div>
    </div>
  );
}
