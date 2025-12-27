import { Address } from "@/api/services/addressesApi";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Tag, Popconfirm, Skeleton, Empty } from "antd";

interface AddressSectionProps {
  addresses: Address[]; // Dữ liệu từ hook
  isFetching: boolean;  // Trạng thái loading từ hook
  onAdd: () => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => Promise<void>; // Hàm delete từ hook
}

export default function AddressSection({ 
  addresses, 
  isFetching, 
  onAdd, 
  onEdit, 
  onDelete 
}: AddressSectionProps) {

  // Hiển thị loading khi đang lấy dữ liệu
  if (isFetching) {
    return (
      <div className="rounded-xl border p-5 shadow-sm space-y-4 dark:bg-muted">
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-5 shadow-sm space-y-2 relative overflow-hidden dark:bg-muted">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Sổ địa chỉ</h2>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={onAdd}
        >
          Thêm địa chỉ
        </Button>
      </div>

      <div className="space-y-0">
        {addresses.length === 0 ? (
          <Empty description="Bạn chưa có địa chỉ nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          addresses.map((item, idx) => (
            <div
              key={item._id}
              className={`transition pb-4 pt-4 ${
                idx < addresses.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Dùng title hoặc type để làm label */}
                  <span className="font-medium">{item.title || "Địa chỉ"}</span>
                  {item.is_default && <Tag color="red">Mặc định</Tag>}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(item)}
                  >
                    Cập nhật
                  </Button>
                  
                  {/* Thêm xác nhận xóa */}
                  <Popconfirm
                    title="Xóa địa chỉ"
                    description="Bạn có chắc chắn muốn xóa địa chỉ này không?"
                    onConfirm={() => onDelete(item._id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="link"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {item.full_address}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}