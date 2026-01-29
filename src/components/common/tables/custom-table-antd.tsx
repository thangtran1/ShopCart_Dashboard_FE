import React, { useState, useMemo, useEffect } from "react";
import { Table, Pagination, Select, Checkbox, Popover, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

interface TableAntdProps {
  columns: any[];
  data: any[];
  loading?: boolean;
  pagination?: { page: number; limit: number; total: number };
  onPageChange: (page: number, pageSize?: number) => void;
  onRowClick?: (record: any) => void;
  onRowHover?: (record: any) => void;
  hiddenCopy?: boolean;
  tableId?: string; // ID để phân biệt các bảng, nếu không có sẽ dùng đường dẫn URL
}

const STORAGE_KEY = "APP_TABLE_CONFIG";

const TableAntd: React.FC<TableAntdProps> = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onRowClick,
  onRowHover,
  hiddenCopy = false,
  tableId,
}) => {
  const { t } = useTranslation();

  // Tạo ID duy nhất cho bảng để tránh lưu chồng chéo
  const uniqueId = useMemo(() => tableId || window.location.pathname.replace(/\//g, "_"), [tableId]);

  // 1. Lấy danh sách các key có thể ẩn/hiện (Chỉ lấy cột có title là string, bỏ qua checkbox selection)
  const filterableKeys = useMemo(() =>
    columns
      .filter((col) => col.title && typeof col.title === "string" && col.type !== "selection")
      .map((col) => col.key || col.dataIndex || col.title),
    [columns]
  );

  // 2. State quản lý các cột hiển thị
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  // 3. Effect: Load cấu hình từ Object tập trung trong localStorage
  useEffect(() => {
    const fullConfig = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const savedConfig = fullConfig[uniqueId];

    if (savedConfig && Array.isArray(savedConfig)) {
      setVisibleColumns(savedConfig);
    } else {
      // MẶC ĐỊNH: Hiện tất cả nếu chưa có cấu hình lưu trữ
      setVisibleColumns(filterableKeys);
    }
  }, [uniqueId, filterableKeys]);

  // Hàm cập nhật cấu hình vào Object chung
  const handleUpdateVisibleColumns = (newKeys: string[]) => {
    setVisibleColumns(newKeys);
    const fullConfig = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    fullConfig[uniqueId] = newKeys;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConfig));
  };

  // 4. Logic cho checkbox "Chọn tất cả"
  const isAllChecked = filterableKeys.length > 0 && visibleColumns.length === filterableKeys.length;
  const isIndeterminate = visibleColumns.length > 0 && visibleColumns.length < filterableKeys.length;

  const onCheckAllChange = (e: any) => {
    handleUpdateVisibleColumns(e.target.checked ? filterableKeys : []);
  };

  // 5. GIỮ NGUYÊN LOGIC CŨ: Filter và Map logic copy cho columns
  const enhancedColumns = useMemo(() => {
    return columns
      .filter((col) => {
        // Luôn hiện cột selection, thao tác hoặc cột không có title string
        if (!col.title || typeof col.title !== "string" || col.key === "actions" || col.type === "selection" || col.title === "THAO TÁC") {
          return true;
        }
        const key = col.key || col.dataIndex || col.title;
        return visibleColumns.includes(key);
      })
      .map((col) => {
        // Logic copy cũ của bạn giữ nguyên
        if (hiddenCopy || col.key === "actions" || col.title === "THAO TÁC" || col.type === "selection") return col;

        return {
          ...col,
          onCell: (record: any) => ({
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              const value = col.dataIndex ? record[col.dataIndex] : record.title;
              const isISODate = typeof value === "string" && value.includes("T") && value.endsWith("Z");
              const formattedValue = isISODate ? dayjs(value).format("DD/MM/YYYY HH:mm") : value;
              const content = String(formattedValue || "").trim();

              if (content) {
                navigator.clipboard.writeText(content);
                toast.success(`${t("custom-table.copySuccess")} ${col.title}`, {
                  description: content,
                  duration: 2000,
                });
              }
            },
            className: "copyable-cell",
          }),
        };
      });
  }, [columns, visibleColumns, hiddenCopy, t]);

  // 6. Giao diện Menu Popover
  const columnSelectionMenu = (
    <div className="p-1 min-w-[200px]">
      <div className="mb-2 font-bold text-[11px] text-gray-400 uppercase tracking-wider border-b pb-1">
        {t("custom-table.displayConfig", "Cấu hình hiển thị")}
      </div>
      <div className="py-2 border-b mb-2">
        <Checkbox indeterminate={isIndeterminate} onChange={onCheckAllChange} checked={isAllChecked}>
          <span className="text-[13px] font-bold">Chọn tất cả hiển thị</span>
        </Checkbox>
      </div>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <Checkbox.Group
          className="flex flex-col gap-2.5"
          value={visibleColumns}
          onChange={(v) => handleUpdateVisibleColumns(v as string[])}
        >
          {columns
            .filter((col) => col.title && typeof col.title === "string" && col.type !== "selection")
            .map((col) => {
              const key = col.key || col.dataIndex || col.title;
              return (
                <Checkbox key={key} value={key}>
                  <span className="text-[13px]">{col.title}</span>
                </Checkbox>
              );
            })}
        </Checkbox.Group>
      </div>
    </div>
  );

  return (
    <div className="mb-4">
      {!hiddenCopy && (
        <style>{`
          .copyable-cell { cursor: copy !important; transition: all 0.2s ease-in-out; }
          .copyable-cell:hover {
            background-color: rgba(59, 130, 246, 0.1) !important;
            box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.2);
          }
        `}</style>
      )}

      <div className="flex justify-between items-center mb-4 gap-3">
        {/* Nút Cấu hình cột */}
        <Popover content={columnSelectionMenu} trigger="click" placement="bottomLeft" arrow={false}>
          <Button icon={<SettingOutlined />} className="flex items-center">
            {t("custom-table.columns", "Cấu hình cột")}
          </Button>
        </Popover>

        <div className="flex items-center gap-3">
          <div className="font-medium text-muted-foreground">{t("custom-table.rowsPerPage")}</div>
          <Select value={pagination?.limit} onChange={(value) => onPageChange(1, value)} style={{ width: 80 }}>
            {[10, 20, 50, 100].map((size) => (
              <Select.Option key={size} value={size}>
                {size}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <Table
        columns={enhancedColumns}
        dataSource={data}
        rowKey={(record) => record._id || record.id || Math.random()}
        loading={loading}
        pagination={false}
        scroll={{
          x: data.length > 0 ? "max-content" : 1000, // Nếu trống thì ép nó rộng 1000px để header dãn ra
          y: 500
        }}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          onMouseEnter: () => onRowHover?.(record),
          style: { cursor: onRowClick || onRowHover ? "pointer" : "default" },
        })}
        footer={() => (
          <div className="flex justify-between items-center px-2">
            <div>
              {t("custom-table.total")}{" "}
              <span className="font-semibold text-primary">{pagination?.total || 0}</span> {t("custom-table.items")}
            </div>
            <Pagination
              current={pagination?.page}
              pageSize={pagination?.limit}
              total={pagination?.total}
              showQuickJumper={false}
              onChange={onPageChange}
            />
          </div>
        )}
      />
    </div>
  );
};

export default TableAntd;