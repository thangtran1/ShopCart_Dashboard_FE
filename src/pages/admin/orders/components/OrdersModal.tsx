"use client";

import { useState, useEffect } from "react";
import { Label } from "@/ui/label";
import { Button, Input, Select, Divider, message, Tag } from "antd";
import { Dialog, DialogContent } from "@/ui/dialog";
import {
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Package,
  CreditCard,
} from "lucide-react";
import { useOrder } from "@/hooks/useOrder";
import { InfoCircleOutlined } from "@ant-design/icons";

const statusColor: Record<string, string> = {
  pending: "gold",
  processing: "blue",
  shipped: "cyan",
  delivered: "green",
  cancelled: "red",
};

export default function OrdersModal({ open, onClose, order }: any) {
  const { updateOrderAdmin } = useOrder();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (order && open) {
      setFormData({
        customerName: order.customerName,
        status: order.status,
        shippingAddress: { ...order.shippingAddress },
      });
    }
  }, [order, open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateOrderAdmin({ id: order._id, data: formData });
      message.success("Cập nhật đơn hàng thành công");
      onClose();
    } catch {
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-5xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-foreground flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black italic tracking-wide">
              ORDER DETAILS
            </h2>
            <p className="text-[11px] opacity-80 tracking-[0.25em] mt-1">
              MÃ ĐƠN: {order.orderNumber}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Tag color={statusColor[order.status]} className="!text-xs">
              {order.status.toUpperCase()}
            </Tag>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <CreditCard size={14} />
              {order.paymentMethod}
            </div>
          </div>
        </div>

        <div className="flex h-[620px]">
          <div className="w-3/5 border-r border-border p-6 overflow-y-auto">
            <h3 className="text-xs text-foreground font-black uppercase tracking-widest mb-5 flex items-center gap-2">
              <ShoppingBag size={14} /> Sản phẩm
            </h3>

            <div className="space-y-4">
              {order.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-2xl border border-border hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-border"
                  />

                  <div className="flex-1">
                    <p className="text-sm text-foreground font-bold line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      SL: {item.quantity} × {item.price.toLocaleString()}đ
                    </p>
                  </div>

                  <div className="text-sm font-black text-indigo-600">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-foreground p-5 rounded-2xl border border-border">
              <div className="flex justify-between text-sm">
                <span>Tạm tính</span>
                <span>{order.subTotal?.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Giảm giá</span>
                <span className="text-red-500">
                  -{order.discountAmount?.toLocaleString()}đ
                </span>
              </div>

              <Divider className="my-3" />

              <div className="flex justify-between text-xl font-black text-success/70 italic">
                <span>TỔNG</span>
                <span>{order.totalAmount?.toLocaleString()}đ</span>
              </div>
            </div>
          </div>

          <div className="w-2/5 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <Label className="text-[10px] mb-2 font-black uppercase tracking-widest text-success/50">
                  Trạng thái đơn hàng
                </Label>
                <Select
                  size="large"
                  className="w-full mt-2"
                  value={formData.status}
                  onChange={(v) => setFormData({ ...formData, status: v })}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  <Select.Option value="pending">Chờ duyệt</Select.Option>
                  <Select.Option value="processing">Đang xử lý</Select.Option>
                  <Select.Option value="shipped">Đang giao</Select.Option>
                  <Select.Option value="delivered">Đã giao</Select.Option>
                  <Select.Option value="cancelled">Hủy đơn</Select.Option>
                </Select>
              </div>

              <div className="p-5 text-foreground rounded-2xl border border-border space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={12} /> Địa chỉ giao hàng
                </Label>

                <Input
                  prefix={<User size={14} />}
                  value={formData.shippingAddress.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        fullName: e.target.value,
                      },
                    })
                  }
                />

                <Input
                  prefix={<Phone size={14} />}
                  value={formData.shippingAddress.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        phone: e.target.value,
                      },
                    })
                  }
                />

                <Input.TextArea
                  rows={3}
                  placeholder="Số nhà, tên đường..."
                  value={formData.shippingAddress.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        address: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {order.shippingAddress?.notes && (
                <div className="p-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50">
                  <p className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                    <InfoCircleOutlined /> Ghi chú khách hàng
                  </p>
                  <p className="text-sm italic">
                    “{order.shippingAddress.notes}”
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button block size="large" danger onClick={onClose}>
                Hủy
              </Button>
              <Button
                block
                size="large"
                type="primary"
                loading={loading}
                icon={<Package size={16} />}
                onClick={handleSubmit}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
