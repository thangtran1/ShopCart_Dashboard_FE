import { Card, Alert, Button, Divider } from "antd";
import { Icon } from "@/components/icon";
import { PreviewUser } from "@/types/entity";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import TableAntd from "@/components/common/tables/custom-table-antd";

interface PreviewCardProps {
  users: PreviewUser[];
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function PreviewCard({
  users,
  onConfirm,
  onBack,
  loading,
}: PreviewCardProps) {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: users.length,
  });
  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({ ...pagination, page, limit: pageSize || pagination.limit });
  };
  const { t } = useTranslation();
  const validUsers = users.filter((user) => user.isValid);
  const invalidUsers = users.filter((user) => !user.isValid);
  const canProceed = invalidUsers.length === 0;

  const columns = [
    {
      title: t("management.user.row"),
      dataIndex: "row",
      width: 80,
      key: "row",
      render: (row: number) => (
        <span className="font-mono text-xs text-foreground px-2 py-1 rounded">
          {row}
        </span>
      ),
    },
    {
      title: t("management.user.name"),
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <span className="font-mono text-sm">{email}</span>
      ),
    },
    {
      title: t("management.user.role"),
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${role === "admin"
              ? "bg-red-100 text-red-800"
              : role === "moderator"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
        >
          {role}
        </span>
      ),
    },
    {
      title: t("management.user.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${status === "active"
              ? "bg-green-100 text-green-800"
              : status === "inactive"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: t("management.user.result"),
      key: "validation",
      render: (record: PreviewUser) =>
        record.isValid ? (
          <div className="flex items-center gap-1 text-green-600">
            <Icon icon="lucide:check-circle" className="h-4 w-4" />
            <span className="text-xs font-medium">
              {t("management.user.valid")}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-error">
            <Icon icon="lucide:x-circle" className="h-4 w-4" />
            <span className="text-xs font-medium">
              {t("management.user.error")}
            </span>
          </div>
        ),
    },
    {
      title: t("management.user.error-details"),
      dataIndex: "error",
      key: "error",
      render: (error: string) =>
        error ? (
          <span className="text-red-600 text-xs">{error}</span>
        ) : (
          <span className="text-green-600 text-xs">✓</span>
        ),
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("management.user.preview-data")}
        </h2>
        <p className="text-muted-foreground">
          {t("management.user.check-data-before-creating-users")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
              <Icon icon="lucide:users" className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-800">
                {users.length}
              </div>
              <div className="text-sm text-blue-600">
                {t("management.user.total-users-description")}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`border rounded-lg p-4 ${canProceed
              ? "bg-green-50 border-green-200"
              : "bg-gray-50 border-gray-200"
            }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${canProceed ? "bg-success" : "bg-muted-foreground"
                }`}
            >
              <Icon
                icon="lucide:check-circle"
                className="h-5 w-5 text-background"
              />
            </div>
            <div>
              <div
                className={`text-2xl font-bold ${canProceed ? "text-green-800" : "text-gray-700"
                  }`}
              >
                {validUsers.length}
              </div>
              <div
                className={`text-sm ${canProceed ? "text-green-600" : "text-gray-500"
                  }`}
              >
                {t("management.user.valid")}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`border rounded-lg p-4 ${invalidUsers.length > 0
              ? "bg-red-50 border-red-200"
              : "bg-gray-50 border-gray-200"
            }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${invalidUsers.length > 0 ? "bg-error" : "bg-muted-foreground"
                }`}
            >
              <Icon
                icon="lucide:x-circle"
                className="h-5 w-5 text-background"
              />
            </div>
            <div>
              <div
                className={`text-2xl font-bold ${invalidUsers.length > 0 ? "text-red-800" : "text-gray-700"
                  }`}
              >
                {invalidUsers.length}
              </div>
              <div
                className={`text-sm ${invalidUsers.length > 0 ? "text-red-600" : "text-gray-500"
                  }`}
              >
                {t("management.user.error")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {canProceed ? (
        <Alert
          message={t("management.user.all-data-valid")}
          description={t("management.user.can-continue-to-create-all-users")}
          type="success"
          showIcon
          className="mb-6"
        />
      ) : (
        <Alert
          message={t("management.user.error-title")}
          description={`${invalidUsers.length} ${t(
            "management.user.error-description"
          )}`}
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      <Divider />

      <div className="mb-6">
        <TableAntd
          columns={columns}
          data={users}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          scroll={{ x: 800, y: 500 }}
        />
      </div>

      <div className="flex gap-4 justify-center pt-4">
        <Button size="large" onClick={onBack} className="min-w-[140px]">
          <Icon icon="lucide:refresh-cw" className="h-5 w-5" />
          {t("management.user.reload-file")}
        </Button>
        <Button
          type="primary"
          size="large"
          loading={loading}
          disabled={!canProceed}
          onClick={onConfirm}
          className="min-w-[140px]"
        >
          {!canProceed
            ? `${t("management.user.cannot-create")} (${invalidUsers.length
            } ${t("management.user.error")})`
            : `${t("management.user.creates")} ${users.length} ${t(
              "management.user.users"
            )}`}
        </Button>
      </div>
    </Card>
  );
}
