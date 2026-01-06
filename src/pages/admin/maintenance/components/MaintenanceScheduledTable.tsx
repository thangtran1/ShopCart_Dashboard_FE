import { Tag, Checkbox, Tooltip, Button, Popconfirm, Space } from "antd";
import {
  CalendarOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  Maintenance,
  MaintenanceType,
  MaintenanceStatus,
  UpdateMaintenanceDto,
  getTypeConfig,
} from "@/api/services/maintenanceApi";
import MaintenanceModal from "./MaintenanceModal";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import TableAntd from "@/components/common/tables/custom-table-antd";

interface MaintenanceScheduledTableProps {
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
  onStartNow: (id: string) => void;
  onCancel: (id: string) => void;
  onPageChange: (page: number, pageSize?: number) => void;
  onUpdate: (id: string, values: UpdateMaintenanceDto) => Promise<boolean>;
}

export default function MaintenanceScheduledTable({
  maintenances,
  loading,
  selectedMaintenances,
  pagination,
  onSelectMaintenance,
  onSelectAll,
  onDetail,
  onStartNow,
  onCancel,
  onPageChange,
  onUpdate,
}: MaintenanceScheduledTableProps) {
  const [editingMaintenance, setEditingMaintenance] =
    useState<Maintenance | null>(null);
  const { t } = useTranslation();
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
      dataIndex: "select",
      key: "select",
      width: 50,
      render: (_: any, record: Maintenance) => (
        <Checkbox
          checked={selectedMaintenances.includes(record._id)}
          onChange={(e) => onSelectMaintenance(record._id, e.target.checked)}
        />
      ),
    },
    {
      title: t("maintenance.title"),
      dataIndex: "title",
      key: "title",
      width: 350,
      render: (_: any, record: Maintenance) => (
        <div>
          <div className="font-medium text-foreground">{record.title}</div>
          {record.description && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("maintenance.type"),
      dataIndex: "type",
      key: "type",
      render: (type: MaintenanceType) => (
        <Tag color={getTypeConfig(type).color}>
          {t(`maintenance.type-${type}`)}
        </Tag>
      ),
    },
    {
      title: t("maintenance.scheduled-time"),
      dataIndex: "startTime",
      key: "startTime",
      width: 200,
      render: (startTime: string, record: Maintenance) => (
        <Tooltip
          title={`${new Date(startTime).toLocaleString("vi-VN")} - ${new Date(
            record.endTime
          ).toLocaleString("vi-VN")}`}
        >
          <div className="flex items-center gap-2 text-sm">
            <CalendarOutlined className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div>{new Date(startTime).toLocaleDateString("vi-VN")}</div>
              <div>
                {new Date(startTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: t("maintenance.duration"),
      key: "duration",
      render: (_: any, record: Maintenance) => {
        const duration =
          record.duration ||
          (new Date(record.endTime).getTime() -
            new Date(record.startTime).getTime()) /
            (1000 * 60);
        return (
          <div className="text-sm">
            {duration > 60
              ? `${Math.round(duration / 60)}h`
              : `${Math.round(duration)}m`}
          </div>
        );
      },
    },
    {
      title: t("maintenance.created-at"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => (
        <Tooltip title={new Date(createdAt).toLocaleString("vi-VN")}>
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </div>
        </Tooltip>
      ),
    },
    {
      title: t("maintenance.actions"),
      key: "actions",
      width: 150,
      align: "center",
      render: (_: any, record: Maintenance) => (
        <Space>
          <Tooltip title={t("maintenance.detail")}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onDetail(record)}
              className="text-blue-600 hover:bg-blue-50"
            />
          </Tooltip>

          {record.status === MaintenanceStatus.SCHEDULED && (
            <Tooltip title={t("maintenance.edit")}>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => setEditingMaintenance(record)}
                className="text-yellow-600 hover:bg-yellow-50"
              />
            </Tooltip>
          )}

          <Tooltip title={t("maintenance.start-now")}>
            <Popconfirm
              title={t("maintenance.confirm-start")}
              description={t("maintenance.confirm-start-description")}
              onConfirm={() => onStartNow(record._id)}
              okText={t("maintenance.start")}
              cancelText={t("maintenance.cancel-action")}
            >
              <Button
                type="text"
                size="small"
                icon={<PlayCircleOutlined />}
                className="text-green-600 hover:bg-green-50"
              />
            </Popconfirm>
          </Tooltip>

          <Tooltip title={t("maintenance.cancel-maintenance")}>
            <Popconfirm
              title={t("maintenance.confirm-cancel")}
              description={t("maintenance.confirm-cancel-description")}
              onConfirm={() => onCancel(record._id)}
              okText={t("maintenance.confirm")}
              cancelText={t("maintenance.cancel-action")}
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                size="small"
                icon={<CloseCircleOutlined />}
                className="text-orange-600 hover:bg-orange-50"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <TableAntd
        columns={columns}
        data={maintenances}
        loading={loading}
        pagination={pagination}
        onPageChange={onPageChange}
      />

      <MaintenanceModal
        isOpen={!!editingMaintenance}
        maintenance={editingMaintenance}
        onClose={() => setEditingMaintenance(null)}
        onUpdate={onUpdate}
      />
    </div>
  );
}
