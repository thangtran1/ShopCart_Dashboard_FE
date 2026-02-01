"use client";

import { Button, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ICouponFilters } from "@/api/services/couponApi";
import { Separator } from "@/ui/separator";

const { Option } = Select;

interface CouponFiltersProps {
  filters: ICouponFilters;
  onFilterChange: (key: keyof ICouponFilters, value: any) => void;
  onClearFilters: () => void;
}

export default function CouponFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: CouponFiltersProps) {
  return (
    <div className="py-2 border-t border-border pt-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Tìm kiếm Voucher
          </label>
          <Input
            size="large"
            placeholder="Mã voucher hoặc nội dung..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Tình trạng thực tế
          </label>
          <Select
            size="large"
            placeholder="Tất cả tình trạng"
            value={filters.status || undefined}
            onChange={(value) => onFilterChange("status", value)}
            allowClear
            className="w-full"
          >
            <Option value="active">Khả dụng</Option>
            <Option value="expired">Hết hạn</Option>
            <Option value="outOfStock">Hết lượt dùng</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Trạng thái kích hoạt
          </label>
          <Select
            size="large"
            placeholder="Tất cả trạng thái"
            value={filters.isActive === undefined ? undefined : String(filters.isActive)}
            onChange={(value) => {
              const val = value === "true" ? true : value === "false" ? false : undefined;
              onFilterChange("isActive", val);
            }}
            allowClear
            className="w-full"
          >
            <Option value="true">Đang bật (ON)</Option>
            <Option value="false">Tạm dừng (OFF)</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Loại ưu đãi
          </label>
          <Select
            size="large"
            placeholder="Tất cả loại"
            value={filters.discountType || undefined}
            onChange={(value) => onFilterChange("discountType", value)}
            allowClear
            className="w-full"
          >
            <Option value="percentage">Giảm theo %</Option>
            <Option value="fixed">Số tiền cố định</Option>
          </Select>
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

      <Separator className="mt-6" />
    </div>
  );
}