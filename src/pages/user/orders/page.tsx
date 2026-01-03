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
import { Loader2, ShoppingBag } from "lucide-react";

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
      <div className="flex h-[450px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/80" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Đang tải danh sách đơn hàng...
        </p>
      </div>
    );
  }

  return (
    <div>
      {orders?.length ? (
        <>
          {!hideTitle && (
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Title className="text-2xl font-bold tracking-tight">Danh sách đơn hàng</Title>
                  <p className="text-sm text-muted-foreground">
                    Quản lý và theo dõi trạng thái các đơn hàng của bạn
                  </p>
                </div>
              </div>
            </div>
          )}

          <Card className="w-full shadow-lg border-none">
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] w-full rounded-md border">
                <Table className="relative w-full border-collapse">
                  <TableHeader className="sticky top-0 z-30 bg-secondary shadow-sm">
                    <TableRow className="hover:bg-transparent border-b-2">
                      <TableHead className="font-bold h-12">Mã đơn hàng</TableHead>
                      <TableHead className="hidden md:table-cell font-bold">Ngày đặt</TableHead>
                      <TableHead className="font-bold">Người đặt</TableHead>
                      <TableHead className="hidden sm:table-cell font-bold">Email</TableHead>
                      <TableHead className="hidden sm:table-cell font-bold text-right">Tạm tính</TableHead>
                      <TableHead className="hidden lg:table-cell text-center font-bold">Giảm giá</TableHead>
                      <TableHead className="font-bold text-right">Tổng cộng</TableHead>
                      <TableHead className="text-center font-bold">Trạng thái</TableHead>
                      <TableHead className="text-center font-bold">Thao tác</TableHead>
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
        <div className="min-h-[500px] flex items-center justify-center">
          <NoAccess
            hidden
            details="Bạn chưa có đơn hàng nào. Hãy mua sắm để tạo đơn hàng đầu tiên!"
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;