export function MemberContent() {
    return (
      <div className="rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Hạng thành viên</h2>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">S-NULL</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Lê Hồng quang</h3>
                <p className="text-foreground">Hạng hiện tại: S-NULL</p>
              </div>
            </div>
            <div className=" rounded-lg p-4">
              <p className="text-sm text-foreground mb-2">
                Điểm tích lũy: <span className="font-semibold text-red-600">0 điểm</span>
              </p>
              <p className="text-sm text-foreground">
                Chi tiêu thêm <span className="font-semibold">3.000.000đ</span> để lên hạng S-NEW
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
            </div>
          </div>
  
          <div>
            <h3 className="text-lg font-semibold mb-4">Quyền lợi thành viên</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">🎁</div>
                <h4 className="font-medium mb-2">Ưu đãi độc quyền</h4>
                <p className="text-sm text-foreground">Nhận các ưu đãi và khuyến mãi đặc biệt dành riêng cho thành viên</p>
              </div>
              <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">💳</div>
                <h4 className="font-medium mb-2">Tích điểm thưởng</h4>
                <p className="text-sm text-foreground">Tích điểm mỗi lần mua hàng để đổi quà và voucher</p>
              </div>
              <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">🎂</div>
                <h4 className="font-medium mb-2">Quà sinh nhật</h4>
                <p className="text-sm text-foreground">Nhận quà đặc biệt vào ngày sinh nhật của bạn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  