import React, { useState, useEffect } from "react";
import { Button, Space, Popconfirm, Tag } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Separator } from "@/ui/separator";
import TableAntd from "@/components/common/tables/custom-table-antd";
import FilterSearch from "./components/filter-search";
import { Feedback, feedbackService } from "@/api/services/feedback";
import { useAdminFeedbacks } from "@/hooks/useAdminFeedbacks";
import FeedbackDetailModal from "./components/detail-feedback";

const FeedbackManagement: React.FC = () => {
  const {
    feedbacks,
    loading,
    pagination,
    searchOptions,
    handleFilterChange,
    clearFilters,
    onPageChange,
    refresh,
  } = useAdminFeedbacks();

  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );

  // Modal state for detail view
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    feedback: Feedback | null;
    loading: boolean;
  }>({
    open: false,
    feedback: null,
    loading: false,
  });

  // Sync local state with searchOptions from hook
  useEffect(() => {
    setSearchText(searchOptions.search || "");
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
    const searchParams: {
      search?: string;
      startDate?: string;
      endDate?: string;
    } = {};

    if (searchText.trim()) {
      searchParams.search = searchText.trim();
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      searchParams.startDate = dateRange[0].format("YYYY-MM-DD");
      searchParams.endDate = dateRange[1].format("YYYY-MM-DD");
    }

    handleFilterChange(searchParams);
  };

  const handleClearFilter = () => {
    setSearchText("");
    setDateRange(null);
    clearFilters();
  };

  const handleDelete = async (id: string) => {
    try {
      await feedbackService.delete(id);
      toast.success(t("feedback.delete-feedback-success"));
      refresh();
    } catch {
      toast.error(t("feedback.delete-feedback-error"));
    }
  };

  const handleViewDetail = async (record: Feedback) => {
    setDetailModal({ open: true, feedback: null, loading: true });
    try {
      const data = await feedbackService.getById(record._id);
      setDetailModal({ open: true, feedback: data, loading: false });
    } catch {
      toast.error("Không thể tải chi tiết feedback");
      setDetailModal({ open: false, feedback: null, loading: false });
    }
  };


  const renderWithTooltip = (text?: string, maxWidth = 160) =>
    text ? (
      <Tooltip placement="topLeft" title={text}>
        <span
          className="truncate block"
          style={{ maxWidth: `${maxWidth}px` }}
        >
          {text}
        </span>
      </Tooltip>
    ) : (
      <span className="text-gray-400">-</span>
    );

  const columns = [
    {
      title: (
        <span className="flex items-center gap-1">
          <MessageOutlined className="text-blue-500" />
          {t("feedback.title")}
        </span>
      ),
      dataIndex: "title",
      key: "title",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <span className="font-medium text-foreground">{renderWithTooltip(text, 160)}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-1">
          <UserOutlined className="text-green-500" />
          {t("feedback.name")}
        </span>
      ),
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tag color="blue" className="font-medium">
          {text || "-"}
        </Tag>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-1">
          <PhoneOutlined className="text-orange-500" />
          {t("feedback.phone")}
        </span>
      ),
      dataIndex: "phone",
      key: "phone",
      width: 130,
      render: (text: string) => (
        <a href={`tel:${text}`} className="text-blue-600 hover:underline">
          {text || "-"}
        </a>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-1">
          <MailOutlined className="text-purple-500" />
          {t("feedback.email")}
        </span>
      ),
      dataIndex: "email",
      key: "email",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <a href={`mailto:${text}`} className="text-blue-600 hover:underline">
          {renderWithTooltip(text, 160)}
        </a>
      ),
    },
    {
      title: t("feedback.content"),
      dataIndex: "content",
      key: "content",
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <span className="text-muted-foreground">{renderWithTooltip(text, 180)}</span>
      ),
    },
    {
      title: t("feedback.created-at"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => (
        <div className="flex flex-col">
          <span className="text--foreground -800 font-medium">
            {dayjs(date).format("DD/MM/YYYY")}
          </span>
          <span className="text-muted-foreground text-xs">
            {dayjs(date).format("HH:mm:ss")}
          </span>
        </div>
      ),
    },
    {
      title: t("feedback.actions"),
      key: "actions",
      width: 100,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: unknown, record: Feedback) => {
        return (
          <Space size="small">
            {/* Nút Xem chi tiết */}
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={(e) => { // Sửa: Thêm tham số sự kiện 'e'
                  e.stopPropagation(); // QUAN TRỌNG: Ngăn chặn sự kiện nổi bọt lên hàng (row)
                  handleViewDetail(record);
                }}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              />
            </Tooltip>

            {/* Popconfirm cho nút Xóa */}
            <Popconfirm
              title={t("feedback.delete-feedback")}
              description="Bạn có chắc chắn muốn xóa feedback này?"
              onConfirm={(e) => {
                e?.stopPropagation(); // Ngăn chặn sự kiện nổi bọt khi xác nhận xóa
                handleDelete(record._id);
              }}
              okText={t("feedback.confirm")}
              cancelText={t("feedback.cancel")}
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()} // QUAN TRỌNG: Ngăn chặn sự kiện nổi bọt khi nhấn nút Xóa
                  className="hover:bg-red-50"
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="bg-card text-card-foreground px-6 flex flex-col gap-6 rounded-xl border shadow-sm">
      {/* Header */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              🔔 {t("feedback.management")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("feedback.management-description")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary px-4 py-2 rounded-lg">
              <span className="text-foreground font-semibold text-lg">
                {pagination.total}
              </span>
              <span className="text-foreground ml-2 text-sm">
                {t("feedback.total-feedback")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="pb-6">
        <FilterSearch
          searchText={searchText}
          setSearchText={setSearchText}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleSearchClick={handleSearchClick}
          handleClearFilter={handleClearFilter}
        />

        <div className="mt-4">
          <TableAntd
            columns={columns}
            data={feedbacks}
            loading={loading}
            pagination={pagination}
            onPageChange={onPageChange}
            onRowClick={(record) => handleViewDetail(record)} // click row mở modal
          />

        </div>
      </div>

      <FeedbackDetailModal
        open={detailModal.open}
        feedback={detailModal.feedback}
        loading={detailModal.loading}
        onClose={() => setDetailModal({ open: false, feedback: null, loading: false })}
      />
    </div>
  );
};

export default FeedbackManagement;
