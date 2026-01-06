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
import { UserOutlined, UndoOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import TableAntd from "@/components/common/tables/custom-table-antd";

interface DeletedUserTableProps {
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
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number, pageSize?: number) => void;
}

export default function DeletedUserTable({
  users,
  loading,
  selectedUsers,
  pagination,
  onSelectUser,
  onSelectAll,
  onRestore,
  onDelete,
  onPageChange,
}: DeletedUserTableProps) {
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
          <Avatar src={user.avatar} icon={<UserOutlined />} size={40} />
          <div>
            <div className="font-semibold text-foreground flex items-center gap-2">
              {user.name}
              <Tag color="default" className="text-xs">
                {t("management.user.deleted")}
              </Tag>
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
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
      title: t("management.user.info"),
      key: "info",
      render: (_: React.ReactNode, user: User) => (
        <div className="text-sm text-muted-foreground">
          {user.phone && <div>📞 {user.phone}</div>}
          <div>📅 {new Date(user.createdAt).toLocaleDateString("vi-VN")}</div>
        </div>
      ),
    },
    {
      title: t("management.user.actions"),
      key: "actions",
      width: 120,
      render: (_: React.ReactNode, user: User) => (
        <Space>
          <Popconfirm
            title={t("management.user.confirm-restore")}
            description={t("management.user.confirm-restore-description")}
            onConfirm={() => onRestore(user.id)}
            okText={t("management.user.restore")}
            cancelText={t("management.user.cancel")}
          >
            <Tooltip title={t("management.user.restore")}>
              <Button
                type="text"
                size="middle"
                icon={<UndoOutlined />}
                className="text-green-600 hover:bg-green-50"
              />
            </Tooltip>
          </Popconfirm>

          <Popconfirm
            title={t("management.user.confirm-permanent-delete")}
            description={t(
              "management.user.confirm-permanent-delete-description"
            )}
            onConfirm={() => onDelete(user.id)}
            okText={t("management.user.delete")}
            cancelText={t("management.user.cancel")}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t("management.user.permanent-delete")}>
              <Button
                type="text"
                size="middle"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
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
