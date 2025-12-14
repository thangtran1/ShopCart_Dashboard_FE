import { Order } from "@/types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import PriceFormatter from "./PriceFormatter";
import { CreditCard, Truck, MapPin, Phone, Mail, User, Calendar, Package } from "lucide-react";

interface OrderDetailsDialogProps {
  order: Order | null;
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
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground font-semibold">
            Chi tiết đơn hàng – {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        {/* Thông tin đơn hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thông tin khách hàng */}
          <div className="p-4 rounded-lg border space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <User className="w-4 h-4" />
              Thông tin khách hàng
            </h3>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              {order.customerName}
            </p>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {order.customerEmail}
            </p>
            {order.customerPhone && (
              <p className="text-foreground flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {order.customerPhone}
              </p>
            )}
          </div>

          {/* Thông tin đơn hàng */}
          <div className="p-4 rounded-lg border space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <Package className="w-4 h-4" />
              Thông tin đơn hàng
            </h3>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Mã đơn:</span>
              <span className="font-medium">{order.orderNumber}</span>
            </p>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {order.orderDate && new Date(order.orderDate).toLocaleString("vi-VN")}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Trạng thái:</span>
              <span className={`px-2 py-1 rounded-full text-xs uppercase font-semibold ${order.status === "paid"
                ? "bg-success text-white"
                : "bg-warning text-white"
                }`}>
                {order.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
              </span>
            </div>
            {order.paymentMethod && (
              <p className="text-foreground flex items-center gap-2 text-sm">
                {order.paymentMethod === "card" ? (
                  <CreditCard className="w-4 h-4 text-blue-500" />
                ) : (
                  <Truck className="w-4 h-4 text-amber-500" />
                )}
                <span>
                  {order.paymentMethod === "card" ? "Thẻ tín dụng/ghi nợ" : "Thanh toán khi nhận hàng"}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        {order.shippingAddress && (
          <div className="p-4 rounded-lg border space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" />
              Địa chỉ giao hàng
            </h3>
            <p className="text-foreground text-sm">
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}
            </p>
            {order.notes && (
              <p className="text-muted-foreground text-sm italic">
                Ghi chú: {order.notes}
              </p>
            )}
          </div>
        )}

        {/* Table giữ nguyên */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Giá</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {order.items?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-3 text-foreground">
                  <img
                    src={item.product.image}
                    alt={item?.product?.name}
                    className="w-14 h-14 border rounded-md object-cover"
                  />
                  <span className="font-medium">{item.product?.name}</span>
                </TableCell>

                <TableCell className="text-foreground">{item.quantity}</TableCell>

                <TableCell>
                  <PriceFormatter
                    amount={item.price}
                    className="text-foreground font-medium"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-2 border-t pt-4 text-right flex items-center justify-end">
          <div className="flex items-center gap-4">
            <h3 className="text-lg text-foreground font-medium">Tổng tiền: </h3>
            <PriceFormatter
              amount={order?.totalAmount}
              className="text-success text-2xl font-bold"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;

