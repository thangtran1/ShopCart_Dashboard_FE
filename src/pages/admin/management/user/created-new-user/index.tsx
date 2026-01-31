import { Typography, Breadcrumb } from "antd";
import { Icon } from "@/components/icon";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Separator } from "@/ui/separator";

import CreateMethodSelector, {
  CreateMethod,
} from "./components/CreateMethodSelector";
import SingleCreateForm from "./components/SingleCreateForm";
import BulkCreateForm from "./components/BulkCreateForm";

const { Title } = Typography;

export default function CreatedNewUser() {
  const { t } = useTranslation();
  const [createMethod, setCreateMethod] = useState<CreateMethod>("single");

  return (
    <div className="bg-card text-card-foreground p-4 rounded-xl border shadow-sm">
      <Breadcrumb style={{ marginBottom: "8px" }}>
        <Breadcrumb.Item>
          <Link to="/admin/management/user">{t("management.user.title")}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {t("management.user.create-new-user")}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3}>
        <Icon icon="lucide:user-plus" className="h-6 w-6 text-primary mr-2" />
        {t("management.user.create-new-user")}
      </Title>

      <Separator className="my-4" />

      <CreateMethodSelector value={createMethod} onChange={setCreateMethod} />

      {createMethod === "single" ? <SingleCreateForm /> : <BulkCreateForm />}
    </div>
  );
}
