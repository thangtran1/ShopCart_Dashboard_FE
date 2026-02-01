"use client";

import { Button, Input, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { AdminOrderQuery } from "@/api/services/orderApi";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface OrdersFiltersProps {
  filters: AdminOrderQuery;
  onFilterChange: (key: keyof AdminOrderQuery, value: any) => void;
  onClearFilters: () => void;
}

export default function OrdersFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: OrdersFiltersProps) {
  return (
    <div className="py-2 border-y border-border py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Tìm kiếm đơn hàng
          </label>
          <Input
            size="large"
            placeholder="Mã đơn, Email, SĐT..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Trạng thái xử lý
          </label>
          <Select
            size="large"
            placeholder="Tất cả trạng thái"
            value={filters.status || undefined}
            onChange={(value) => onFilterChange("status", value)}
            allowClear
            className="w-full"
          >
            <Option value="pending">Chờ duyệt</Option>
            <Option value="processing">Đang xử lý</Option>
            <Option value="shipped">Đang giao hàng</Option>
            <Option value="delivered">Đã hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Thanh toán
          </label>
          <Select
            size="large"
            placeholder="Phương thức"
            value={filters.paymentMethod || undefined}
            onChange={(value) => onFilterChange("paymentMethod", value)}
            allowClear
            className="w-full"
          >
            <Option value="COD">Tiền mặt (COD)</Option>
            <Option value="STRIPE">Stripe (Thẻ)</Option>
            <Option value="PAYPAL">Paypal</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Khoảng thời gian
          </label>
          <RangePicker
            size="large"
            className="w-full"
            placeholder={["Từ ngày", "Đến ngày"]}
            value={
              filters.startDate && filters.endDate
                ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                : null
            }
            onChange={(dates) => {
              if (dates) {
                onFilterChange("startDate", dates[0]?.toISOString());
                onFilterChange("endDate", dates[1]?.toISOString());
              } else {
                onFilterChange("startDate", undefined);
                onFilterChange("endDate", undefined);
              }
            }}
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          size="large"
          danger
          onClick={onClearFilters}
          className="px-8 font-medium"
        >
          Xóa tất cả bộ lọc
        </Button>
      </div>
    </div>
  );
}