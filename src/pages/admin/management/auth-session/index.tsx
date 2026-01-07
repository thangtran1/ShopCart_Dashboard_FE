import React, { useState, useEffect } from "react";
import { Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Separator } from "@/ui/separator";
import TableAntd from "@/components/common/tables/custom-table-antd";
import FilterSearch from "./components/filter-search";
import { useAuthSession } from "./components/useAuthSession";

const AuthSessionManagement: React.FC = () => {
  const {
    authSessions,
    loading,
    pagination,
    searchOptions,
    handleFilterChange,
    clearFilters,
    onPageChange,
  } = useAuthSession();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );

  // Sync local state with searchOptions from hook
  useEffect(() => {
    setSearchText(searchOptions.keyword || "");
    setSelectedType(searchOptions.sessionStatus || "");
    if (searchOptions.from && searchOptions.to) {
      setDateRange([dayjs(searchOptions.from), dayjs(searchOptions.to)]);
    } else {
      setDateRange(null);
    }
  }, [searchOptions]);

  const handleSearchClick = () => {
    const searchParams: any = {};

    if (searchText.trim()) {
      searchParams.keyword = searchText.trim();
    }

    if (selectedType) {
      searchParams.sessionStatus = selectedType;
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      searchParams.from = dateRange[0].format("YYYY-MM-DD");
      searchParams.to = dateRange[1].format("YYYY-MM-DD");
    }

    handleFilterChange(searchParams);
  };

  const handleClearFilter = () => {
    setSearchText("");
    setSelectedType("");
    setDateRange(null);
    clearFilters();
  };

  const renderWithTooltip = (text?: string) =>
    text ? (
      <Tooltip placement="topLeft" title={text}>
        <span className="truncate block max-w-[140px]">{text}</span>
      </Tooltip>
    ) : (
      "-"
    );

  const columns = [
    {
      title: t("management.auth-session.user-name"),
      dataIndex: "userName",
      key: "userName",
      ellipsis: true,
      render: (text: string) => renderWithTooltip(text),
    },
    {
      title: t("management.auth-session.email"),
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      render: (text: string) => renderWithTooltip(text),
    },

    {
      title: t("management.auth-session.browser"),
      dataIndex: "userAgent",
      key: "userAgent",
      ellipsis: true,
      render: (text: string) => renderWithTooltip(text),
    },
    {
      title: t("management.auth-session.ip"),
      dataIndex: "ip",
      key: "ip",
      width: 150,
      ellipsis: true,
      render: (text: string) => renderWithTooltip(text),
    },
    {
      title: t("management.auth-session.last-activity-time"),
      dataIndex: "lastActivityTime",
      key: "lastActivityTime",
      ellipsis: true,
      render: (text: string) => (
        <div className="flex flex-col">
          {renderWithTooltip(dayjs(text).format("DD/MM/YYYY "))}
          {renderWithTooltip(dayjs(text).format("HH:mm:ss"))}
        </div>
      ),
    },
    {
      title: t("management.auth-session.status"),
      dataIndex: "sessionStatus",
      key: "sessionStatus",
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tag
          color={
            text === "active" ? "green" : text === "revoked" ? "red" : "orange"
          }
          style={{ borderRadius: 6, textTransform: "capitalize" }}
        >
          {t(`management.auth-session.${text}`)}
        </Tag>
      ),
    },
  ];

  return (
    <div className="bg-card text-card-foreground px-6 flex flex-col gap-6 rounded-xl border shadow-sm">
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("management.auth-session.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("management.auth-session.description")}
            </p>
          </div>
        </div>
      </div>
      <Separator />

      <FilterSearch
        searchText={searchText}
        setSearchText={setSearchText}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        handleSearchClick={handleSearchClick}
        handleClearFilter={handleClearFilter}
      />

      <Separator />

      <div className="overflow-x-auto">
        <TableAntd
          columns={columns}
          data={authSessions}
          loading={loading}
          pagination={pagination}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default AuthSessionManagement;
