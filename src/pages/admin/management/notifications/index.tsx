import React, { useState, useEffect } from "react";
import { Button, Space, Popconfirm, Tag } from "antd";
import {
  PlusCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { Link } from "react-router";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Separator } from "@/ui/separator";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { Notification } from "@/types/entity";
import TableAntd from "@/components/common/tables/custom-table-antd";
import FilterSearch from "./components/filter-search";
import EditModal from "./components/edit-modal";

const NotificationManagement: React.FC = () => {
  const {
    notifications,
    loading,
    pagination,
    searchOptions,
    loadNotifications,
    updateNotification,
    deleteNotification,
    handleFilterChange,
    clearFilters,
    onPageChange,
  } = useAdminNotifications();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);

  // Sync local state with searchOptions from hook
  useEffect(() => {
    setSearchText(searchOptions.search || "");
    setSelectedType(searchOptions.type || "");
    if (searchOptions.startDate && searchOptions.endDate) {
      setDateRange([
        dayjs(searchOptions.startDate),
        dayjs(searchOptions.endDate),
      ]);
    } else {
      setDateRange(null);
    }
  }, [searchOptions]);

  const handleSearchClick = () => {
    const searchParams: any = {};

    if (searchText.trim()) {
      searchParams.search = searchText.trim();
    }

    if (selectedType) {
      searchParams.type = selectedType;
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      searchParams.startDate = dateRange[0].format("YYYY-MM-DD");
      searchParams.endDate = dateRange[1].format("YYYY-MM-DD");
    }

    handleFilterChange(searchParams);
  };

  const handleClearFilter = () => {
    setSearchText("");
    setSelectedType("");
    setDateRange(null);
    clearFilters();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      toast.success(t("notification.delete-notification-success"));
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (record: Notification) => {
    setEditingNotification(record);
    setEditModalVisible(true);
  };

  const handleEditModalSubmit = async (values: any) => {
    try {
      if (editingNotification) {
        await updateNotification(editingNotification._id, values);
        await loadNotifications();
      }

      setEditModalVisible(false);
      setEditingNotification(null);

      toast.success(t("notification.update-notification-success"));
    } catch (error) {
      throw error;
    }
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
    setEditingNotification(null);
  };

  const renderWithTooltip = (text?: string) =>
    text ? (
      <Tooltip placement="topLeft" title={text}>
        <span className="truncate block max-w-[140px]">{text}</span>
      </Tooltip>
    ) : (
      "-"
    );

  const columns = [
    {
      title: t("notification.title"),
      dataIndex: "title",
      key: "title",
      width: 250,
      ellipsis: true,
      render: (text: string) => renderWithTooltip(text),
    },
    {
      title: t("notification.content"),
      dataIndex: "content",
      key: "content",
      width: 350,
      ellipsis: true,
      render: (text: string) => renderWithTooltip(text),
    },
    {
      title: t("notification.image-video"),
      dataIndex: "actionUrl",
      key: "actionUrl",
      width: 150,
      ellipsis: true,
      render: (url: string) => {
        if (!url) return null;

        return (
          <img
            src={url}
            alt="preview"
            style={{
              width: "100px",
              maxHeight: "100px",
              objectFit: "contain",
              borderRadius: 4,
            }}
          />
        );
      },
    },

    {
      title: t("notification.type"),
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (type: string) => (
        <Tag color={type === "system" ? "blue" : "green"}>
          {type === "system"
            ? t("notification.system")
            : type === "news"
              ? t("notification.news")
              : t("notification.maintenance")}
        </Tag>
      ),
    },
    {
      title: t("notification.read-by-users"),
      dataIndex: "readByUsers",
      key: "readByUsers",
      width: 140,
      render: (readByUsers?: string[]) => readByUsers?.length || 0,
    },
    {
      title: t("notification.created-at"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (date: string) =>
        renderWithTooltip(dayjs(date).format("DD/MM/YYYY HH:mm")),
    },
    {
      title: t("notification.actions"),
      key: "actions",
      align: "center",
      fixed: "right",
      width: 120,
      render: (record: Notification) => {
        return (
          <Space>
            <Link to={`/admin/management/notifications/${record._id}`}>
              <Button type="text" icon={<EyeOutlined />} />
            </Link>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title={t("notification.delete-notification")}
              onConfirm={() => handleDelete(record._id)}
              okText={t("notification.delete-notification")}
              cancelText={t("notification.cancel")}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="bg-card text-card-foreground px-4 flex flex-col gap-6 rounded-xl border shadow-sm">
      {/* Header */}
      <div className="pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              🔔 {t("notification.management")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("notification.management-description")}
            </p>
          </div>

          <Link to="/admin/management/notifications/new-notification" className="mt-3 md:mt-0">
            <Button
              type="primary"
              size="large"
              icon={<PlusCircleOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t("notification.new-notification")}
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      <div className="pb-2">
        <FilterSearch
          searchText={searchText}
          setSearchText={setSearchText}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          handleSearchClick={handleSearchClick}
          handleClearFilter={handleClearFilter}
        />

        <Separator />

        <div className="overflow-x-auto">
          <TableAntd
            columns={columns}
            data={notifications}
            loading={loading}
            pagination={pagination}
            onPageChange={onPageChange}
          />
        </div>

        <EditModal
          isOpen={editModalVisible}
          onClose={handleEditModalCancel}
          onUpdate={handleEditModalSubmit}
          notification={editingNotification}
        />
      </div>
    </div>
  );
};

export default NotificationManagement;
