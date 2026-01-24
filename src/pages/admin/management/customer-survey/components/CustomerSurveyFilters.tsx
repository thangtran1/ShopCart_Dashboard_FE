"use client";

import { Button, Input } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { SurveyFilters } from "@/api/services/customer-survey";

interface CustomerSurveyFiltersProps {
  filters: SurveyFilters;
  onFilterChange: (key: keyof SurveyFilters, value: any) => void;
  onClearFilters: () => void;
  placeholder?: string;
}

export default function CustomerSurveyFilters({
  filters,
  onFilterChange,
  onClearFilters,
  placeholder = "Tìm kiếm...",
}: CustomerSurveyFiltersProps) {
  return (
    <div className="flex flex-row items-center gap-3">
      <div className="w-[350px]"> 
        <Input
          size="large"
          placeholder={placeholder}
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          prefix={<SearchOutlined className="text-muted-foreground mr-1" />}
          allowClear
          className="rounded-xl border-slate-200 shadow-sm h-11"
        />
      </div>

      <Button 
        size="large" 
        className="rounded-xl font-medium flex items-center gap-2 border-slate-200 hover:text-red-500 h-11 bg-white"
        onClick={onClearFilters}
        icon={<ReloadOutlined />}
      >
        Làm mới
      </Button>
    </div>
  );
}