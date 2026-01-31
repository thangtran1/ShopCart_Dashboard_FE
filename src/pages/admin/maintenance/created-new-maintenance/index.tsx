import { Typography, Breadcrumb } from "antd";
import { Icon } from "@/components/icon";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Separator } from "@/ui/separator";

import SingleCreateForm from "./components/createdFormMaintenace";

const { Title } = Typography;

export default function CreatedNewMaintenance() {
  const { t } = useTranslation();

  return (
    <div className="bg-card text-card-foreground p-4 rounded-xl border shadow-sm">
      <Breadcrumb style={{ marginBottom: "8px" }}>
        <Breadcrumb.Item>
          <Link to="/admin/maintenance">{t("maintenance.title")}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {t("maintenance.add-maintenance")}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3}>
        <Icon icon="lucide:wrench" className="h-6 w-6 text-primary mr-2" />
        {t("maintenance.add-maintenance")}
      </Title>

      <Separator className="my-4" />

      <SingleCreateForm />
    </div>
  );
}
