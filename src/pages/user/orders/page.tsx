"use client";

import { useState } from "react";
import { Tabs } from "antd";
import OrdersComponent from "@/components/user/OrdersComponent";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/ui/table";
import Title from "@/ui/title";
import { useUserInfo } from "@/store/userStore";
import NoAccess from "@/components/user/NoAccess";
import { useOrder } from "@/hooks/useOrder";
import { Loader2, ShoppingBag } from "lucide-react";
import { OrderStatus } from "@/types/enum";

const OrdersPage = ({ hideTitle }: { hideTitle?: boolean }) => {
  // Mặc định là 'all'
  const [currentTab, setCurrentTab] = useState("all");
  const userInfo = useUserInfo();

  // Truyền currentTab vào hook để React Query tự động fetch theo status
  const { orders, loading } = useOrder(currentTab);

  const STATUS_TABS = [
    { label: "Tất cả", key: "all" },
    { label: "Chờ xử lý", key: OrderStatus.PENDING },
    { label: "Đang xử lý", key: OrderStatus.PROCESSING },
    { label: "Đang giao", key: OrderStatus.SHIPPED },
    { label: "Đã giao hàng", key: OrderStatus.DELIVERED },
    { label: "Đã hủy", key: OrderStatus.CANCELLED },
  ];

  if (!userInfo?.id) {
    return <NoAccess details="Vui lòng đăng nhập để xem danh sách đơn hàng." />;
  }

  return (
    <div className="space-y-4">
      {!hideTitle && (
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <Title className="text-2xl font-bold tracking-tight">Đơn hàng của tôi</Title>
            <p className="text-sm text-muted-foreground italic">Quản lý và theo dõi trạng thái đơn hàng</p>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-40">
        <Tabs
          activeKey={currentTab}
          onChange={(key) => setCurrentTab(key)}
          // centered  Bật cái này nếu muốn các tabs nằm giữa màn hình
          items={STATUS_TABS.map((tab) => ({
            label: (
              <span className="font-semibold uppercase text-[12px]">
                {tab.label}
              </span>
            ),
            key: tab.key,
          }))}
        />
      </div>

      <div className="w-full overflow-hidden -mt-4">
        <div className="p-0">
          {loading ? (
            <div className="flex h-[450px] flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse font-medium">Đang cập nhật dữ liệu...</p>
            </div>
          ) : orders?.length > 0 ? (
            <ScrollArea className="w-full h-[400px]">
              <div className="min-w-[1000px]">
                <Table className="relative w-full border-collapse">
                  <TableHeader className="sticky top-0 z-30 bg-secondary/95 backdrop-blur-md shadow-sm">
                    <TableRow className="hover:bg-transparent border-b">
                      <TableHead className="font-bold h-12">Mã đơn hàng</TableHead>
                      <TableHead className="font-bold">Ngày đặt</TableHead>
                      <TableHead className="font-bold">Người đặt</TableHead>
                      <TableHead className="sm:table-cell font-bold">Email</TableHead>
                      <TableHead className="sm:table-cell font-bold">Tạm tính</TableHead>
                      <TableHead className="lg:table-cell text-center font-bold">Giảm giá</TableHead>
                      <TableHead className="font-bold">Tổng cộng</TableHead>
                      <TableHead className="text-center font-bold">Trạng thái</TableHead>
                      <TableHead className="text-center font-bold">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <OrdersComponent orders={orders} />
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center">
              <NoAccess
                hidden
                details={`Không tìm thấy đơn hàng nào trong mục "${STATUS_TABS.find(t => t.key === currentTab)?.label}"`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;