export function OverviewContent() {
  const recentOrders = [
    {
      id: "#WN0303983886",
      date: "16/12/2025",
      product:
        "Dán kính cường lực màn hình Apple iPhone 17 Pro Max Mipow Premium Full Cao Cấp-Đen",
      price: "400.000đ",
      total: "360.000đ",
      image: "📱",
    },
    {
      id: "#WN0303983556",
      date: "16/12/2025",
      product: "SAMSUNG GALAXY Z FOLD 6 5G 256GB XÁM (F956)",
      price: "43.990.000đ",
      total: "29.990.000đ",
      image: "📱",
    },
    {
      id: "#WN0303983545",
      date: "16/12/2025",
      product: "Samsung Galaxy Z Fold6 12GB 256GB-Xám",
      price: "43.990.000đ",
      total: "29.990.000đ",
      image: "📱",
    },
  ];

  const favoriteProducts = [
    {
      name: "Laptop ASUS TUF Gaming F16 FX607VJ-RL034AW",
      price: "21.900.000đ",
      originalPrice: "23.900.000đ",
    },
    {
      name: "Điện thoại iPhone 16 Pro Max 256GB",
      price: "30.990.000đ",
      originalPrice: "34.990.000đ",
    },
    {
      name: "iPhone 17 Pro 256GB | Chính hãng",
      price: "34.390.000đ",
      originalPrice: "36.990.000đ",
    },
    {
      name: "OPPO Find X9 12GB 256GB",
      price: "22.990.000đ",
      originalPrice: "25.990.000đ",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notifications */}
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

      <div className="grid grid-cols-3 gap-3">
        {/* Recent Orders */}
        <div className="col-span-2 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Đơn hàng gần đây</h2>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-3xl flex-shrink-0">
                      {order.image}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground mb-1">
                        Đơn hàng:{" "}
                        <span className="font-medium">{order.id}</span> | Ngày
                        đặt hàng:{" "}
                        <span className="font-medium">{order.date}</span>
                      </p>
                      <h3 className="text-sm font-medium mb-2">
                        {order.product}
                      </h3>
                      <p className="text-sm text-gray-500">{order.price}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded flex-shrink-0">
                    Đã hủy
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm">
                    Tổng thanh toán:{" "}
                    <span className="text-red-600 font-semibold">
                      {order.total}
                    </span>
                  </span>
                  <button className="text-sm text-blue-600 hover:underline">
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Benefits */}
        <div className=" rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Ưu đãi của bạn</h2>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium mb-2">[EMAIL] ƯU ĐÃI KHÁCH HÀNG...</h3>
            <p className="text-sm text-foreground mb-2">
              Giảm giá: <span className="font-medium">0đ</span>
            </p>
            <p className="text-sm text-foreground mb-2">
              HSD: <span className="font-medium">03/01/2028</span>
            </p>
            <div className="flex items-center gap-2 mt-3">
              <code className="flex-1 bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                EMAIL_DGFBG15
              </code>
              <button className="text-foreground hover:text-gray-800">
                📋
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Products */}
      <div className="rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sản phẩm yêu thích</h2>
          <button className="text-blue-600 text-sm hover:underline">
            Xem tất cả →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {favoriteProducts.map((product, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center text-3xl">
                📱
              </div>
              <h3 className="text-xs font-medium mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-red-600 font-semibold text-sm">
                {product.price}
              </p>
              <p className="text-gray-400 text-xs line-through">
                {product.originalPrice}
              </p>
              <button className="mt-2 text-blue-600 text-xs">❤️</button>
            </div>
          ))}
        </div>
      </div>

      {/* Promotions */}
      <div className="rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Chương trình nổi bật</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-lg p-6 flex items-center justify-center text-foreground">
            <span className="text-4xl">💻</span>
            <span className="ml-3 font-semibold">Đặc quyền Online</span>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-orange-400 rounded-lg p-6 flex items-center justify-center text-foreground">
            <span className="text-4xl">🎁</span>
            <span className="ml-3 font-semibold">Tặng Ngay Voucher</span>
          </div>
        </div>
      </div>
    </div>
  );
}
