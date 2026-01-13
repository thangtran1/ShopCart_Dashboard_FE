"use client";

import { TableBody, TableCell, TableRow } from "@/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import dayjs from "dayjs";
import { useState } from "react";
import OrderDetailDialog from "./OrderDetailDialog";
import { toast } from "sonner";
import { Badge } from "@/ui/badge";
import { useOrder } from "@/hooks/useOrder";
import { Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ORDER_STATUS_MAP, OrderStatus } from "@/types/enum";
import { useTranslation } from "react-i18next";

const OrdersComponent = ({ orders }: { orders: any[] }) => {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const { cancelOrder } = useOrder();

  const handleCancel = async (id: string) => {
    try {
      await cancelOrder(id);
      toast.success(t("orders.cancel_success"));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("orders.cancel_error"));
    }
  };

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders.map((order) => {
            const isPending = order.status === OrderStatus.PENDING;

            return (
              <Tooltip key={order?._id}>
                <TooltipTrigger asChild>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50 h-12 group/row"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="font-medium">
                      <Badge variant={'info'}>{order._id?.slice(-8).toUpperCase() ?? "N/A"}</Badge>
                    </TableCell>

                    <TableCell className="md:table-cell">
                      {order?.createdAt && dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                    </TableCell>

                    <TableCell>{order.shippingAddress?.fullName}</TableCell>
                    <TableCell className="sm:table-cell">{order.customerEmail}</TableCell>

                    <TableCell>
                      <PriceFormatter amount={order?.subTotal} className="font-medium" />
                    </TableCell>

                    <TableCell className="lg:table-cell text-center">
                      {order.discountAmount ? (
                        <Badge variant="outline" className="text-blue-500 border-blue-500">
                          <PriceFormatter amount={order?.discountAmount} className="font-medium" />
                        </Badge>
                      ) : <span className="text-error text-xs">__</span>}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <PriceFormatter amount={order?.totalAmount} className="font-bold text-primary" />
                        <span className="text-[9px] uppercase font-semibold text-muted-foreground">
                          {order.paymentMethod === 'COD' ? t("orders.payment_cash") : t("orders.payment_transfer")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {(() => {
                        const status = order.status as OrderStatus;
                        const config = ORDER_STATUS_MAP[status];

                        // Sử dụng chung key status đã định nghĩa ở phần OrdersPage
                        const statusKey = `orders.status_${status.toLowerCase()}`;

                        return (
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${config?.className || "bg-slate-100 text-slate-700"}`}>
                            {t(statusKey)}
                          </span>
                        );
                      })()}
                    </TableCell>

                    <TableCell
                      onClick={(event) => event.stopPropagation()}
                      className="text-center"
                    >
                      {isPending ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Popconfirm
                                title={t("orders.cancel_confirm_title")}
                                description={t("orders.cancel_confirm_desc")}
                                onConfirm={() => handleCancel(order._id)}
                                okText={t("orders.btn_confirm")}
                                cancelText={t("orders.btn_cancel")}
                                okButtonProps={{ danger: true }}
                                placement="left"
                              >
                                <div className="flex items-center justify-center cursor-pointer group/icon">
                                  <div className="flex items-center justify-center cursor-pointer p-2">
                                    <DeleteOutlined className="text-lg !text-destructive" />
                                  </div>
                                </div>
                              </Popconfirm>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>{t("orders.tooltip_cancel")}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground/30 text-xs">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("orders.tooltip_view_detail")}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </TableBody>
      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersComponent;