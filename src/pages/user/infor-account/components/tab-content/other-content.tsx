export function AddressContent() {
  return (
    <div className="rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Số địa chỉ</h2>
      <div className="border border-border rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">📍</div>
        <p className="text-foreground mb-4">Bạn chưa có địa chỉ nào</p>
        <button className="px-6 py-2 bg-red-600 text-foreground rounded hover:bg-red-700">
          Thêm địa chỉ mới
        </button>
      </div>
    </div>
  );
}

export function StudentContent() {
  return (
    <div className=" rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">S-Student & S-Teacher</h2>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h3 className="text-xl font-semibold mb-2">
          Ưu đãi đặc biệt cho Sinh viên & Giáo viên
        </h3>
        <p className="text-foreground mb-4">
          Nhận ngay ưu đãi lên đến 600.000đ khi đăng ký S-Student hoặc S-Teacher
        </p>
        <button className="px-6 py-3 bg-red-600 text-foreground rounded-lg hover:bg-red-700 font-medium">
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}

export function LinkedContent() {
  return (
    <div className=" rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Liên kết tài khoản</h2>
      <div className="space-y-4">
        <div className="border border-border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔵</div>
            <div>
              <p className="font-medium">Google</p>
              <p className="text-sm text-foreground">Đã liên kết</p>
            </div>
          </div>
          <button className="text-sm text-red-600 hover:underline">
            Hủy liên kết
          </button>
        </div>
        <div className="border border-border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔵</div>
            <div>
              <p className="font-medium">Zalo</p>
              <p className="text-sm text-foreground">Chưa liên kết</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-foreground rounded hover:bg-blue-700 text-sm">
            Liên kết
          </button>
        </div>
      </div>
    </div>
  );
}

export function WarrantyContent() {
  return (
    <div className="rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Tra cứu bảo hành</h2>
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

export function PreferencesContent() {
  return (
    <div className="rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Thông tin tài khoản</h2>
      <div className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên:</label>
            <input
              type="text"
              defaultValue="Lê Hồng quang"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Số điện thoại:
            </label>
            <input
              type="text"
              defaultValue="0389215396"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Giới tính:</label>
            <select className="w-full border rounded px-3 py-2">
              <option>-</option>
              <option>Nam</option>
              <option>Nữ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              defaultValue="kimochi2023@gmail.com"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <button className="px-6 py-2 bg-red-600 text-foreground rounded hover:bg-red-700">
          Cập nhật
        </button>
      </div>
    </div>
  );
}

export function StoreContent() {
  return (
    <div className="rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Tìm kiếm cửa hàng</h2>
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
    <div className=" rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Chính sách bảo hành</h2>
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
    <div className="rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Góp ý - Phản hồi - Hỗ trợ</h2>
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
    <div className="rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Điều khoản sử dụng</h2>
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
