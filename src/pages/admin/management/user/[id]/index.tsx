import { Breadcrumb } from "antd";
import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import UserDetailTabs from "./tabs";

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const { t } = useTranslation();
  return (
    <div className="bg-card text-card-foreground p-4 rounded-xl border shadow-sm">
      <Breadcrumb style={{ marginBottom: "8px" }}>
        <Breadcrumb.Item>
          <Link to="/admin/management/user">{t("management.user.title")}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {t("management.user.user-detail.title")}
        </Breadcrumb.Item>
      </Breadcrumb>

      <UserDetailTabs userId={userId ?? ""} />
    </div>
  );
}
