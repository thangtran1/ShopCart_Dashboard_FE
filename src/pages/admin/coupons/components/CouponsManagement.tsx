"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useCoupon } from "@/hooks/useCoupon";
import { Button, Input, Popconfirm, Tooltip, Select } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";
import dayjs from "dayjs";

import CouponsModal from "./CouponsModal";
import { Search, Ticket, Users } from "lucide-react";
import { CardTitle } from "@/ui/card";
import { Icon } from "@/components/icon";
import { Separator } from "@/ui/separator";
import { Badge } from "@/ui/badge";

const { Option } = Select;
export default function CouponsManagement() {
  const { fetchAdminCoupons, deleteCoupon, loading } = useCoupon();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  const loadAdminData = useCallback(async () => {
    const res = await fetchAdminCoupons(page, limit, search);
    if (res && res.success) {
      setDataSource(res.data);
      setTotal(res.pagination?.totalItems || 0);
    }
  }, [page, limit, search, fetchAdminCoupons]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

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

  const columns: ColumnsType<any> = useMemo(() => [
    {
      title: "CHIẾN DỊCH",
      key: "code",
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
      width: 160,
      render: (_, record) => (
        <div className="space-y-1">
          <Badge variant={'success'}>
            {record.discountType === "percentage" ? `Giảm ${record.discountValue}%` : `Giảm ${record.discountValue?.toLocaleString()}đ`}
          </Badge>
          <p className="text-[10px] text-muted-foreground font-medium italic">
            Đơn từ: {record.minOrderAmount?.toLocaleString()}đ
          </p>
        </div>
      ),
    },
    {
      title: "TRẠNG THÁI",
      key: "status",
      width: 150,
      render: (_, record) => {
        const isExpired = dayjs().isAfter(dayjs(record.expiryDate));
        const outOfStock =
          record.usageLimit > 0 && record.usedCount >= record.usageLimit;

        if (isExpired) {
          return (
            <Badge variant="info">
              <span className="text-xs font-medium">Hết hạn</span>
            </Badge>
          );
        }

        if (outOfStock) {
          return (
            <Badge variant="default">
              <span className="text-xs font-medium">Hết lượt</span>
            </Badge>
          );
        }

        if (!record.isActive) {
          return (
            <Badge variant="warning">
              <span className="text-xs font-medium">Tạm dừng</span>
            </Badge>
          );
        }

        return (
          <Badge variant="success">
            <span className="text-xs font-bold">Đang chạy</span>
          </Badge>
        );
      },
    },
    {
      title: "SỬ DỤNG / TỔNG",
      key: "usage",
      width: 220,
      render: (_, record) => {
        const percent = record.usageLimit > 0 ? (record.usedCount / record.usageLimit) * 100 : 0;
        return (
          <div className="flex flex-col gap-1 pr-4">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-slate-600">Đã dùng: {record.usedCount}</span>
              <span className="text-slate-400">{record.usageLimit === 0 ? "∞" : `Hạn mức: ${record.usageLimit}`}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
              <div
                className={`h-full transition-all duration-700 rounded-full ${percent >= 90 ? 'bg-rose-500' : percent >= 70 ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                style={{ width: `${record.usageLimit === 0 ? 0 : percent}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Users size={10} className="text-slate-400" />
              <span className="text-[10px] text-slate-400">Giới hạn: {record.limitPerUser} lần/người</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "HẾT HẠN",
      dataIndex: "expiryDate",
      width: 130,
      render: (date) => {
        const isExpired = dayjs().isAfter(dayjs(date));
        return (
          <div className={`flex flex-col ${isExpired ? "text-rose-400" : "text-slate-600"}`}>
            <span className="text-xs font-bold">{dayjs(date).format("DD/MM/YYYY")}</span>
            <span className="text-[10px] opacity-70">{dayjs(date).format("HH:mm")}</span>
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
  ], [handleOpenEditModal, handleDelete]);
  return (
    <div>
      <div className="space-y-8 py-4">

        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon icon="lucide:users" className="h-7 w-7 text-primary" />
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


        <div className="flex items-center gap-4 p-2 pl-4 mt-6 rounded-2xl border border-border shadow-sm transition-focus-within:ring-2 ring-indigo-50">
          <Search className="w-5 h-5 text-slate-400" />
          <Input
            placeholder="Tìm theo mã hoặc nội dung chương trình..."
            variant="borderless"
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 text-sm font-medium"
            allowClear
          />
          <div className="h-6 w-[1px] mx-2"></div>
          <Select defaultValue="all" variant="borderless" className="w-40 font-medium text-slate-600">
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Đang chạy</Option>
            <Option value="expired">Đã hết hạn</Option>
          </Select>
        </div>

        <Separator className="my-0" />

        <div className="mt-6">
          <TableAntd
            columns={columns}
            data={dataSource}
            loading={loading}
            pagination={{ page, limit, total }}
            onPageChange={(p, l) => {
              setPage(p);
              if (l) setLimit(l);
            }}
            scroll={{ x: 800, y: 500 }}
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