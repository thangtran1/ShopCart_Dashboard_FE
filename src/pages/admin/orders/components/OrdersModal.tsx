"use client";

import { useState, useEffect } from "react";
import { Label } from "@/ui/label";
import { Button, Input, Select, Divider, message } from "antd";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/ui/dialog";
import {
  ShoppingBag,
  User,
  MapPin,
  Phone,
  CreditCard,
  Hash,
  Clock,
} from "lucide-react";
import { useOrder } from "@/hooks/useOrder";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Badge } from "@/ui/badge";

const statusVariant: Record<
  string,
  "warning" | "info" | "secondary" | "success" | "destructive"
> = {
  pending: "warning",
  processing: "info",
  shipped: "secondary",
  delivered: "success",
  cancelled: "destructive",
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
      <DialogContent className="!max-w-5xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl bg-background">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
              ORDER DETAILS
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              Quản lý trạng thái và thông tin giao nhận đơn hàng.
            </DialogDescription>
          </div>
          <Badge variant={statusVariant[order.status]}>
            {order.status.toUpperCase()}
          </Badge>
        </div>

        <div className="flex h-[620px]">
          <div className="w-3/5 border-r border-border px-6 overflow-y-auto bg-secondary/10">
            <div className="flex gap-10 justify-center mb-6 p-4 bg-background rounded-2xl border border-border shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-foreground uppercase">Mã đơn hàng</span>
                <span className="text-sm font-mono font-bold flex items-center gap-1 text-primary">
                  <Hash size={14} /> {order.orderNumber}
                </span>
              </div>
              <div className="w-[1px] bg-border" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-foreground uppercase">Thanh toán</span>
                <span className="text-sm font-bold flex items-center text-muted-foreground gap-1">
                  <CreditCard size={14} /> {order.paymentMethod}
                </span>
              </div>
              <div className="w-[1px] bg-border" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-foreground uppercase">Ngày đặt</span>
                <span className="text-sm font-bold flex items-center text-muted-foreground gap-1">
                  <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            <h3 className="text-xs text-foreground font-black uppercase tracking-widest mb-5 flex items-center gap-2">
              <ShoppingBag size={14} /> Danh sách sản phẩm
            </h3>

            <div className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-4 p-3 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all group"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-sm text-foreground font-bold line-clamp-1 italic">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.quantity} sản phẩm × {item.price.toLocaleString()}đ
                    </p>
                  </div>
                  <div className="flex items-center text-sm font-black text-foreground">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 bg-background p-6 rounded-3xl border border-border shadow-sm space-y-3">
              <div className="flex justify-between text-sm text-foreground">
                <span>Tạm tính</span>
                <span>{order.subTotal?.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-sm text-foreground">
                <span>Phí vận chuyển</span>
                <span>0đ</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-red-500 font-medium">
                  <span>Khuyến mãi</span>
                  <span>-{order.discountAmount?.toLocaleString()}đ</span>
                </div>
              )}
              <Divider className="my-2" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">TỔNG CỘNG</span>
                <span className="text-2xl font-black text-primary tracking-tighter">
                  {order.totalAmount?.toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>

          <div className="w-2/5 px-6 flex flex-col justify-between bg-background">
            <div className="space-y-8">
              <div>
                <Label className="text-xs mb-2 font-black uppercase text-primary tracking-widest">
                  Cập nhật trạng thái
                </Label>
                <Select
                  size="large"
                  className="w-full mt-3"
                  value={formData.status}
                  onChange={(v) => setFormData({ ...formData, status: v })}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  <Select.Option value="pending">Chờ duyệt</Select.Option>
                  <Select.Option value="processing">Đang xử lý</Select.Option>
                  <Select.Option value="shipped">Đang giao hàng</Select.Option>
                  <Select.Option value="delivered">Đã hoàn thành</Select.Option>
                  <Select.Option value="cancelled">Hủy đơn hàng</Select.Option>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <MapPin size={16} className="text-primary" />
                   <Label className="font-black uppercase text-xs tracking-widest text-foreground">
                     Thông tin giao hàng
                   </Label>
                </div>

                <div className="space-y-3">
                  <Input
                    size="large"
                    placeholder="Tên người nhận"
                    prefix={<User size={14} className="text-muted-foreground" />}
                    className="rounded-xl border-border"
                    value={formData.shippingAddress.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, fullName: e.target.value },
                      })
                    }
                  />

                  <Input
                    size="large"
                    placeholder="Số điện thoại"
                    prefix={<Phone size={14} className="text-muted-foreground" />}
                    className="rounded-xl border-border"
                    value={formData.shippingAddress.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, phone: e.target.value },
                      })
                    }
                  />

                  <Input.TextArea
                    size="large"
                    rows={3}
                    placeholder="Địa chỉ chi tiết..."
                    className="rounded-xl border-border"
                    value={formData.shippingAddress.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, address: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              {order.shippingAddress?.notes && (
                <div className="p-4 rounded-xl border border-dashed border-primary/50">
                  <p className="text-foreground text-[12px] font-bold uppercase mb-1 flex items-center gap-1">
                    <InfoCircleOutlined /> Ghi chú khách hàng
                  </p>
                  <p className="text-sm text-muted-foreground">
                    “{order.shippingAddress.notes}”
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 mb-6">
              <Button 
                block 
                size="large" 
                className="rounded-xl font-bold h-12" 
                onClick={onClose}
              >
                Đóng
              </Button>
              <Button
                block
                size="large"
                type="primary"
                loading={loading}
                onClick={handleSubmit}
                className="rounded-xl font-bold h-12 shadow-lg shadow-primary/20"
              >
                Lưu cập nhật
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}