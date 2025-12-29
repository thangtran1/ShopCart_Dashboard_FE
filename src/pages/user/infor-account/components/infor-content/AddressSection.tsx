import { useState } from "react";
import { Address } from "@/api/services/addressesApi";
import {
  PlusOutlined,
  HomeOutlined,
  BankOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Skeleton, Empty } from "antd";
import { Badge } from "@/ui/badge";

interface AddressSectionProps {
  addresses: Address[];
  isFetching: boolean;
  onAdd: () => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function AddressSection({
  addresses,
  isFetching,
  onAdd,
  onEdit,
  onDelete,
}: AddressSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayAddresses = isExpanded ? addresses : addresses.slice(0, 4);
  const hasMoreThanFour = addresses.length > 4;

  if (isFetching) {
    return (
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Sổ địa chỉ</h2>
          <p className="text-muted-foreground text-sm">
            Quản lý các địa điểm nhận hàng của bạn
          </p>
        </div>

        <Button
          type="primary"
          danger
          shape="round"
          size="middle"
          icon={<PlusOutlined />}
          className="
      w-full sm:w-auto
      shadow-md shadow-red-100
      hover:scale-105 transition-transform
      border-none
      flex items-center justify-center
    "
          onClick={onAdd}
        >
          Thêm địa chỉ
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div
          className="
          py-16 flex flex-col items-center justify-center 
          bg-zinc-50/50 dark:bg-zinc-900/30 
          rounded-[2rem] border-1 border-dashed border-border
          transition-all duration-300
        "
        >
          <Empty
            className="!mb-4"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Trống
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  Bạn chưa lưu địa chỉ nhận hàng nào
                </span>
              </div>
            }
          />

          <button
            onClick={onAdd}
            className="text-sm font-bold cursor-pointer text-primary/80 hover:text-primary underline-offset-4 hover:underline transition-all"
          >
            Tạo địa chỉ đầu tiên ngay
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
            {displayAddresses.map((item) => (
              <div
                key={item._id}
                className="group relative p-4 border border-border rounded-2xl hover:border-error/20 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {item.is_default && (
                      <Badge variant={"info"}>Mặc định</Badge>
                    )}
                    {item.type === 1 ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-medium border border-orange-100 dark:border-orange-900/50">
                        <HomeOutlined className="text-[10px]" /> Nhà riêng
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium border border-indigo-100 dark:border-indigo-900/50">
                        <BankOutlined className="text-[10px]" /> Công ty
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground transition-colors uppercase tracking-tight">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-3 text-muted-foreground font-semibold">
                    <span className="text-foreground">
                      {item.member_id.name}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1">
                      {item.member_id.phone}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-6 line-clamp-2 min-h-[48px]">
                    {item.full_address}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-border flex justify-end items-center gap-2">
                  <Popconfirm
                    title="Xóa địa chỉ này?"
                    description="Hành động này không thể hoàn tác."
                    onConfirm={() => onDelete(item._id)}
                    okText="Xóa ngay"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true, className: "rounded-lg" }}
                  >
                    <Button
                      type="text"
                      size="small"
                      className="!text-red-600 transition-colors"
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                  <div className="w-[1px] h-3 bg-border" />
                  <Button
                    type="text"
                    size="small"
                    className="text-blue-500 hover:text-blue-600 font-bold"
                    onClick={() => onEdit(item)}
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {hasMoreThanFour && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="
                  group flex items-center gap-3 px-6 py-2
                 cursor-pointer
                 border border-border
                 hover:border-primary/40
                  rounded-full transition-all duration-300
                "
              >
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-foreground transition-colors">
                  {isExpanded
                    ? "Thu gọn"
                    : `Xem thêm (${addresses.length - 4})`}
                </span>

                <div
                  className={`
                    flex items-center justify-center
                    transition-all duration-500
                    group-hover:translate-y-0.5
                    ${isExpanded ? "rotate-180" : ""}
                  `}
                >
                  <DownOutlined className="text-[10px] text-zinc-400 group-hover:text-foreground" />
                </div>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}