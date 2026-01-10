"use client";

import { Button, Input, Select } from "antd";
import { SearchOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Separator } from "@/ui/separator";

const { Option } = Select;

// Định nghĩa interface filter cho News
export interface INewsFilters {
  page: number;
  limit: number;
  search: string;
  category?: string;
  isPublished?: boolean | string;
  sort?: string;
}

interface NewsFiltersProps {
  filters: INewsFilters;
  onFilterChange: (key: keyof INewsFilters, value: any) => void;
  onClearFilters: () => void;
}

export default function NewsFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: NewsFiltersProps) {
  return (
    <div className="py-2 !mb-6 bg-card rounded-xl border border-border/50 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-primary font-bold uppercase tracking-wider text-sm">
        <FilterOutlined />
        Bộ lọc bài viết
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Tìm kiếm văn bản */}
        <div className="md:col-span-1">
          <label className="block text-xs font-bold mb-2 text-muted-foreground uppercase">
            Tìm kiếm bài viết
          </label>
          <Input
            size="large"
            placeholder="Tiêu đề, tóm tắt..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            prefix={<SearchOutlined className="text-muted-foreground" />}
            allowClear
            className="rounded-lg border-slate-200 hover:border-primary focus:border-primary"
          />
        </div>

        {/* Lọc theo danh mục */}
        <div>
          <label className="block text-xs font-bold mb-2 text-muted-foreground uppercase">
            Danh mục
          </label>
          <Select
            size="large"
            placeholder="Tất cả danh mục"
            value={filters.category || undefined}
            onChange={(value) => onFilterChange("category", value)}
            allowClear
            className="w-full"
          >
            <Option value="Promotion">Khuyến mãi</Option>
            <Option value="Technology">Công nghệ</Option>
            <Option value="LifeStyle">Đời sống</Option>
            <Option value="System">Hệ thống</Option>
          </Select>
        </div>

        {/* Lọc theo trạng thái xuất bản */}
        <div>
          <label className="block text-xs font-bold mb-2 text-muted-foreground uppercase">
            Trạng thái hiển thị
          </label>
          <Select
            size="large"
            placeholder="Tất cả trạng thái"
            value={filters.isPublished === undefined ? undefined : String(filters.isPublished)}
            onChange={(value) => {
              const val = value === "true" ? true : value === "false" ? false : undefined;
              onFilterChange("isPublished", val);
            }}
            allowClear
            className="w-full"
          >
            <Option value="true">Đã công khai</Option>
            <Option value="false">Bản nháp</Option>
          </Select>
        </div>

        {/* Sắp xếp */}
        <div>
          <label className="block text-xs font-bold mb-2 text-muted-foreground uppercase">
            Sắp xếp theo
          </label>
          <Select
            size="large"
            placeholder="Mặc định"
            value={filters.sort || undefined}
            onChange={(value) => onFilterChange("sort", value)}
            allowClear
            className="w-full"
          >
            <Option value="newest">Mới nhất</Option>
            <Option value="oldest">Cũ nhất</Option>
            <Option value="most_viewed">Xem nhiều nhất</Option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-4 border-t border-dashed border-border">
        <Button
          size="middle"
          type="text"
          icon={<ReloadOutlined />}
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-destructive flex items-center font-medium"
        >
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  );
}