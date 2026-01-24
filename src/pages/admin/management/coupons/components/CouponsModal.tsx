"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "@/ui/label";
import { Button, Input, Select, InputNumber, DatePicker, Switch } from "antd";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Textarea } from "@/ui/textarea";
import { toast } from "sonner";
import dayjs from "dayjs";
import { TicketPercent, CalendarDays, Coins, Info, Users } from "lucide-react";
import { useCoupon } from "@/hooks/useCoupon";

const { Option } = Select;

interface CouponDto {
  code: string;
  description: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  usageLimit: number;
  limitPerUser: number;
  isActive: boolean;
}

interface CouponsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  coupon?: any | null;
}

export default function CouponsModal({ open, onClose, onSuccess, coupon }: CouponsModalProps) {
  const { createCoupon, updateCoupon } = useCoupon();

  const [formData, setFormData] = useState<CouponDto>({
    code: "",
    description: "",
    discountType: "fixed",
    discountValue: 0,
    minOrderAmount: 0,
    expiryDate: "",
    usageLimit: 0,
    limitPerUser: 1,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        description: coupon.description || "",
        discountType: coupon.discountType || "fixed",
        discountValue: coupon.discountValue || 0,
        minOrderAmount: coupon.minOrderAmount || 0,
        expiryDate: coupon.expiryDate || "",
        usageLimit: coupon.usageLimit || 0,
        limitPerUser: coupon.limitPerUser ?? 1,
        isActive: coupon.isActive ?? true,
      });
    } else {
      setFormData({
        code: "",
        description: "",
        discountType: "fixed",
        discountValue: 0,
        minOrderAmount: 0,
        expiryDate: "",
        usageLimit: 0,
        limitPerUser: 1,
        isActive: true,
      });
    }
  }, [coupon, open]);

  const updateField = (field: keyof CouponDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return toast.error("Vui lòng nhập mã voucher");

    setLoading(true);
    try {
      const result = coupon?._id
        ? await updateCoupon(coupon._id, formData)
        : await createCoupon(formData);

      if (result) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-3xl overflow-hidden flex flex-col p-0 border-none shadow-2xl">
        <div className="bg-primary/5 p-6 border-b border-primary/40">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
              <TicketPercent className="w-8 h-8" />
              {coupon ? "Cập nhật Voucher" : "Thiết lập Voucher mới"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center text-foreground gap-2 font-semibold"><Info className="w-4 h-4" /> Mã Voucher</Label>
                  <Input
                    size="large"
                    placeholder="VD: NEWYEAR2026"
                    value={formData.code}
                    onChange={(e) => updateField("code", e.target.value.toUpperCase())}
                    className="font-mono font-bold uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold  text-foreground">Hình thức giảm</Label>
                  <Select
                    size="large"
                    className="w-full"
                    value={formData.discountType}
                    onChange={(val) => updateField("discountType", val)}
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    <Option value="fixed">Số tiền cố định (VNĐ)</Option>
                    <Option value="percentage">Phần trăm (%)</Option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-border">
                <div className="space-y-2">
                  <Label className="flex items-center  text-foreground gap-2 font-semibold"><Coins className="w-4 h-4" /> Mức giảm</Label>
                  <InputNumber
                    size="large"
                    className="w-full"
                    min={0}
                    value={formData.discountValue}
                    formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    onChange={(val) => updateField("discountValue", val)}
                    addonAfter={formData.discountType === "fixed" ? "đ" : "%"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold  text-foreground">Đơn tối thiểu</Label>
                  <InputNumber
                    size="large"
                    className="w-full"
                    min={0}
                    value={formData.minOrderAmount}
                    formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    onChange={(val) => updateField("minOrderAmount", val)}
                    addonAfter="đ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 border border-border rounded-xl">
                <div className="space-y-2">
                  <Label className="flex items-center text-foreground gap-2 font-semibold">
                    Tổng lượt sử dụng (Hệ thống)
                  </Label>
                  <InputNumber
                    size="large"
                    className="w-full"
                    min={0}
                    value={formData.usageLimit}
                    onChange={(val) => updateField("usageLimit", val)}
                  />
                  <p className="text-[10px] mt-2 text-muted-foreground">Nhập 0 nếu không giới hạn tổng số mã phát ra.</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold text-foreground">
                    <Users className="w-4 h-4" /> Giới hạn mỗi người dùng
                  </Label>
                  <InputNumber
                    size="large"
                    className="w-full border-blue-200"
                    min={0}
                    value={formData.limitPerUser}
                    onChange={(val) => updateField("limitPerUser", val)}
                  />
                  <div className="flex items-start gap-1 mt-2">
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      <strong>Lưu ý:</strong> Nếu nhập <strong>0</strong>, khách hàng có thể dùng mã này <strong>không giới hạn số lần</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center text-foreground gap-2 font-semibold"><CalendarDays className="w-4 h-4" /> Ngày hết hạn</Label>
                <DatePicker
                  size="large"
                  showTime
                  className="w-full"
                  value={formData.expiryDate ? dayjs(formData.expiryDate) : null}
                  onChange={(_, dateString) => updateField("expiryDate", dateString)}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-foreground text-sm">Mô tả hiển thị</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Mô tả cho khách hàng thấy..."
                  className="resize-none"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-primary/90">Kích hoạt voucher</div>
                  <div className="text-xs text-foreground">Cho phép áp dụng mã này ngay lập tức.</div>
                </div>
                <Switch checked={formData.isActive} onChange={(val) => updateField("isActive", val)} />
              </div>
            </motion.div>
          </div>

          <div className="p-6 border-t flex justify-end gap-3">
            <Button size="large" onClick={onClose} border-none shadow-none>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              {coupon ? "Lưu thay đổi" : "Tạo Voucher"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}