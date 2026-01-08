"use client";

import { useAddressActions } from "@/hooks/useAddresses";
import { useUserProfile } from "@/hooks/useUserProfile";
import OrdersPage from "@/pages/user/orders/page";
import ProductCard from "@/pages/user/public/ProductCard";
import useStore from "@/store/store";
import SeeMore from "@/ui/see-more";
import Title from "@/ui/title";
import { HeartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { toast } from "sonner";

export function OverviewContent() {
  const { favoriteProduct } = useStore();

  const { profile } = useUserProfile();
  const { addresses, isFetching } = useAddressActions();

  const reminders = [];

  const missingFields = [];
  if (!profile?.dateOfBirth) missingFields.push("ngày sinh");

  if (missingFields.length > 0) {
    reminders.push({
      key: "user-info",
      icon: "ℹ️",
      message: `Vui lòng cập nhật ${missingFields.join(
        ", "
      )} để nhận thêm ưu đãi đặc quyền.`,
      btnText: "Cập nhật ngay",
      link: "/profile", // Chuyển hướng sang trang profile
      colorClass: "bg-blue-50 border-blue-200 text-blue-600",
    });
  }

  if (!profile?.phone) {
    reminders.push({
      key: "phone-info",
      icon: "ℹ️",
      message: `Vui lòng cập nhật số điện thoại để nhận thêm ưu đãi đặc quyền.`,
      btnText: "Cập nhật ngay",
      link: "/profile", // Chuyển hướng sang trang profile
      colorClass: "bg-blue-50 border-blue-200 text-blue-600",
    });
  }

  // Check địa chỉ
  if (!isFetching && addresses?.length === 0) {
    reminders.push({
      key: "address-info",
      icon: "📍",
      message:
        "Bạn chưa có địa chỉ nhận hàng. Thêm địa chỉ để đặt hàng nhanh hơn!",
      btnText: "Thêm ngay",
      link: "/profile",
      colorClass: "bg-amber-50 border-amber-200 text-amber-600",
    });
  }

  return (
    <div>
      <div className="space-y-3">
        {reminders.map((item) => (
          <div
            key={item.key}
            className={`${item.colorClass} border mb-4 rounded-lg p-4 flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <div className="text-lg">{item.icon}</div>
              <span className="text-sm text-gray-700 font-medium">
                {item.message}
              </span>
            </div>
            {/* <Link to={item.link}> */}
            <button
              onClick={() => toast.warning("Tính năng đang được phát triển 🛠️")}
              className="text-inherit cursor-pointer text-sm font-bold hover:underline flex items-center gap-1"
            >
              {item.btnText}
            </button>
            {/* </Link> */}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-start gap-2">
              <Badge showZero color="#1677ff" offset={[-2, 2]}>
                <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all hover:bg-primary/10">
                  <ShoppingOutlined className="text-2xl text-primary" />
                </div>
              </Badge>

              <div>
                <Title className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
                  Lịch sử đơn hàng
                </Title>
                <p className="text-sm text-muted-foreground max-w-[500px]">
                  Quản lý, theo dõi trạng thái các đơn hàng bạn đã đặt và xem
                  chi tiết hóa đơn.
                </p>
              </div>
            </div>
          </div>
          <OrdersPage hideTitle />
        </div>
      </div>
      <div className="w-full mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge
              count={favoriteProduct.length}
              showZero
              color="#f43f5e"
              offset={[-2, 2]}
            >
              <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all hover:scale-105">
                <HeartOutlined className="text-2xl text-rose-500" />
              </div>
            </Badge>

            <div>
              <Title className="text-xl sm:text-2xl font-bold tracking-tight mb-0.5">
                Sản phẩm yêu thích
              </Title>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Các sản phẩm bạn đã quan tâm và muốn sở hữu
              </p>
            </div>
          </div>

          {favoriteProduct && favoriteProduct.length > 3 && (
            <SeeMore to="/wishlist">
              Xem tất cả ({favoriteProduct.length})
            </SeeMore>
          )}
        </div>

        <div className="pt-4">
          {favoriteProduct.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteProduct.slice(0, 3).map((item: any) => (
                <div
                  key={item._id}
                  className="transition-transform hover:-translate-y-1"
                >
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground italic">
                Bạn chưa có sản phẩm yêu thích nào.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
