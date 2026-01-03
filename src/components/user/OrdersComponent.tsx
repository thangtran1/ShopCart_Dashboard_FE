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
import { X } from "lucide-react";
import { useState } from "react";
import OrderDetailDialog from "./OrderDetailDialog";
import { toast } from "sonner";
import { Badge } from "@/ui/badge";

const OrdersComponent = ({ orders }: { orders: any[] }) => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders.map((order) => {
            return <Tooltip key={order?._id}>
              <TooltipTrigger asChild>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50 h-12"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="font-medium">
                    <Badge variant={'info'}>{order._id?.slice(-8).toUpperCase() ?? "N/A"}</Badge>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {order?.createdAt &&
                      dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    {order.shippingAddress?.fullName}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.customerEmail}
                  </TableCell>
                  <TableCell>
                    <PriceFormatter
                      amount={order?.subTotal}
                      className="font-medium"
                    />
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-center">
                    {order.discountAmount ? (
                      <Badge variant="outline" className="text-blue-500 border-blue-500">
                        <PriceFormatter
                          amount={order?.discountAmount}
                          className="font-medium"
                        />
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <PriceFormatter
                        amount={order?.totalAmount}
                        className="font-bold text-primary"
                      />
                      <span className="text-[9px]  uppercase font-semibold text-muted-foreground">
                        {order.paymentMethod === 'C OD' ? 'Tiền mặt' : 'Chuyển khoản'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === "processing" || order.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {order.status === "pending" ? "Chờ xử lý" :
                        order.status === "processing" ? "Đang xử lý" :
                          order.status === "delivered" ? "Đã giao" : order.status}
                    </span>
                  </TableCell>
                  <TableCell
                    onClick={(event) => {
                      event.stopPropagation();
                      toast.error("Vui lòng liên hệ hỗ trợ để hủy đơn hàng");
                    }}
                    className="flex items-center justify-center group"
                  >
                    <X
                      size={20}
                      className="group-hover:text-error hoverEffect"
                    />
                  </TableCell>
                </TableRow>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết đơn hàng</p>
              </TooltipContent>
            </Tooltip>
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