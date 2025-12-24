export function WarrantyContent() {
  return (
    <div className="rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Tra cứu bảo hành</h2>
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Nhập mã đơn hàng hoặc số điện thoại"
          className="w-full border border-border rounded-lg px-4 py-3 mb-4"
        />
        <button className="w-full bg-red-600 text-foreground rounded-lg py-3 hover:bg-red-700 font-medium">
          Tra cứu
        </button>
      </div>
    </div>
  );
}

export function StoreContent() {
  return (
    <div className="rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Tìm kiếm cửa hàng</h2>
      <input
        type="text"
        placeholder="Nhập địa chỉ hoặc tên cửa hàng"
        className="w-full border border-border rounded-lg px-4 py-3 mb-4"
      />
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Bản đồ cửa hàng</p>
      </div>
    </div>
  );
}

export function PolicyContent() {
  return (
    <div className=" rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Chính sách bảo hành</h2>
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold mb-3">Điều kiện bảo hành</h3>
        <p className="text-foreground mb-4">
          Sản phẩm được bảo hành khi có đầy đủ các điều kiện sau: Sản phẩm còn
          trong thời hạn bảo hành được tính theo tem/phiếu bảo hành hoặc hóa đơn
          mua hàng.
        </p>
        <h3 className="text-lg font-semibold mb-3">Thời gian bảo hành</h3>
        <p className="text-foreground mb-4">
          12 tháng đối với sản phẩm điện thoại di động và phụ kiện.
        </p>
      </div>
    </div>
  );
}

export function SupportContent() {
  return (
    <div className="rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Góp ý - Phản hồi - Hỗ trợ</h2>
      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Chủ đề:</label>
          <select className="w-full border rounded-lg px-4 py-2">
            <option>Góp ý</option>
            <option>Khiếu nại</option>
            <option>Hỗ trợ kỹ thuật</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nội dung:</label>
          <textarea
            rows={6}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Nhập nội dung..."
          />
        </div>
        <button className="px-6 py-2 bg-red-600 text-foreground rounded-lg hover:bg-red-700">
          Gửi
        </button>
      </div>
    </div>
  );
}

export function TermsContent() {
  return (
    <div className="rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Điều khoản sử dụng</h2>
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold mb-3">1. Điều khoản chung</h3>
        <p className="text-foreground mb-4">
          Khi sử dụng dịch vụ của CellphoneS, quý khách đã đồng ý với các điều
          khoản sử dụng dưới đây.
        </p>
        <h3 className="text-lg font-semibold mb-3">2. Quyền và nghĩa vụ</h3>
        <p className="text-foreground mb-4">
          Khách hàng có quyền sử dụng các dịch vụ mà CellphoneS cung cấp và có
          nghĩa vụ tuân thủ các quy định.
        </p>
      </div>
    </div>
  );
}
