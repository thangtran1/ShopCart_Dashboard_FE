"use client";

import { Button, Input, Select } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { SurveyFilters } from "@/api/services/customer-survey";
import { useTranslation } from "react-i18next";

interface CustomerSurveyFiltersProps {
  filters: SurveyFilters;
  onFilterChange: (key: keyof SurveyFilters, value: any) => void;
  onClearFilters: () => void;
}

export default function CustomerSurveyFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: CustomerSurveyFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center gap-3">
      <div className="w-[300px]"> 
        <Input
          size="large"
          placeholder={t('management.customer-survey.filters.search_placeholder')}
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          prefix={<SearchOutlined className="text-muted-foreground mr-1" />}
          allowClear
          className="rounded-xl border-slate-200 shadow-sm h-11"
        />
      </div>

      <div className="w-[200px]">
        <Select
          size="large"
          className="w-full h-11"
          placeholder={t('management.customer-survey.filters.type_all')}
          value={filters.type || undefined}
          onChange={(value) => onFilterChange("type", value)}
          allowClear
          variant="outlined"
          style={{ borderRadius: '12px' }}
        >
          <Select.Option value="single">{t('management.customer-survey.filters.type_single')}</Select.Option>
          <Select.Option value="multiple">{t('management.customer-survey.filters.type_multiple')}</Select.Option>
        </Select>
      </div>

      <Button 
        size="large" 
        className="rounded-xl font-medium flex items-center gap-2 border-slate-200 hover:text-primary h-11 bg-white shadow-sm transition-all active:scale-95"
        onClick={onClearFilters}
        icon={<ReloadOutlined />}
      >
        {t('management.customer-survey.filters.reset')}
      </Button>
    </div>
  );
}