import OrdersComponent from "@/components/user/OrdersComponent";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Link } from "react-router";
import useStore from "@/store/store";
import Title from "@/ui/title";

const OrdersPage = () => {
  const orders = useStore((state) => state.orders);

  return (
    <div>
      {orders?.length ? (

        <>
          <div className="flex items-center gap-2 pb-3">
            <Title>Danh sách đơn hàng</Title>
          </div>
          <Card className="w-full">
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] md:w-auto">
                        Số đơn hàng
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Ngày đặt hàng
                      </TableHead>
                      <TableHead>Tên người đặt</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Email
                      </TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-center">Hành động</TableHead>
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
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Không có đơn hàng nào
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
            Có vẻ như bạn chưa đặt hàng nào. Bắt đầu mua sắm để xem đơn hàng của bạn ở đây!
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Xem sản phẩm</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
