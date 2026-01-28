"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useCoupon } from "@/hooks/useCoupon";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";
import dayjs from "dayjs";

import CouponsModal from "./CouponsModal";
import CouponFilters from "./CouponFilters";
import { Ticket, Users } from "lucide-react";
import { CardTitle } from "@/ui/card";
import { Icon } from "@/components/icon";
import { Separator } from "@/ui/separator";
import { Badge } from "@/ui/badge";
import { ICouponFilters } from "@/api/services/couponApi";

const initialFilters: ICouponFilters = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  discountType: "",
  isActive: undefined,
};

export default function CouponsManagement() {
  const { fetchAdminCoupons, deleteCoupon, loading } = useCoupon();

  const [filters, setFilters] = useState<ICouponFilters>(initialFilters);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  const loadAdminData = useCallback(async () => {
    const res = await fetchAdminCoupons(filters);
    if (res && res.success) {
      setDataSource(res.data);
      setTotal(res.pagination?.total || 0);
    }
  }, [filters, fetchAdminCoupons]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleFilterChange = (key: keyof ICouponFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: any) => {
    setEditingCoupon(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteCoupon(id);
    if (ok) loadAdminData();
  };

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "CHIẾN DỊCH",
        key: "code",
        dataIndex: "code",
        width: 250,
        render: (_, record) => (
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0 w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Ticket className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-foreground uppercase tracking-tight truncate">
                {record.code}
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-1 italic">
                {record.description || "Không có mô tả"}
              </span>
            </div>
          </div>
        ),
      },
      {
        title: "LOẠI ƯU ĐÃI",
        key: "discount",
        dataIndex: "discountValue",
        width: 160,
        render: (_, record) => (
          <div className="space-y-1">
            <Badge variant={"success"}>
              {record.discountType === "percentage"
                ? `Giảm ${record.discountValue}%`
                : `Giảm ${record.discountValue?.toLocaleString()}đ`}
            </Badge>
            <p className="text-[10px] text-muted-foreground font-medium italic">
              Đơn từ: {record.minOrderAmount?.toLocaleString()}đ
            </p>
          </div>
        ),
      },
      {
        title: "KÍCH HOẠT",
        dataIndex: "isActive",
        width: 120,
        align: "center",
        render: (isActive: boolean) => (
          <div className="flex flex-col items-center gap-1">
            {isActive ? (
              <Badge variant="success">
                ĐANG BẬT
              </Badge>
            ) : (
              <Badge variant="warning">
                TẠM DỪNG
              </Badge>
            )}
            <span className="text-[9px] text-slate-400 font-medium">
              (Admin Control)
            </span>
          </div>
        ),
      },
      {
        title: "TÌNH TRẠNG",
        key: "actualStatus",
        width: 140,
        render: (_, record) => {
          const isExpired = dayjs().isAfter(dayjs(record.expiryDate));
          const isOutOfStock = record.usageLimit > 0 && record.usedCount >= record.usageLimit;
      
          if (isExpired) return <Badge variant="error">Hết hạn</Badge>;
          if (isOutOfStock) return <Badge variant="info">Hết lượt</Badge>;
          return <Badge variant="success">Khả dụng</Badge>;
        },
      },
      {
        title: "SỬ DỤNG / TỔNG",
        key: "usage",
        width: 220,
        render: (_, record) => {
          const percent =
            record.usageLimit > 0
              ? (record.usedCount / record.usageLimit) * 100
              : 0;
          return (
            <div className="flex flex-col gap-1 pr-4">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground">
                  Đã dùng: {record.usedCount}
                </span>
                <span className="text-slate-400">
                  {record.usageLimit === 0
                    ? "∞"
                    : `Hạn mức: ${record.usageLimit}`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-border">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    percent >= 90
                      ? "bg-rose-500"
                      : percent >= 70
                      ? "bg-amber-500"
                      : "bg-indigo-500"
                  }`}
                  style={{ width: `${record.usageLimit === 0 ? 0 : percent}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Users size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-400">
                  Giới hạn: {record.limitPerUser} lần/người
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: "HẾT HẠN",
        dataIndex: "expiryDate",
        width: 130,
        sorter: (a, b) => dayjs(a.expiryDate).unix() - dayjs(b.expiryDate).unix(),
        render: (date, record) => {
          const d = dayjs(date);
          const isExpired = dayjs().isAfter(d);
          const isOutOfStock = record.usageLimit > 0 && record.usedCount >= record.usageLimit;
      
          let textColor = "text-teal-600";
          if (isExpired || isOutOfStock) textColor = "text-red-600";
          else if (!record.isActive) textColor = "text-purple-600";
      
          return (
            <div className={`flex flex-col ${textColor}`}>
              <span className="text-xs font-bold">
                {d.format("DD/MM/YYYY")}
              </span>
              <span className="text-[10px] opacity-70 font-medium">
                {d.format("HH:mm")}
              </span>
            </div>
          );
        },
      },
      {
        title: "THAO TÁC",
        key: "actions",
        width: 100,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                size="small"
                className="text-indigo-600 hover:bg-indigo-50 rounded-lg"
                icon={<EditOutlined className="text-lg" />}
                onClick={() => handleOpenEditModal(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Xóa voucher này?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true, className: "bg-rose-500" }}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined className="text-lg" />}
              />
            </Popconfirm>
          </div>
        ),
      },
    ],
    [handleOpenEditModal, handleDelete]
  );

  return (
    <div>
      <div className="space-y-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon icon="lucide:ticket" className="h-7 w-7 text-primary" />
              Voucher Workshop
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              Quản lý và theo dõi hiệu suất mã giảm giá của bạn.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              size="large"
              className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 border-none font-bold text-sm transition-all hover:-translate-y-0.5"
              onClick={handleOpenAddModal}
            >
              Tạo Voucher mới
            </Button>
          </div>
        </div>

        <Separator className="my-0" />

        <CouponFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="mt-6">
          <TableAntd
            columns={columns}
            data={dataSource}
            loading={loading}
            pagination={{
              page: filters.page ?? 1,
              limit: filters.limit ?? 10,
              total,
            }}
            onPageChange={(p, l) => {
              setFilters((prev) => ({
                ...prev,
                page: p,
                limit: l || prev.limit,
              }));
            }}
          />
        </div>
      </div>

      <CouponsModal
        open={isModalOpen}
        coupon={editingCoupon}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          loadAdminData();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
