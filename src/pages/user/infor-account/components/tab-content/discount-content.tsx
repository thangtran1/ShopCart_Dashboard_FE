"use client";

import { useCopyToClipboard } from "@/hooks";
import { Badge } from "@/ui/badge";
import { Button } from "antd";
import { CalendarOutlined, InfoCircleOutlined } from "@ant-design/icons";

export function DiscountContent() {
  const vouchers = [
    { code: "SAVE100K", discount: "100.000đ", condition: "Đơn từ 5.000.000đ", expiry: "31/12/2025", type: "cash" },
    { code: "GIAMGIA50", discount: "50.000đ", condition: "Đơn từ 2.000.000đ", expiry: "25/12/2025", type: "cash" },
    { code: "FREESHIP", discount: "Miễn phí ship", condition: "Mọi đơn hàng", expiry: "30/12/2025", type: "shipping" },
    { code: "TECH200", discount: "200.000đ", condition: "Đơn từ 10.000.000đ", expiry: "31/01/2026", type: "cash" },
  ];

  const { copyFn } = useCopyToClipboard();

  const handleCopy = (code: string) => {
    copyFn(code);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 justify-center sm:justify-start">
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Kho Voucher</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {vouchers.map((voucher, index) => (
          <div
            key={index}
            className="group relative flex items-stretch h-32 transition-all hover:-translate-y-1"
          >
            {/* Cột trái: Hình ảnh/Icon giảm giá */}
            <div className={`relative flex flex-col items-center justify-center w-28 sm:w-32 rounded-l-xl border-y border-l text-white shrink-0 shadow-sm
              ${voucher.type === 'shipping' ? 'bg-gradient-to-br from-blue-500 to-cyan-400 border-blue-500' : 'bg-gradient-to-br from-red-500 to-rose-400 border-red-500'}
            `}>
              <div className="text-xs font-medium uppercase opacity-80 mb-1 leading-none">Giảm</div>
              <div className="text-lg sm:text-xl font-black whitespace-nowrap px-1">
                {voucher.type === 'shipping' ? '0đ' : voucher.discount.split('.')[0] + 'K'}
              </div>

              {/* Nét đứt ngăn cách (Dạng vé) */}
              <div className="absolute -right-[1px] top-2 bottom-2 border-r border-dashed border-white/40 z-10"></div>

              {/* Khoét lỗ hình bán nguyệt trên/dưới */}
              <div className="absolute -right-2 -top-2 w-4 h-4 bg-white rounded-full border border-primary/40 shadow-inner"></div>
              <div className="absolute -right-2 -bottom-2 w-4 h-4 bg-white rounded-full border border-gray-100 shadow-inner"></div>
            </div>

            {/* Cột phải: Nội dung chi tiết */}
            <div className="flex flex-col justify-between flex-grow p-4 border border-l-0 rounded-r-xl shadow-sm group-hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-foreground leading-tight line-clamp-1">
                      Giảm {voucher.discount}
                    </span>
                    <Badge className="bg-red-50 text-red-600 border-red-100 text-[10px] font-bold px-1.5 py-0 h-4">
                      {voucher.code}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-muted-foreground flex items-center gap-1">
                    <InfoCircleOutlined className="text-[10px]" /> {voucher.condition}
                  </p>
                </div>

                <Button
                  type="primary"
                  danger={voucher.type !== 'shipping'}
                  className={`hidden sm:flex items-center gap-1 font-bold text-xs h-8 px-3 rounded-lg shadow-none border-none
                    ${voucher.type === 'shipping' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}
                  `}
                  onClick={() => handleCopy(voucher.code)}
                >
                  LƯU MÃ
                </Button>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 lowercase">
                  <CalendarOutlined /> Hết hạn: {voucher.expiry}
                </div>

                {/* Nút sao chép cho Mobile (Khi nút Lưu Mã ẩn) */}
                <button
                  onClick={() => handleCopy(voucher.code)}
                  className="sm:hidden text-blue-500 text-xs font-bold"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}