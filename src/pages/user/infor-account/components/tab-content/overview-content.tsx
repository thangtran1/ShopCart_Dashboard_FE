"use client";

import { useCopyToClipboard } from "@/hooks";
import OrdersPage from "@/pages/user/orders/page";
import ProductCard from "@/pages/user/public/ProductCard";
import useStore from "@/store/store";
import { Badge } from "@/ui/badge";
import SeeMore from "@/ui/see-more";
import { Button } from "antd";

export function OverviewContent() {
  const { copyFn } = useCopyToClipboard();
  const { favoriteProduct } = useStore();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-600 text-lg">ℹ️</div>
            <span className="text-sm text-gray-700">
              Đăng ký S-Student/ S-Teacher để nhận thêm ưu đãi lên đến 600k/sản
              phẩm
            </span>
          </div>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            Đăng ký ngay
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-600 text-lg">ℹ️</div>
            <span className="text-sm text-gray-700">
              Đăng ký S-Business để nhận ưu đãi đặc quyền!
            </span>
          </div>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            Đăng ký ngay
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="col-span-1 lg:col-span-2 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Đơn hàng gần đây</h2>
          </div>
          <OrdersPage hideTitle />
        </div>

        {/* Your Benefits */}
        <div className="rounded-lg shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Ưu đãi của bạn</h2>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium mb-2 truncate">
              [EMAIL] ƯU ĐÃI KHÁCH HÀNG...
            </h3>
            <p className="text-sm text-foreground mb-2">
              Giảm giá: <span className="font-medium">0đ</span>
            </p>
            <p className="text-sm text-foreground mb-2">
              HSD: <span className="font-medium">03/01/2028</span>
            </p>

            {/* Badge + Button */}
            <div className="flex flex-col md:flex-col lg:flex-row lg:items-center gap-2 mt-3">
              <Badge variant={"success"} className="w-full lg:w-auto">
                EMAIL_DGFBG15
              </Badge>
              <Button
                className="w-full md:w-full lg:w-auto"
                onClick={() => copyFn("EMAIL_DGFBG15")}
              >
                Sao chép
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Sản phẩm yêu thích</h2>

          {favoriteProduct && favoriteProduct.length > 3 && (
            <SeeMore to="/wishlist">Xem tất cả</SeeMore>
          )}
        </div>

        <div className="border-y py-4 overflow-x-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteProduct?.slice(0, 4).map((item: any) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
