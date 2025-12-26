import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";

interface Address {
  id: number;
  label: string;
  address: string;
  isDefault?: boolean;
}

interface AddressSectionProps {
  onAdd: () => void;
  onEdit: (address: Address) => void;
}

export default function AddressSection({ onAdd, onEdit }: AddressSectionProps) {
  const addresses: Address[] = [
    {
      id: 1,
      label: "Nhà",
      address: "Admin123@, Thị trấn Núi Sập, Huyện Thoại Sơn, An Giang",
      isDefault: true,
    },
    {
      id: 2,
      label: "Văn phòng",
      address: "123 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, TP.HCM",
    },
  ];

  return (
    <div className="rounded-xl border p-5 shadow-sm space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sổ địa chỉ</h2>

        <Button type="primary" icon={<PlusCircleOutlined />} onClick={onAdd}>
          Thêm địa chỉ
        </Button>
      </div>

      {/* Address list */}
      <div className="space-y-0">
        {addresses.map((item, idx) => (
          <div
            key={item.id}
            className={`transition pb-4 pt-4 ${
              idx < addresses.length - 1 ? "border-b border-error/40" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.label}</span>
                {item.isDefault && <Tag color="red">Mặc định</Tag>}
              </div>

              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => onEdit(item)}
              >
                Cập nhật
              </Button>
            </div>

            {/* Address */}
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {item.address}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
