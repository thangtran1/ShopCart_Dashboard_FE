import { Card, Button, Table, Divider } from "antd";
import { Icon } from "@/components/icon";
import { useTranslation } from "react-i18next";

interface ResultCardProps {
  result: {
    successCount: number;
    errorCount: number;
    errors: Array<{ row: number; email: string; error: string }>;
  };
  onReset: () => void;
  onBackToManagement?: () => void;
}

export default function ResultCard({
  result,
  onReset,
  onBackToManagement,
}: ResultCardProps) {
  const { t } = useTranslation();
  const isSuccess = result.errorCount === 0 && result.successCount > 0;

  const errorColumns = [
    {
      title: t("management.user.row"),
      dataIndex: "row",
      key: "row",
      width: 80,
      render: (row: number) => (
        <span className="font-mono text-sm text-foreground px-2 py-1 rounded">
          {row}
        </span>
      ),
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
      title: t("management.user.error"),
      dataIndex: "error",
      key: "error",
      render: (error: string) => (
        <span className="text-error text-sm">{error}</span>
      ),
    },
  ];

  return (
    <div>
      {isSuccess && (
        <Card className="border-0 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-success mb-2">
              <Icon icon="lucide:check-circle" className="h-5 w-5 mr-2" />
              {t("management.user.create-success-title")}
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {t("management.user.success-created")}{" "}
              <span className="font-bold text-success">
                {result.successCount}
              </span>{" "}
              {t("management.user.users")}
            </p>

            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {result.successCount}
                  </div>
                  <div className="text-sm text-green-700">
                    {t("management.user.users-created")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-blue-700">
                    {t("management.user.success-rate")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">0</div>
                  <div className="text-sm text-gray-700">
                    {t("management.user.error-count")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                size="large"
                color="primary"
                variant="outlined"
                onClick={onReset}
              >
                {t("management.user.create-new-bulk")}
              </Button>
              {onBackToManagement && (
                <Button
                  size="large"
                  onClick={onBackToManagement}
                >
                  {t("management.user.back-to-management")}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {!isSuccess && (
        <Card className="border-0 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              <Icon icon="lucide:x-circle" className="h-5 w-5 mr-2" />
              {t("management.user.cannot-create-users")}
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {t("management.user.has")}{" "}
              <span className="font-bold text-red-600">
                {result.errorCount}
              </span>{" "}
              {t("management.user.errors-to-fix")}
            </p>

            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {result.errorCount}
                  </div>
                  <div className="text-sm text-red-700">
                    {t("management.user.errors-to-fix")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">0</div>
                  <div className="text-sm text-gray-700">
                    {t("management.user.users-created")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {Math.round(
                      (result.errorCount /
                        (result.successCount + result.errorCount)) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-orange-700">
                    {t("management.user.error-rate")}
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div className="text-left">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon
                  icon="lucide:alert-triangle"
                  className="h-5 w-5 text-orange-600"
                />
                {t("management.user.error-details")}
              </h3>
              <Table
                columns={errorColumns}
                dataSource={result.errors}
                rowKey={(record) => `${record.row}-${record.email}`}
                pagination={{ pageSize: 10 }}
                size="small"
                className="mb-6"
              />
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                color="primary"
                variant="outlined"
                size="large"
                onClick={onReset}
                className="min-w-[140px]"
              >
                <Icon icon="lucide:edit" className="h-5 w-5" />
                {t("management.user.edit-file-and-try-again")}
              </Button>
              {onBackToManagement && (
                <Button
                  size="large"
                  onClick={onBackToManagement}
                  className="min-w-[140px]"
                >
                  <Icon icon="lucide:arrow-left" className="h-5 w-5" />
                  {t("management.user.back-to-management")}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
