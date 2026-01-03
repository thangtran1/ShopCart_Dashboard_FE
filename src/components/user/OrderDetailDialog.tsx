"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import PriceFormatter from "./PriceFormatter";
import { CreditCard, Truck, MapPin, Phone, Mail, User, Calendar, Package, Tag, Receipt } from "lucide-react";

interface OrderDetailsDialogProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground font-semibold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Chi tiết đơn hàng – {order.orderNumber}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Thông tin chi tiết về đơn hàng, sản phẩm, người nhận và trạng thái xử lý.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thông tin khách hàng */}
          <div className="p-4 rounded-lg border space-y-2 bg-muted/5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-primary" />
              Thông tin khách hàng
            </h3>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{order.shippingAddress?.fullName || order.customerName}</span>
            </p>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {order.customerEmail}
            </p>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              {order.shippingAddress?.phone}
            </p>
          </div>

          <div className="p-4 rounded-lg border space-y-2 bg-muted/5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-primary" />
              Trạng thái & Thanh toán
            </h3>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {order.createdAt && new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Trạng thái đơn:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                order.status === "pending" ? "bg-amber-100 text-amber-700 border border-amber-200" : 
                order.status === "delivered" ? "bg-green-100 text-green-700 border border-green-200" : 
                "bg-blue-100 text-blue-700 border border-blue-200"
              }`}>
                {order.status === "pending" ? "Chờ xử lý" : 
                 order.status === "delivered" ? "Đã giao hàng" : order.status}
              </span>
            </div>
            <div className="text-foreground flex items-center gap-2 text-sm">
              {order.paymentMethod === "CARD" ? (
                <CreditCard className="w-4 h-4 text-blue-500" />
              ) : (
                <Truck className="w-4 h-4 text-amber-500" />
              )}
              <span className="font-medium">
                {order.paymentMethod === "CARD" ? "Thanh toán Online (Thẻ)" : "Thanh toán khi nhận hàng (COD)"}
              </span>
            </div>
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        {order.shippingAddress && (
          <div className="p-4 rounded-lg border space-y-2 bg-muted/5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-red-500" />
              Địa chỉ giao hàng
            </h3>
            <p className="text-foreground text-sm pl-6">
              {order.shippingAddress.address}, {order.shippingAddress.city}
            </p>
            {order.shippingAddress.notes && (
              <p className="text-muted-foreground text-xs italic pl-6">
                Ghi chú: {order.shippingAddress.notes}
              </p>
            )}
          </div>
        )}

        <div className="rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-center">Số lượng</TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-3 text-foreground">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 border rounded-md object-cover bg-white"
                    />
                    <span className="font-medium text-sm line-clamp-1">{item.name}</span>
                  </TableCell>
                  <TableCell className="text-center text-foreground">x{item.quantity}</TableCell>
                  <TableCell className="text-right text-foreground">
                    <PriceFormatter amount={item.price} />
                  </TableCell>
                  <TableCell className="text-right text-foreground font-medium">
                    <PriceFormatter amount={item.price * item.quantity} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex flex-col items-end gap-2 pr-4">
            <div className="flex justify-between w-full max-w-[250px] text-sm text-muted-foreground">
              <span>Tạm tính:</span>
              <PriceFormatter amount={order.subTotal} />
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between w-full max-w-[250px] text-sm text-red-500 italic">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Giảm giá ({order.couponCode}):
                </span>
                <span>-<PriceFormatter amount={order.discountAmount} /></span>
              </div>
            )}

            <div className="flex justify-between w-full max-w-[250px] text-sm text-muted-foreground">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>

            <div className="flex justify-between w-full max-w-[300px] items-center border-t pt-2 mt-2">
              <h3 className="text-md text-foreground font-bold uppercase">Tổng thanh toán:</h3>
              <PriceFormatter
                amount={order?.totalAmount}
                className="text-primary text-2xl font-extrabold"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;