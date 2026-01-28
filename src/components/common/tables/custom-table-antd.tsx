import React from "react";
import { Table, Pagination, Select } from "antd";
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
}

const TableAntd: React.FC<TableAntdProps> = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onRowClick,
  onRowHover,
  hiddenCopy = false, // Mặc định là false (cho phép copy)
}) => {
  const { t } = useTranslation()
  const enhancedColumns = columns.map((col) => {
    // Nếu hiddenCopy = true HOẶC là cột Thao tác thì không thêm logic copy
    if (hiddenCopy || col.key === "actions" || col.title === "THAO TÁC") return col;

    return {
      ...col,
      onCell: (record: any) => ({
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          const value = col.dataIndex ? record[col.dataIndex] : record.title;
          // Nếu value là chuỗi ngày tháng ISO, format lại thành DD/MM/YYYY HH:mm
          const isISODate = typeof value === "string" && value.includes("T") && value.endsWith("Z");
          const formattedValue = isISODate ? dayjs(value).format("DD/MM/YYYY HH:mm") : value;
          const content = String(formattedValue || "").trim();

          if (content) {
            navigator.clipboard.writeText(content);
            toast.success(`${t("custom-table.copySuccess")} ${col.title}`, { 
              description: content,
              duration: 2000 
            });
          }
        },
        className: "copyable-cell",
      }),
    };
  });

  return (
    <div className="mb-4">
      {/* Chỉ render style hover nếu KHÔNG ẩn copy */}
      {!hiddenCopy && (
        <style>{`
          .copyable-cell {
            cursor: copy !important;
            transition: all 0.2s ease-in-out;
          }
          .copyable-cell:hover {
            background-color: rgba(59, 130, 246, 0.1) !important;
            box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.2);
          }
        `}</style>
      )}

      <div className="flex justify-end items-center mb-4 gap-3">
        <div className="font-medium text-muted-foreground">{t("custom-table.rowsPerPage")}</div>
        <Select
          value={pagination?.limit}
          onChange={(value) => onPageChange(1, value)}
          style={{ width: 80 }}
        >
          {[10, 20, 50, 100].map((size) => (
            <Select.Option key={size} value={size}>
              {size}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Table
        columns={enhancedColumns}
        dataSource={data}
        rowKey={(record) => record._id || record.id || Math.random()}
        loading={loading}
        pagination={false} // tắt pagination mặc định
        scroll={{ 
          x: data.length > 0 ? "max-content" : 1000, // Nếu trống thì ép nó rộng 1000px để header dãn ra
          y: 500 
        }}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),    // click row
          onMouseEnter: () => onRowHover?.(record), // hover row (nếu muốn)
          style: { cursor: onRowClick || onRowHover ? "pointer" : "default" },
        })}
        footer={() => (
          <div className="flex justify-between items-center px-2">
            {/* showTotal góc dưới bên trái */}
            <div>
            {t("custom-table.total")}{" "} <span className="font-semibold text-primary">{pagination?.total || 0}</span> {t("custom-table.items")}
            </div>
            {/* Pagination góc dưới bên phải */}
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
