import { Button, Input, DatePicker } from "antd";
const { RangePicker } = DatePicker;
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface FilterSearchProps {
  searchText: string;
  setSearchText: (value: string) => void;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  setDateRange: (value: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  handleSearchClick: () => void;
  handleClearFilter: () => void;
}

export default function FilterSearch({
  searchText,
  setSearchText,
  dateRange,
  setDateRange,
  handleSearchClick,
  handleClearFilter,
}: FilterSearchProps) {
  const { t } = useTranslation();


  return (
    <div className="grid grid-cols-1 items-end gap-4 pb-5 md:grid-cols-2 xl:grid-cols-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {t("feedback.search")}
        </label>
        <Input
          size="large"
          placeholder={t("feedback.search-placeholder")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          {t("feedback.date-range")}
        </label>
        <RangePicker
          size="large"
          allowClear
          style={{ width: "100%" }}
          value={dateRange}
          onChange={(dates) =>
            setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)
          }
        />
      </div>
      <div className="flex gap-2">
        <Button danger size="large" onClick={handleClearFilter}>
          {t("feedback.clear-filter")}
        </Button>
        <Button
          size="large"
          color="primary"
          variant="outlined"
          onClick={handleSearchClick}
        >
          {t("feedback.search")}
        </Button>
      </div>
    </div>
  );
}
