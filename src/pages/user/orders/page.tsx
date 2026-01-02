"use client";

import { useEffect } from "react";
import OrdersComponent from "@/components/user/OrdersComponent";
import { Card, CardContent } from "@/ui/card";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/ui/table";
import Title from "@/ui/title";
import { useUserInfo } from "@/store/userStore";
import NoAccess from "@/components/user/NoAccess";
import { useOrder } from "@/hooks/useOrder";
import { Loader2 } from "lucide-react";

interface OrdersPageProps {
  hideTitle?: boolean;
}

const OrdersPage = ({ hideTitle }: OrdersPageProps) => {
  const userInfo = useUserInfo();
  const { orders, loading, fetchMyOrders } = useOrder();

  useEffect(() => {
    if (userInfo?.id) {
      fetchMyOrders();
    }
  }, [userInfo?.id]);

  if (!userInfo?.id) {
    return (
      <NoAccess details="Vui lòng đăng nhập để xem danh sách đơn hàng của bạn và theo dõi trạng thái mua sắm." />
    );
  }

  if (loading && !orders?.length) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải danh sách đơn hàng...</span>
      </div>
    );
  }

  return (
    <>
      {orders?.length ? (
        <>
          {!hideTitle && (
            <div className="flex items-center gap-2 pb-3">
              <Title>Danh sách đơn hàng</Title>
            </div>
          )}

          <Card className="w-full">
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Số đơn hàng</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Ngày đặt hàng
                      </TableHead>
                      <TableHead>Tên người đặt</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Email
                      </TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-center">
                        Hành động
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <OrdersComponent orders={orders} />
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      ) : (
        <NoAccess
          hidden
          details="Bạn chưa có đơn hàng nào. Hãy mua sắm để tạo đơn hàng đầu tiên!"
        />
      )}
    </>
  );
};

export default OrdersPage;