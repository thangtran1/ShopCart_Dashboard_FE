import React, { useState, useMemo, useEffect } from "react";
import { Table, Pagination, Select, Checkbox, Popover } from "antd";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Settings2 } from "lucide-react";
import { Button } from "@/ui/button";

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
  hiddenCopy = true,
  tableId,
}) => {
  const { t } = useTranslation();
  // Tạo ID duy nhất cho bảng để tránh lưu chồng chéo
  const uniqueId = useMemo(() => tableId || window.location.pathname.replace(/\//g, "_"), [tableId]);

  // 1. Helper nhận diện cột select
  const isSelectionCol = (col: any) => col.key === "select" || col.type === "selection";

  const getColKey = (col: any) => {
    if (isSelectionCol(col)) return "selection-col";
    return col.key || col.dataIndex || (typeof col.title === "string" ? col.title : "unnamed-col");
  };

  // 2. Danh sách các key có thể ẩn/hiện
  const filterableKeys = useMemo(() =>
    columns
      .filter((col) => (col.title && typeof col.title === "string") || isSelectionCol(col) || !col.title)
      .map((col) => getColKey(col)),
    [columns]
  );

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  // 3. Load/Save localStorage
  useEffect(() => {
    const fullConfig = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const savedConfig = fullConfig[uniqueId];
    if (savedConfig && Array.isArray(savedConfig)) {
      setVisibleColumns(savedConfig);
    } else {
      setVisibleColumns(filterableKeys);
    }
  }, [uniqueId, filterableKeys]);

  const handleUpdateVisibleColumns = (newKeys: string[]) => {
    setVisibleColumns(newKeys);
    const fullConfig = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    fullConfig[uniqueId] = newKeys;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConfig));
  };

  // 4. Logic cho checkbox "Chọn tất cả"
  const isAllChecked = filterableKeys.length > 0 && visibleColumns.length === filterableKeys.length;

  const onCheckAllChange = (e: any) => {
    handleUpdateVisibleColumns(e.target.checked ? filterableKeys : []);
  };

  // 5. Logic Columns (Chỉ Filter, KHÔNG sửa UI cột Select ở bảng)
  const enhancedColumns = useMemo(() => {
    return columns
      .filter((col) => {
        const canFilter = (col.title && typeof col.title === "string") || isSelectionCol(col);
        if (!canFilter) return true;
        return visibleColumns.includes(getColKey(col));
      })
      .map((col) => {
        // 1. Nếu tắt copy HOẶC là cột selection HOẶC là cột Action (không có dataIndex/key) thì không thêm logic copy
        if (hiddenCopy || isSelectionCol(col) || (!col.dataIndex && !col.key)) {
          return col;
        }

        return {
          ...col,
          onCell: (record: any) => ({
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              
              // Lấy giá trị data
              const value = col.dataIndex ? record[col.dataIndex] : null;
              if (value === null || value === undefined) return;

              // Định dạng ngày tháng nếu là ISO Date
              const isISODate = typeof value === "string" && value.includes("T") && value.endsWith("Z");
              const formattedValue = isISODate ? dayjs(value).format("DD/MM/YYYY HH:mm") : value;
              const content = String(formattedValue).trim();

              if (content) {
                navigator.clipboard.writeText(content);
                
                // Lấy tên cột để hiển thị Toast (Xử lý nếu title là JSX)
                const columnTitle = typeof col.title === "string" ? col.title : (col.key || "dữ liệu");
                
                toast.success(`${t("custom-table.copySuccess")} ${columnTitle}`, {
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

  // 6. Giao diện Popover (Có Chọn tất cả + Chữ "Cột chọn")
  const columnSelectionMenu = (
    <div className="p-1 min-w-[200px]">
      <div className="mb-2 font-bold text-[11px] text-foreground uppercase tracking-wider border-b pb-1">
        {t("custom-table.displayConfig")}
      </div>
      
      <div className="py-2 border-b mb-2">
        <Checkbox 
          onChange={onCheckAllChange} 
          checked={isAllChecked}
        >
          <span className="text-[13px] font-bold">{t("custom-table.selectAll")}</span>
        </Checkbox>
      </div>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <Checkbox.Group
          className="flex flex-col gap-2.5"
          value={visibleColumns}
          onChange={(v) => handleUpdateVisibleColumns(v as string[])}
        >
          {columns
            .filter((col) => (col.title && typeof col.title === "string") || isSelectionCol(col) || !col.title)
            .map((col) => {
              const key = getColKey(col);
              let label = typeof col.title === "string" ? col.title : "";
              
              if (isSelectionCol(col)) label = t("custom-table.selectCol");
              if (!label && !isSelectionCol(col)) label = t("custom-table.action");

              return (
                <Checkbox key={key} value={key}>
                  <span className="text-[13px]">{label}</span>
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

      <div className="flex justify-end items-center mb-4">
        <Popover content={columnSelectionMenu} trigger="click" placement="bottomRight" arrow={false}>
          <Button className="cursor-pointer hover:bg-primary/10" variant="secondary">
            <Settings2 className="w-4 h-4 mr-2" />
            {t("custom-table.columns")}
          </Button>
        </Popover>
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
            <div className="flex gap-5 items-center">
            <div>
              {t("custom-table.total")}{" "}
              <span className="font-semibold text-primary">{pagination?.total || 0}</span> {t("custom-table.items")}
            </div>
              <Select value={pagination?.limit} onChange={(value) => onPageChange(1, value)} style={{ width: 80 }}>
                {[10, 20, 50, 100].map((size) => (
                  <Select.Option key={size} value={size}>
                    {size}
                  </Select.Option>
                ))}
              </Select>
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