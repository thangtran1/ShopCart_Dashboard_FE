"use client";

import { useAddressActions } from "@/hooks/useAddresses";
import { useUserProfile } from "@/hooks/useUserProfile";
import OrdersPage from "@/pages/user/orders/page";
import ProductCard from "@/pages/user/public/ProductCard";
import useStore from "@/store/store";
import SeeMore from "@/ui/see-more";
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
      message: `Vui lòng cập nhật ${missingFields.join(", ")} để nhận thêm ưu đãi đặc quyền.`,
      btnText: "Cập nhật ngay",
      link: "/profile", // Chuyển hướng sang trang profile
      colorClass: "bg-blue-50 border-blue-200 text-blue-600"
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
      message: "Bạn chưa có địa chỉ nhận hàng. Thêm địa chỉ để đặt hàng nhanh hơn!",
      btnText: "Thêm ngay",
      link: "/profile",
      colorClass: "bg-amber-50 border-amber-200 text-amber-600"
    });
  }

  return (
    <div>
      <div className="space-y-3">
        {reminders.map((item) => (
          <div key={item.key} className={`${item.colorClass} border mb-4 rounded-lg p-4 flex items-center justify-between`}>
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

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="col-span-1 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Đơn hàng gần đây</h2>
          </div>
          <OrdersPage hideTitle />
        </div>
      </div>

      <div className="w-full mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Sản phẩm yêu thích</h2>
          {favoriteProduct && favoriteProduct.length > 3 && (
            <SeeMore to="/wishlist">Xem tất cả</SeeMore>
          )}
        </div>

        <div className="border-y py-4 overflow-x-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteProduct?.slice(0, 3).map((item: any) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}