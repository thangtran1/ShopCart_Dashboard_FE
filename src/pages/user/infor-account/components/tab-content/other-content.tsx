import Contact from "@/pages/user/contact";
import TermsPage from "@/pages/user/public/terms";
import { Tabs } from "antd";

const EMPTY_IMG =
  "https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png";

export function WarrantyContent() {
  const warranties: any[] = [];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tra cứu bảo hành</h2>
        <p className="text-sm text-muted-foreground">
          Theo dõi tình trạng bảo hành sản phẩm
        </p>
      </div>

      <Tabs
        defaultActiveKey="all"
        items={[
          { key: "all", label: "Tất cả" },
          { key: "received", label: "Tiếp nhận" },
          { key: "processing", label: "Đang xử lý" },
          { key: "done", label: "Hoàn tất" },
        ]}
      />

      {warranties.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <img
            src={EMPTY_IMG}
            alt="empty"
            className="w-48 mb-4"
          />
          <p className="text-base font-medium mb-1">
            Bạn chưa có đơn bảo hành
          </p>
          <a
            href="/"
            className="text-sm text-red-600 hover:underline"
          >
            Trang chủ
          </a>
        </div>
      )}
    </div>
  );
}

export function SupportContent() {
  return (
    <Contact />
  );
}

export function TermsContent() {
  return (
   <TermsPage />
  );
}