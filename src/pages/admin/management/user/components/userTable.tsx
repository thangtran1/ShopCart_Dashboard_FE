import {
  Checkbox,
  Avatar,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  Tag,
} from "antd";
import {
  getRoleColor,
  getStatusColor,
  User,
} from "@/api/services/userManagementApi";
import {
  UserOutlined,
  DeleteOutlined,
  CalendarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import TableAntd from "@/components/common/tables/custom-table-antd";

interface UserTableProps {
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
  onDelete: (id: string) => void;
  onPageChange: (page: number, pageSize?: number) => void;
  onView: (userId: string) => void;
}

export default function UserTable({
  users,
  loading,
  selectedUsers,
  pagination,
  onSelectUser,
  onSelectAll,
  onDelete,
  onPageChange,
  onView,
}: UserTableProps) {
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
      width: 250,
      render: (_: React.ReactNode, user: User) => {
        const avatarUrl = user?.avatar
          ? `${import.meta.env.VITE_API_URL}${user.avatar}`
          : undefined;

        return (
          <div className="flex items-center gap-3">
            <Avatar src={avatarUrl} size={40} icon={<UserOutlined />} />

            <div>
              <div className="font-semibold text-foreground">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: t("management.user.role"),
      key: "role",
      render: (_: React.ReactNode, user: User) => (
        <Tag color={getRoleColor(user.role)}>
          {t(`management.user.role-${user.role}`)}
        </Tag>
      ),
    },
    {
      title: t("management.user.status"),
      key: "status",
      render: (_: React.ReactNode, user: User) => (
        <Tag color={getStatusColor(user.status || "active")}>
          {t(`management.user.status-${user.status || "active"}`)}
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
      title: t("management.user.info"),
      key: "info",
      width: 220,
      render: (_: React.ReactNode, user: User) => (
        <div className="text-sm text-foreground">
          {user.phone && (
            <div>
              {t("management.user.phone")}: {user.phone}
            </div>
          )}
          <div>
            {t("management.user.login-count")}: {user.loginCount}
          </div>
        </div>
      ),
    },

    {
      title: t("management.user.actions"),
      key: "actions",
      align: "center",
      width: 150,
      render: (_: React.ReactNode, user: User) => (
        <Space>
          <Popconfirm
            title={t("management.user.confirm-delete")}
            description={t("management.user.confirm-delete-description")}
            onConfirm={() => onDelete(user.id)}
            okText={t("management.user.delete")}
            cancelText={t("management.user.cancel")}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t("management.user.delete")}>
              <Button
                type="text"
                size="middle"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Xem thông tin chi tiết">
            <Button
              type="text"
              size="middle"
              icon={<EyeOutlined />}
              onClick={() => onView(user.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <TableAntd
      hiddenCopy={true}
      columns={columns}
      data={users}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
    />
  );
}
