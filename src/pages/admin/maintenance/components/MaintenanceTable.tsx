import { Checkbox, Tag, Space, Button, Tooltip, Popconfirm, Badge } from "antd";
import {
  DeleteOutlined,
  PlayCircleOutlined,
  StopOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  getStatusConfig,
  getTypeConfig,
  Maintenance,
  MaintenanceStatus,
  UpdateMaintenanceDto,
} from "@/api/services/maintenanceApi";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Icon } from "@/components/icon";
import { useState } from "react";
import MaintenanceModal from "./MaintenanceModal";
import TableAntd from "@/components/common/tables/custom-table-antd";

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  loading: boolean;
  selectedMaintenances: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onSelectMaintenance: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDetail: (maintenance: Maintenance) => void;
  onDelete: (id: string) => void;
  onStartNow: (id: string) => void;
  onStop: (id: string) => void;
  onCancel: (id: string) => void;
  onPageChange: (page: number, pageSize?: number) => void;
  onUpdate: (id: string, values: UpdateMaintenanceDto) => Promise<boolean>;
}

export default function MaintenanceTable({
  maintenances,
  loading,
  selectedMaintenances,
  pagination,
  onSelectMaintenance,
  onSelectAll,
  onDetail,
  onDelete,
  onStartNow,
  onStop,
  onCancel,
  onPageChange,
  onUpdate,
}: MaintenanceTableProps) {
  const [editingMaintenance, setEditingMaintenance] =
    useState<Maintenance | null>(null);
  const { t } = useTranslation();

  const renderActions = (maintenance: Maintenance) => {
    const { status, _id } = maintenance;

    return (
      <Space size="small">
        <Tooltip title={t("maintenance.detail")}>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onDetail(maintenance)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          />
        </Tooltip>

        {status === MaintenanceStatus.SCHEDULED && (
          <>
            <Tooltip title={t("maintenance.start-now")}>
              <Popconfirm
                title={t("maintenance.confirm-start")}
                description={t("maintenance.confirm-start-description")}
                onConfirm={() => onStartNow(_id)}
                okText={t("maintenance.start")}
                cancelText={t("maintenance.cancel-action")}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<PlayCircleOutlined />}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                />
              </Popconfirm>
            </Tooltip>

            <Tooltip title={t("maintenance.cancel-maintenance")}>
              <Popconfirm
                title={t("maintenance.confirm-cancel")}
                description={t("maintenance.confirm-cancel-description")}
                onConfirm={() => onCancel(_id)}
                okText={t("maintenance.confirm")}
                cancelText={t("maintenance.cancel-action")}
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<CloseCircleOutlined />}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                />
              </Popconfirm>
            </Tooltip>

            <Tooltip title={t("maintenance.edit")}>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => setEditingMaintenance(maintenance)}
                className="text-yellow-600 hover:bg-yellow-50"
              />
            </Tooltip>
          </>
        )}

        {status === MaintenanceStatus.IN_PROGRESS && (
          <>
            <Tooltip title={t("maintenance.stop")}>
              <Popconfirm
                title={t("maintenance.confirm-stop")}
                description={t("maintenance.confirm-stop-description")}
                onConfirm={() => onStop(_id)}
                okText={t("maintenance.stop")}
                cancelText={t("maintenance.cancel-action")}
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<StopOutlined />}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                />
              </Popconfirm>
            </Tooltip>
          </>
        )}

        {(status === MaintenanceStatus.COMPLETED ||
          status === MaintenanceStatus.CANCELLED) && (
          <Popconfirm
            title={t("maintenance.confirm-delete")}
            description={t("maintenance.confirm-delete-description")}
            onConfirm={() => onDelete(_id)}
            okText={t("maintenance.delete")}
            cancelText={t("maintenance.cancel-action")}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t("maintenance.delete")}>
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        )}
      </Space>
    );
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={
            selectedMaintenances.length === maintenances.length &&
            maintenances.length > 0
          }
          indeterminate={
            selectedMaintenances.length > 0 &&
            selectedMaintenances.length < maintenances.length
          }
          onChange={(e) => onSelectAll(e.target.checked)}
        />
      ),
      key: "select",
      width: 50,
      render: (_: React.ReactNode, maintenance: Maintenance) => (
        <Checkbox
          checked={selectedMaintenances.includes(maintenance._id)}
          onChange={(e) =>
            onSelectMaintenance(maintenance._id, e.target.checked)
          }
        />
      ),
    },
    {
      title: (
        <span className="font-semibold">
          {t("maintenance.maintenance-info")}
        </span>
      ),
      key: "info",
      width: 350,
      render: (_: React.ReactNode, maintenance: Maintenance) => {
        const statusConfig = getStatusConfig(maintenance.status);
        return (
          <div className="py-2">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-muted border border-border`}>
                <Icon
                  icon={statusConfig.icon}
                  className={`h-5 w-5  ${statusConfig.textClass}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground text-base mb-1 line-clamp-1">
                  {maintenance.title}
                </div>
                {maintenance.description && (
                  <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {maintenance.description}
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {maintenance.isActive && (
                    <Badge
                      status="processing"
                      text={
                        <span className="text-xs font-medium">
                          {t("maintenance.active")}
                        </span>
                      }
                    />
                  )}
                  {maintenance.autoAdjusted && (
                    <Tag color="blue" className="text-xs">
                      <Icon icon="lucide:zap" className="h-3 w-3 inline mr-1" />
                      {t("maintenance.auto-adjusted")}
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: <span className="font-semibold">{t("maintenance.type")}</span>,
      key: "type",
      render: (_: React.ReactNode, maintenance: Maintenance) => {
        const typeConfig = getTypeConfig(maintenance.type);
        return (
          <Tag color={typeConfig.color} className="font-medium">
            <Icon icon={typeConfig.icon} className="h-3 w-3 inline mr-1" />
            {t(`maintenance.type-${maintenance.type}`)}
          </Tag>
        );
      },
    },
    {
      title: <span className="font-semibold">{t("maintenance.status")}</span>,
      key: "status",
      render: (_: React.ReactNode, maintenance: Maintenance) => {
        const statusConfig = getStatusConfig(maintenance.status);
        return (
          <Tag
            color={statusConfig.color}
            className="font-medium text-xs px-3 py-1"
          >
            <Icon icon={statusConfig.icon} className="h-3 w-3 inline mr-1" />
            {t(`maintenance.status-${maintenance.status}`)}
          </Tag>
        );
      },
    },
    {
      title: <span className="font-semibold">{t("maintenance.schedule")}</span>,
      key: "time",
      width: 180,
      render: (_: React.ReactNode, maintenance: Maintenance) => (
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-green-600" />
            <span className="font-medium text-green-700">
              {new Date(maintenance.startTime).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-red-600" />
            <span className="font-medium text-red-700">
              {new Date(maintenance.endTime).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Icon icon="lucide:clock" className="h-3 w-3" />
            {maintenance.duration
              ? `${
                  maintenance.duration > 60
                    ? Math.round(maintenance.duration / 60) + " giờ"
                    : Math.round(maintenance.duration) + " phút"
                }`
              : `${Math.round(
                  (new Date(maintenance.endTime).getTime() -
                    new Date(maintenance.startTime).getTime()) /
                    (1000 * 60)
                )} phút`}
          </div>
        </div>
      ),
    },

    {
      title: (
        <span className="font-semibold">{t("maintenance.created-at")}</span>
      ),
      key: "createdAt",
      render: (_: React.ReactNode, maintenance: Maintenance) => (
        <Tooltip
          title={new Date(maintenance.createdAt).toLocaleString("vi-VN")}
        >
          <div className="text-sm">
            <div className="text-muted-foreground">
              {formatDistanceToNow(new Date(maintenance.createdAt), {
                addSuffix: true,
                locale: vi,
              })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(maintenance.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <span className="font-semibold text-center block">
          {t("maintenance.actions")}
        </span>
      ),
      key: "actions",
      width: 150,
      render: (_: React.ReactNode, maintenance: Maintenance) => (
        <div className="flex justify-center">{renderActions(maintenance)}</div>
      ),
    },
  ];

  return (
    <div>
      <MaintenanceModal
        isOpen={!!editingMaintenance}
        maintenance={editingMaintenance}
        onClose={() => setEditingMaintenance(null)}
        onUpdate={onUpdate}
      />
      <TableAntd
        columns={columns}
        data={maintenances}
        loading={loading}
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
