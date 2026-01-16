"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import PriceFormatter from "./PriceFormatter";
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Package,
  Tag,
  Receipt,
} from "lucide-react";
import { ORDER_STATUS_MAP } from "@/types/enum";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  if (!order) return null;

  const getWarrantyBadge = (expireDate: string | null) => {
    if (!expireDate)
      return (
        <span className="text-[10px] text-foreground/80 italic">
          {t("ordersDetail.no_warranty")}
        </span>
      );

    const isExpired = new Date(expireDate) < new Date();
    return (
      <span
        className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
          isExpired
            ? "bg-red-50 text-red-600 border-red-100"
            : "bg-green-50 text-green-600 border-green-100"
        }`}
      >
        {isExpired
          ? t("ordersDetail.warranty_expired")
          : `${t("ordersDetail.warranty_until")}: ${new Date(
              expireDate
            ).toLocaleDateString(i18n.language === "vi" ? "vi-VN" : "en-US")}`}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground font-semibold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {t("ordersDetail.dialog_title")} – {order.orderNumber}
          </DialogTitle>

          <DialogDescription className="text-sm text-left text-muted-foreground">
            {t("ordersDetail.dialog_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thông tin khách hàng */}
          <div className="p-4 rounded-lg border space-y-2 bg-muted/5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-primary" />
              {t("ordersDetail.customer_info")}
            </h3>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {order.shippingAddress?.fullName}
              </span>
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
              {t("ordersDetail.order_status_payment")}
            </h3>
            <p className="text-foreground flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {order.createdAt &&
                new Date(order.createdAt).toLocaleString(
                  i18n.language === "vi" ? "vi-VN" : "en-US"
                )}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {t("ordersDetail.order_status_label")}
              </span>
              {(() => {
                const config = ORDER_STATUS_MAP[order.status];

                const statusKey = `orders.status_${order.status.toLowerCase()}`;
                const statusLabel = t(statusKey);

                return (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                      config?.className ||
                      "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {statusLabel}
                  </span>
                );
              })()}
            </div>
            <div className="text-foreground flex items-center gap-2 text-sm">
              {order.paymentMethod === "CARD" ? (
                <CreditCard className="w-4 h-4 text-blue-500" />
              ) : (
                <Truck className="w-4 h-4 text-amber-500" />
              )}
              <span className="font-medium">
                {order.paymentMethod === "CARD"
                  ? t("ordersDetail.payment_online")
                  : t("ordersDetail.payment_cod")}
              </span>
            </div>
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        {order.shippingAddress && (
          <div className="p-4 rounded-lg border space-y-2 bg-muted/5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-red-500" />
              {t("ordersDetail.shipping_address")}
            </h3>
            <p className="text-foreground text-sm pl-6">
              {order.shippingAddress.address}, {order.shippingAddress.city}
            </p>
            {order.shippingAddress.notes && (
              <p className="text-muted-foreground text-xs italic pl-6">
                {t("ordersDetail.shipping_notes")}:{" "}
                {order.shippingAddress.notes}
              </p>
            )}
          </div>
        )}

        <div className="w-full rounded-lg border overflow-hidden">
          <ScrollArea className="w-full h-[350px]">
            <div className="min-w-[1000px]">
              <Table className="border-collapse">
                <TableHeader className="sticky top-0 z-20 bg-muted/95 backdrop-blur shadow-sm">
                  <TableRow>
                    <TableHead className="w-[40%] min-w-[300px]">
                      {t("ordersDetail.table_product")}
                    </TableHead>
                    <TableHead className="text-center w-[15%]">
                      {t("ordersDetail.table_quantity")}
                    </TableHead>
                    <TableHead className="text-right w-[20%]">
                      {t("ordersDetail.table_unit_price")}
                    </TableHead>
                    <TableHead className="text-right w-[25%] pr-6">
                      {t("ordersDetail.table_total_price")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item: any, index: number) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 shrink-0 rounded-md border bg-white object-cover"
                          />
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-sm font-semibold text-foreground truncate">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                              {getWarrantyBadge(item.warrantyExpireDate)}
                              {item.warrantyPeriod > 0 && (
                                <span className="text-[10px] italic text-muted-foreground">
                                  (
                                  {t("ordersDetail.warranty_package", {
                                    month: item.warrantyPeriod,
                                  })}
                                  )
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-foreground font-medium">
                        x{item.quantity}
                      </TableCell>

                      <TableCell className="text-right text-foreground">
                        <PriceFormatter amount={item.price} />
                      </TableCell>

                      <TableCell className="text-right font-bold pr-6 text-primary">
                        <PriceFormatter amount={item.price * item.quantity} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>

        <div className="w-full border-t pt-4 flex justify-end">
          <div className="space-y-2 flex flex-col items-end gap-2 pr-4">
            <div className="flex justify-between w-full text-sm text-foreground">
              <span>{t("ordersDetail.summary_subtotal")}</span>
              <PriceFormatter amount={order.subTotal} />
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between w-full text-sm text-red-500 italic">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />{" "}
                  {t("ordersDetail.summary_discount")} ({order.couponCode}):
                </span>
                <span>
                  -<PriceFormatter amount={order.discountAmount} />
                </span>
              </div>
            )}

            <div className="flex justify-between w-full text-sm text-foreground">
              <span>{t("ordersDetail.summary_shipping")}</span>
              <span>{t("ordersDetail.summary_shipping_free")}</span>
            </div>

            <div className="flex justify-between w-full items-center border-t pt-2 mt-2">
              <h3 className="text-md text-foreground font-bold uppercase mr-2">
                {t("ordersDetail.summary_total")}
              </h3>
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
