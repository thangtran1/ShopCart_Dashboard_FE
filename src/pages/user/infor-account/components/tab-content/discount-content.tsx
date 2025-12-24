export function DiscountContent() {
    const vouchers = [
      { code: "SAVE100K", discount: "100.000đ", condition: "Đơn từ 5.000.000đ", expiry: "31/12/2025" },
      { code: "GIAMGIA50", discount: "50.000đ", condition: "Đơn từ 2.000.000đ", expiry: "25/12/2025" },
      { code: "FREESHIP", discount: "Miễn phí ship", condition: "Mọi đơn hàng", expiry: "30/12/2025" },
      { code: "TECH200", discount: "200.000đ", condition: "Đơn từ 10.000.000đ", expiry: "31/01/2026" },
    ]
  
    return (
      <div className="rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Mã giảm giá</h2>
        <div className="grid grid-cols-2 gap-4">
          {vouchers.map((voucher, index) => (
            <div
              key={index}
              className="border border-dashed border-red-300 rounded-lg p-4 bg-red-50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-red-600 mb-1">{voucher.discount}</div>
                  <code className="px-3 py-1 rounded text-sm font-mono border border-border">
                    {voucher.code}
                  </code>
                </div>
                <button className="px-4 py-2 bg-red-600 text-foreground rounded hover:bg-red-700 text-sm font-medium">
                  Sao chép
                </button>
              </div>
              <div className="text-sm text-foreground space-y-1">
                <p>📦 {voucher.condition}</p>
                <p>📅 HSD: {voucher.expiry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  