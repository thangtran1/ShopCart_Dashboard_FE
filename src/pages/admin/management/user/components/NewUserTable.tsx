import {
  Tag,
  Avatar,
  Checkbox,
  Tooltip,
  Button,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  getRoleColor,
  getStatusColor,
  User,
} from "@/api/services/userManagementApi";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import TableAntd from "@/components/common/tables/custom-table-antd";

interface NewUserTableProps {
  users: User[];
  loading: boolean;
  selectedUsers: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onSelectUser: (userId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDelete: (ids: string | string[]) => void;
  onPageChange: (page: number, pageSize?: number) => void;
}

export default function NewUserTable({
  users,
  loading,
  selectedUsers,
  pagination,
  onSelectUser,
  onSelectAll,
  onDelete,
  onPageChange,
}: NewUserTableProps) {
  const { t } = useTranslation();
  const columns = [
    {
      title: (
        <Checkbox
          checked={selectedUsers.length === users.length && users.length > 0}
          indeterminate={
            selectedUsers.length > 0 && selectedUsers.length < users.length
          }
          onChange={(e) => onSelectAll(e.target.checked)}
        />
      ),
      key: "select",
      width: 50,
      render: (_: React.ReactNode, user: User) => (
        <Checkbox
          checked={selectedUsers.includes(user.id)}
          onChange={(e) => onSelectUser(user.id, e.target.checked)}
        />
      ),
    },
    {
      title: t("management.user.user-info"),
      key: "user",
      render: (_: React.ReactNode, user: User) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            src={user.avatar}
            icon={<UserOutlined />}
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-foreground truncate">
              {user.name}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("management.user.role"),
      key: "role",
      render: (_: React.ReactNode, user: User) => (
        <Tag color={getRoleColor(user.role)}>
          {t(`management.user.${user.role}`)}
        </Tag>
      ),
    },
    {
      title: t("management.user.status"),
      key: "status",
      render: (_: React.ReactNode, user: User) => (
        <Tag color={getStatusColor(user.status || "active")}>
          {t(`management.user.${user.status || "active"}`)}
        </Tag>
      ),
    },
    {
      title: t("management.user.created-at"),
      key: "createdAt",
      render: (_: React.ReactNode, user: User) => (
        <Tooltip title={new Date(user.createdAt).toLocaleString("vi-VN")}>
          <div className="flex items-center gap-1 text-sm">
            <CalendarOutlined className="text-muted-foreground" />
            {formatDistanceToNow(new Date(user.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </div>
        </Tooltip>
      ),
    },
    {
      title: t("management.user.email-verified"),
      key: "isEmailVerified",
      render: (_: React.ReactNode, user: User) => (
        <Tag color={user.isEmailVerified ? "green" : "orange"}>
          {user.isEmailVerified
            ? t("management.user.verified")
            : t("management.user.not-verified")}
        </Tag>
      ),
    },
    {
      title: t("management.user.actions"),
      key: "actions",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_: React.ReactNode, user: User) => (
        <Popconfirm
          title={t("management.user.confirm-delete")}
          description={t("management.user.confirm-delete-single-description")}
          onConfirm={() => onDelete(user.id)}
          okText={t("management.user.delete")}
          cancelText={t("management.user.cancel")}
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            title={t("management.user.delete")}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <TableAntd
      columns={columns}
      data={users}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
    />
  );
}
