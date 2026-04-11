"use client";

import { Button, Select } from "antd";

const { Option } = Select;

interface FlashSalesFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}

export default function FlashSalesFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: FlashSalesFiltersProps) {
  return (
    <div className="py-2 border-y border-border py-6 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Lọc theo trạng thái
          </label>
          <Select
            size="large"
            placeholder="Tất cả trạng thái"
            value={filters.status || undefined}
            onChange={(value) => onFilterChange("status", value)}
            allowClear
            className="w-full"
          >
            <Option value="UPCOMING">Sắp diễn ra</Option>
            <Option value="RUNNING">Đang chạy</Option>
            <Option value="PAUSED">Tạm dừng</Option>
            <Option value="ENDED">Đã kết thúc</Option>
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
    </div>
  );
}
