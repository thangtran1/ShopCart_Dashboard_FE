export function HistoryContent() {
    return (
      <div className="rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Lịch sử mua hàng</h2>
  
        <div className="border-b mb-6">
          <div className="flex gap-6">
            <button className="pb-3 border-b-2 border-red-600 text-red-600 font-medium">Tất cả</button>
            <button className="pb-3 text-foreground hover:text-red-600">Chờ xác nhận</button>
            <button className="pb-3 text-foreground hover:text-red-600">Đã xác nhận</button>
            <button className="pb-3 text-foreground hover:text-red-600">Đang vận chuyển</button>
            <button className="pb-3 text-foreground hover:text-red-600">Đã giao hàng</button>
            <button className="pb-3 text-foreground hover:text-red-600">Đã hủy</button>
          </div>
        </div>
  
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium">Lịch sử mua hàng</span>
          <input type="date" defaultValue="2020-12-01" className="border border-border rounded px-3 py-2 text-sm" />
          <span className="text-gray-500">→</span>
          <input type="date" defaultValue="2025-12-23" className="border border-border rounded px-3 py-2 text-sm" />
          <button className="p-2 border border-border rounded hover:bg-muted-foreground">📅</button>
        </div>
  
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm text-foreground">Đơn hàng: </span>
                <span className="font-medium">#WN0303983886</span>
                <span className="text-sm text-foreground ml-4">Ngày đặt hàng: </span>
                <span className="font-medium">16/12/2025</span>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded">Đã hủy</span>
            </div>
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-3xl">📱</div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">
                  Dán kính cường lực màn hình Apple iPhone 17 Pro Max Mipow Premium Full Cao Cấp-Đen
                </h3>
                <p className="text-sm text-gray-500">400.000đ</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t">
              <span className="text-sm">
                Tổng thanh toán: <span className="text-red-600 font-semibold">360.000đ</span>
              </span>
              <button className="text-sm text-blue-600 hover:underline">Xem chi tiết →</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  