import { addressService } from "@/api/services/addressesApi";
import { useEffect, useState } from "react";
import { HomeOutlined, BankOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Badge, Popconfirm } from "antd";
import { useAddressActions } from "@/hooks/useAddresses";
import { EmptyState } from "@/components/common/EmptyState";

interface AddressItem {
    _id: string;
    full_address: string;
    is_default: boolean;
    title: string;
    type: number;
    member_id: {
        _id: string;
        name: string;
        phone: string;
    };
}

export default function Address({ userId }: { userId: string }) {
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const { deleteAddressAdmin } = useAddressActions();

    const hasMoreThanFour = addresses.length > 4;
    const displayAddresses = isExpanded ? addresses : addresses.slice(0, 4);

    useEffect(() => {
        if (!userId) return;

        const fetchAddresses = async () => {
            try {
                const res = await addressService.getByIdUserForAdmin(userId);
                setAddresses(res.data || []);
            } catch (error) {
                console.error("Lấy địa chỉ thất bại:", error);
            }
        };

        fetchAddresses();
    }, [userId]);

    const onDelete = async (id: string) => {
        try {
            await deleteAddressAdmin(id);
            setAddresses(prev => prev.filter(addr => addr._id !== id));
        } catch (error) {
            console.error("Xóa địa chỉ thất bại:", error);
        }
    };

    return (
        <div className="w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold">Sổ địa chỉ</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Danh sách các địa điểm nhận hàng của người dùng
                    </p>
                </div>
            </div>

            {addresses.length === 0 ? (
                <EmptyState
                    height="sm" 
                    title="Trống" 
                    description="Người dùng chưa có địa chỉ nào" 
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
                        {displayAddresses.map((item) => {
                            console.log("🚀 ~ Address ~ item:", item)
                            return <div
                                key={item._id}
                                className="group relative p-4 border border-border rounded-2xl hover:border-error/20 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        {item.is_default && <Badge status="success" text="Mặc định" />}
                                        {item.type === 1 ? (
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium border border-orange-100">
                                                <HomeOutlined className="text-[10px]" /> Nhà riêng
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium border border-indigo-100">
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
                                        <span className="text-foreground">{item.member_id.name}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span className="flex items-center gap-1">{item.member_id.phone}</span>
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
                                        <Button type="text" size="small" className="!text-red-600 transition-colors">
                                            Xóa
                                        </Button>
                                    </Popconfirm>
                                </div>
                            </div>;
                        })}
                    </div>

                    {hasMoreThanFour && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="group flex items-center gap-3 px-6 py-2 cursor-pointer border border-border hover:border-primary/40 rounded-full transition-all duration-300"
                            >
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-foreground transition-colors">
                                    {isExpanded ? "Thu gọn" : `Xem thêm (${addresses.length - 4})`}
                                </span>

                                <div
                                    className={`flex items-center justify-center transition-all duration-500 group-hover:translate-y-0.5 ${isExpanded ? "rotate-180" : ""
                                        }`}
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
