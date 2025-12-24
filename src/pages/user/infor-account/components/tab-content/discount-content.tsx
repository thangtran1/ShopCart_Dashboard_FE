"use client";

import { useCopyToClipboard } from "@/hooks";
import { Badge } from "@/ui/badge";
import { Button } from "antd";

export function DiscountContent() {
  const vouchers = [
    { code: "SAVE100K", discount: "100.000đ", condition: "Đơn từ 5.000.000đ", expiry: "31/12/2025" },
    { code: "GIAMGIA50", discount: "50.000đ", condition: "Đơn từ 2.000.000đ", expiry: "25/12/2025" },
    { code: "FREESHIP", discount: "Miễn phí ship", condition: "Mọi đơn hàng", expiry: "30/12/2025" },
    { code: "TECH200", discount: "200.000đ", condition: "Đơn từ 10.000.000đ", expiry: "31/01/2026" },
  ];

  const { copyFn } = useCopyToClipboard();

  return (
    <div className="rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-2 text-center sm:text-left">Mã giảm giá</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vouchers.map((voucher, index) => (
          <div
            key={index}
            className="border border-dashed border-border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
              <div>
                <div className="text-2xl font-bold text-foreground mb-1">{voucher.discount}</div>
                <Badge variant="success">{voucher.code}</Badge>
              </div>
              <Button className="mt-2 sm:mt-0" onClick={() => copyFn(voucher.code)}>
                Sao chép
              </Button>
            </div>

            <div className="text-sm text-foreground space-y-1">
              <p>📦 {voucher.condition}</p>
              <p>📅 HSD: {voucher.expiry}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
