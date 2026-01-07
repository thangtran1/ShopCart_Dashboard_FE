import { Table, Pagination, Select } from "antd";

interface TableAntdProps {
  columns: any[];
  data: any[];
  loading?: boolean;
  pagination?: { page: number; limit: number; total: number };
  onPageChange: (page: number, pageSize?: number) => void;
  onRowClick?: (record: any) => void;
  onRowHover?: (record: any) => void;
}

const TableAntd: React.FC<TableAntdProps> = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onRowClick,
  onRowHover,
}) => {
  return (
    <div className="mb-4">
      {/* PageSize selector góc trên bên phải */}
      <div className="flex justify-end items-center mb-4 gap-3">
        <div className="text-base font-medium text-gray-600">
          Số hàng mỗi trang:
        </div>
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
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false} // tắt pagination mặc định
        scroll={{ x: 800, y: 500 }}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),    // click row
          onMouseEnter: () => onRowHover?.(record), // hover row (nếu muốn)
          style: { cursor: onRowClick || onRowHover ? "pointer" : "default" },
        })}
        footer={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* showTotal góc dưới bên trái */}
            <div>{`Tổng cộng ${pagination?.total} mục`}</div>

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
