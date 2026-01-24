"use client";

import { useState, useMemo } from "react";
import { Button, Tooltip, Tag, Popconfirm } from "antd";
import { EyeOutlined, MessageOutlined, CalendarOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";
import dayjs from "dayjs";
import { useCustomerSurvey } from "@/hooks/user-customer-survey";
import { SurveyFilters } from "@/api/services/customer-survey";
import CustomerSurveyFilters from "./CustomerSurveyFilters";
import ResponseDetailModal from "./ResponseDetailModal";
import { Separator } from "@/ui/separator";

const initialFilters: SurveyFilters = {
  page: 1,
  limit: 10,
  search: "",
};

export default function ResponseTableManagement() {
  const { useAllResponses, deleteResponses } = useCustomerSurvey();
  const [filters, setFilters] = useState<SurveyFilters>(initialFilters);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: responseData, isLoading } = useAllResponses(filters);
  const dataSource = responseData?.data?.data || [];
  const total = responseData?.data?.total || 0;

  const handleFilterChange = (key: keyof SurveyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleViewDetail = (record: any) => {
    setSelectedResponse(record);
    setIsModalOpen(true);
  };

  const handleDeleteResponse = async (id: string) => {
    await deleteResponses(id);
  };

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "PHẢN HỒI KHÁCH HÀNG",
        key: "feedback",
        width: 400,
        render: (_, record) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <MessageOutlined className="text-primary" />
              <span className="font-bold text-foreground line-clamp-1">
                {record.customerFeedback || "Không có nội dung góp ý"}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground italic">
              ID: {record._id}
            </span>
          </div>
        ),
      },
      {
        title: "SỐ CÂU TRẢ LỜI",
        dataIndex: "surveyData",
        width: 150,
        align: "center",
        render: (surveyData: any[]) => (
          <Tag color="blue" className="rounded-full px-3">
            {surveyData?.length || 0} Câu hỏi
          </Tag>
        ),
      },
      {
        title: "THỜI GIAN GỬI",
        dataIndex: "createdAt",
        width: 180,
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        render: (date) => (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarOutlined className="text-[12px]" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {dayjs(date).format("DD/MM/YYYY")}
              </span>
              <span className="text-[10px]">
                {dayjs(date).format("HH:mm:ss")}
              </span>
            </div>
          </div>
        ),
      },
      {
        title: "THAO TÁC",
        key: "actions",
        width: 120, 
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Xem chi tiết câu trả lời">
              <Button
                type="text"
                size="small"
                className="text-primary hover:bg-primary/10 rounded-lg"
                icon={<EyeOutlined className="text-lg" />}
                onClick={() => handleViewDetail(record)}
              />
            </Tooltip>
      
            <Tooltip title="Xóa phản hồi">
              <Popconfirm
                title="Xóa phản hồi này?"
                description="Hành động này không thể hoàn tác."
                onConfirm={() => handleDeleteResponse(record._id)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true, className: "bg-rose-500" }}
              >
                <Button
                  type="text"
                  size="small"
                  danger
                  className="hover:bg-rose-50 rounded-lg"
                  icon={<DeleteOutlined className="text-lg" />}
                />
              </Popconfirm>
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <CustomerSurveyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        placeholder="Tìm kiếm nội dung phản hồi..."
      />

      <Separator />


      <div className="overflow-hidden">
        <TableAntd
          columns={columns}
          data={dataSource}
          loading={isLoading}
          pagination={{
            page: filters.page ?? 1,
            limit: filters.limit ?? 10,
            total: total,
          }}
          onPageChange={(p, l) => {
            setFilters((prev) => ({
              ...prev,
              page: p,
              limit: l ?? 10,
            }));
          }}
        />
      </div>

      <ResponseDetailModal
        open={isModalOpen}
        data={selectedResponse}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}