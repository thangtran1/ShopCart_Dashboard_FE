"use client";

import { useState, useMemo } from "react";
import { useOrder } from "@/hooks/useOrder";
import {
  Button,
  Popconfirm,
  Tooltip,
  Tag,
  Select,
  message,
  Popover,
  List,
  Avatar,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CreditCardOutlined,
  WalletOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";
import dayjs from "dayjs";

import OrdersModal from "./OrdersModal";
import OrdersFilters from "./OrdersFilters";
import { ShoppingBag, User } from "lucide-react";
import { CardTitle } from "@/ui/card";
import { AdminOrderQuery } from "@/api/services/orderApi";
import { Separator } from "@/ui/separator";

interface StatusConfigItem {
  color: string;
  label: string;
}

const initialFilters: AdminOrderQuery = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  paymentMethod: "",
};

export default function OrdersManagement() {
  const [filters, setFilters] = useState<AdminOrderQuery>(initialFilters);
  const { adminOrders, pagination, loading, deleteOrder, updateOrderAdmin } =
    useOrder(filters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  const statusConfig: Record<string, StatusConfigItem> = {
    pending: { color: "orange", label: "CHỜ DUYỆT" },
    processing: { color: "blue", label: "ĐANG XỬ LÝ" },
    shipped: { color: "cyan", label: "ĐANG GIAO" },
    delivered: { color: "green", label: "ĐÃ GIAO" },
    cancelled: { color: "red", label: "ĐÃ HỦY" },
  };

  const handleUpdateStatusQuickly = async (id: string, newStatus: string) => {
    try {
      await updateOrderAdmin({ id, data: { status: newStatus } });
      message.success("Đã cập nhật trạng thái đơn hàng!");
    } catch (error) {
      message.error("Không thể cập nhật trạng thái.");
    }
  };

  const getDisabledOptions = (currentStatus: string, targetStatus: string) => {
    if (currentStatus === "delivered" || currentStatus === "cancelled")
      return true;

    if (currentStatus === targetStatus) return false;

    const flow: Record<string, string[]> = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
    };

    return !flow[currentStatus]?.includes(targetStatus);
  };

  const FINAL_STATUS = ["delivered", "cancelled"];

  const getStatusMeta = (status: string) => ({
    isFinal: FINAL_STATUS.includes(status),
  });

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "ĐƠN HÀNG",
        key: "orderNumber",
        width: 180,
        render: (_, record) => (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-primary uppercase tracking-tight">
              #{record.orderNumber}
            </span>
            <span className="text-sm text-muted-foreground italic">
              {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}
            </span>
            {record.shippingAddress?.notes && (
              <Tooltip title={`Ghi chú: ${record.shippingAddress.notes}`}>
                <Tag
                  color="error"
                  className="text-[9px] w-fit m-0"
                  icon={<InfoCircleOutlined />}
                >
                  GHI CHÚ
                </Tag>
              </Tooltip>
            )}
          </div>
        ),
      },
      {
        title: "SẢN PHẨM",
        key: "items",
        width: 220,
        render: (_, record) => (
          <Popover
            content={
              <div className="w-[350px] max-h-[400px] overflow-y-auto">
                <List
                  itemLayout="horizontal"
                  dataSource={record.items}
                  renderItem={(item: any) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar src={item.image} shape="square" size={45} />
                        }
                        title={
                          <span className="text-xs font-bold">{item.name}</span>
                        }
                        description={
                          <span className="text-xs text-indigo-500">
                            {item.quantity} x {item.price?.toLocaleString()}đ
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            }
            title={
              <span className="font-bold text-success">
                Chi tiết {record.items?.length} sản phẩm
              </span>
            }
            trigger="hover"
          >
            <div className="flex items-center gap-3 p-2 rounded-xl border border-dashed border-border cursor-pointer hover:bg-muted transition-all">
              <Avatar.Group maxCount={2} size="large">
                {record.items?.map((item: any, i: number) => (
                  <Avatar key={i} src={item.image} />
                ))}
              </Avatar.Group>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold truncate w-[150px]">
                  {record.items[0]?.name}
                </span>
                <span className="text-[10px] text-indigo-500 font-bold truncate w-[140px]">
                  {record.items?.length > 3
                    ? `Xem thêm ${record.items.length - 1} món`
                    : null}
                </span>
              </div>
            </div>
          </Popover>
        ),
      },
      {
        title: "KHÁCH HÀNG",
        key: "customer",
        width: 200,
        render: (_, record) => (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-xs font-bold uppercase text-foreground">
              <User size={12} className="text-indigo-400" />{" "}
              {record.customerName}
            </div>
            <span className="text-[11px] text-foreground">
              {record.shippingAddress?.phone}
            </span>
            <span className="text-[10px] text-foreground font-medium truncate w-40">
              {record.shippingAddress?.city}
            </span>
          </div>
        ),
      },
      {
        title: "THANH TOÁN",
        key: "total",
        width: 160,
        render: (_, record) => {
          const isOnline = record.paymentMethod === "ONLINE";
      
          return (
            <div className="flex flex-col gap-1">
              <span className="font-extrabold text-[15px] text-primary leading-none">
                {record.totalAmount?.toLocaleString()}đ
              </span>
      
              <Tag
                color={isOnline ? "green" : "orange"}
                icon={isOnline ? <CreditCardOutlined /> : <WalletOutlined />}
                className="!px-2 text-center !py-[2px] !text-[9px] !font-bold !uppercase !rounded-full w-fit"
              >
                {isOnline ? "ONLINE" : "COD"}
              </Tag>
            </div>
          );
        },
      },
      {
        title: "TRẠNG THÁI",
        dataIndex: "status",
        width: 160,
        render: (status: string, record) => {
          const { isFinal } = getStatusMeta(status);
          return (
            <Select
              value={status}
              size="small"
              disabled={isFinal}
              variant="borderless"
              style={{ width: "100%" }}
              suffixIcon={
                !isFinal && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                )
              }
              onChange={(val) => handleUpdateStatusQuickly(record._id, val)}
            >
              {Object.entries(statusConfig).map(([key, cfg]) => {
                const isDisabled = getDisabledOptions(status, key);
                const isCurrent = status === key;

                return (
                  <Select.Option key={key} value={key} disabled={isDisabled}>
                    <div className="flex items-center gap-2 py-1">
                      <Tag
                        color={cfg.color}
                        className={`
                    m-0 font-bold text-[10px] px-3 py-1 rounded-full uppercase
                    ${
                      isCurrent
                        ? "bg-white/10 ring-1 ring-primary/50 shadow-sm"
                        : ""
                    }
                    ${
                      isDisabled && !isCurrent
                        ? "opacity-30 blur-[0.2px]"
                        : "shadow-sm"
                    }
                    transition-all duration-200
                  `}
                      >
                        {cfg.label}
                      </Tag>

                      {isCurrent && (
                        <span className="text-[10px] font-bold text-primary/80 uppercase tracking-tight">
                          Hiện tại
                        </span>
                      )}

                      {!isDisabled && !isCurrent && (
                        <span className="text-[10px] font-semibold text-green-500 uppercase tracking-tight">
                          → Chọn tiếp
                        </span>
                      )}
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        title: "THAO TÁC",
        key: "actions",
        width: 100,
        fixed: "right",
        render: (_, record) => (
          <div className="flex items-center gap-1">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                size="small"
                className="text-indigo-600"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingOrder(record);
                  setIsModalOpen(true);
                }}
              />
            </Tooltip>
            <Popconfirm
              title="Xóa đơn hàng?"
              onConfirm={() => deleteOrder(record._id)}
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
    [handleUpdateStatusQuickly]
  );

  return (
    <div className="py-4 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <CardTitle className="text-2xl font-black text-foreground flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            QUẢN LÝ VẬN ĐƠN
          </CardTitle>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-medium">
            Hệ thống xử lý đơn hàng tập trung
          </p>
        </div>
      </div>

      <Separator className="my-0" />

      <OrdersFilters
        filters={filters}
        onFilterChange={(k, v) =>
          setFilters((p) => ({ ...p, [k]: v, page: 1 }))
        }
        onClearFilters={() => setFilters(initialFilters)}
      />

      <TableAntd
        columns={columns}
        data={adminOrders}
        loading={loading}
        pagination={{
          page: filters.page ?? 1,
          limit: filters.limit ?? 10,
          total: pagination?.total || 0,
        }}
        onPageChange={(p, l) =>
          setFilters((prev) => ({ ...prev, page: p, limit: l || prev.limit }))
        }
      />

      <OrdersModal
        open={isModalOpen}
        order={editingOrder}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
