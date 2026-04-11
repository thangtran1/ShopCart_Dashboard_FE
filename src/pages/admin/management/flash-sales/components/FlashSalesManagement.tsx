"use client";

import { useState, useMemo } from "react";
import { Button, Popconfirm, Tooltip, Tag, Switch, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";
import dayjs from "dayjs";
import { useFlashSales } from "@/hooks/useFlashSales";
import { Bolt } from "lucide-react";
import { CardTitle } from "@/ui/card";
import { toast } from "sonner";
import FlashSalesModal from "./FlashSalesModal";
import FlashSalesFilters from "./FlashSalesFilters";

export default function FlashSalesManagement() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "" });
  const { useGetAll, toggleStatusMutation, deleteMutation } = useFlashSales();
  const { data: responseData, isLoading } = useGetAll(filters);
  const flashSales = responseData?.data || [];
  const pagination = responseData?.pagination || { total: 0, page: 1, limit: 10 };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "RUNNING" ? "PAUSED" : "RUNNING";
    try {
      await toggleStatusMutation.mutateAsync({ id, status: newStatus });
      toast.success(`Đã ${newStatus === "RUNNING" ? "bật" : "tắt"} chiến dịch!`);
    } catch (err) {
      toast.error("Không thể thay đổi trạng thái!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Xóa chiến dịch thành công!");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi xóa!");
    }
  };

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tên chiến dịch",
        key: "name",
        width: 250,
        render: (_, record) => (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-primary text-base">
              {record.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {record.items?.length || 0} sản phẩm tham gia
            </span>
          </div>
        ),
      },
      {
        title: "Thời gian diễn ra",
        key: "time",
        width: 300,
        render: (_, record) => (
          <div className="flex flex-col gap-1 text-sm">
            <div>
              <span className="font-semibold text-green-600">Bắt đầu: </span>
              {dayjs(record.startTime).format("HH:mm | DD/MM/YYYY")}
            </div>
            <div>
              <span className="font-semibold text-red-500">Kết thúc: </span>
              {dayjs(record.endTime).format("HH:mm | DD/MM/YYYY")}
            </div>
          </div>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 150,
        render: (status: string, record) => {
          let color = "default";
          let label = status;
          if (status === "RUNNING") { color = "green"; label = "ĐANG CHẠY"; }
          if (status === "PAUSED") { color = "orange"; label = "TẠM DỪNG"; }
          if (status === "ENDED") { color = "red"; label = "ĐÃ KẾT THÚC"; }
          if (status === "UPCOMING") { color = "blue"; label = "SẮP DIỄN RA"; }

          return (
            <Space direction="vertical" size="small">
              <Tag color={color} className="font-bold py-1 px-2 border-none">
                {label}
              </Tag>
              {status !== "ENDED" && (
                <div className="flex items-center gap-2 mt-1">
                  <Switch 
                    checked={status === "RUNNING"}
                    onChange={() => handleToggleStatus(record._id, status)}
                    size="small"
                  />
                  <span className="text-[10px] text-muted-foreground">Bật/Tắt</span>
                </div>
              )}
            </Space>
          );
        },
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 120,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                size="small"
                className="text-indigo-600"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingCampaign(record);
                  setIsModalOpen(true);
                }}
              />
            </Tooltip>
            <Popconfirm
              title="Xóa chiến dịch này?"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="py-4 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <CardTitle className="text-2xl font-black text-foreground flex items-center gap-2">
            <div className="p-2 bg-yellow-500 rounded-xl shadow-lg shadow-yellow-200">
              <Bolt className="text-white w-6 h-6" />
            </div>
            QUẢN LÝ FLASH SALE
          </CardTitle>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-medium">
            Hệ thống luân chuyển chiến dịch sale tự động
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          className="bg-primary shadow-md hover:shadow-lg transition-all"
          onClick={() => {
            setEditingCampaign(null);
            setIsModalOpen(true);
          }}
        >
          Tạo Chiến Dịch
        </Button>
      </div>

      <FlashSalesFilters 
        filters={filters} 
        onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v, page: 1 }))}
        onClearFilters={() => setFilters({ page: 1, limit: 10, status: "" })}
      />

      <div className="mt-4">
        <TableAntd
          columns={columns}
          data={flashSales}
          loading={isLoading}
          pagination={{ ...pagination, current: pagination.page }}
          onPageChange={(page, limit) => setFilters(prev => ({ ...prev, page, limit: limit || prev.limit }))}
        />
      </div>

      <FlashSalesModal
        open={isModalOpen}
        campaign={editingCampaign}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
