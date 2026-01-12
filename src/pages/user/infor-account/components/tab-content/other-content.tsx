"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "antd";
import {
  HistoryOutlined,
} from "@ant-design/icons";
import Contact from "@/pages/user/contact";
import TermsPage from "@/pages/user/public/terms";
import ActivityLogs from "@/pages/admin/management/user/[id]/tabs/activity-log";
import {
  ActivityLog,
  detailActivityLogForUser,
} from "@/api/services/activity-logApi";
import { useUserInfo } from "@/store/userStore";
import { useOrder } from "@/hooks/useOrder";
import dayjs from "dayjs";
import {
  Search,
  Clock,
  Calendar,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/ui/badge";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";

export function WarrantyContent() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, loading } = useOrder("delivered");

  const allWarrantyItems = useMemo(() => {
    if (!orders) return [];
    const items: any[] = [];
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        items.push({
          ...item,
          orderNumber: order.orderNumber,
          deliveredAt: order.updatedAt,
        });
      });
    });
    return items;
  }, [orders]);

  const filteredItems = useMemo(() => {
    const now = dayjs();
    let result = allWarrantyItems;

    if (activeTab === "active") {
      result = result.filter(item => item.warrantyExpireDate && dayjs(item.warrantyExpireDate).isAfter(now));
    } else if (activeTab === "expired") {
      result = result.filter(item => !item.warrantyExpireDate || dayjs(item.warrantyExpireDate).isBefore(now));
    }

    if (searchQuery) {
      result = result.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return result;
  }, [allWarrantyItems, activeTab, searchQuery]);

  const handleClick = () => {
    toast.info("Tính năng đang cập nhật 😅");
  };
  return (
    <div className="text-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-6 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
              <Zap size={14} fill="currentColor" />
              Bảo hành điện tử
            </div>
            <h1 className="text-4xl font-extrabold  tracking-tight">Tra cứu <span className="text-emerald-500">Bảo hành</span></h1>
            <p className="text-muted-foreground text-sm">Quản lý và theo dõi thời gian bảo hành các thiết bị của bạn</p>
          </div>

          <div className="w-full md:w-80">
            <Input
              size="large"
              prefix={<Search size={18} className="text-slate-500 mr-2" />}
              placeholder="Tìm tên sản phẩm..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex p-1 backdrop-blur-md rounded-2xl border border-border w-fit">
          {[
            { key: "all", label: "Tất cả" },
            { key: "active", label: "Bảo hành" },
            { key: "expired", label: "Hết hạn" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex cursor-pointer items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key
                ? "shadow-lg shadow-emerald-500/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[50vh] overflow-y-auto pr-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 relative z-10"
          >
            {filteredItems.map((item, index) => {
              const now = dayjs();
              const expireDate = item.warrantyExpireDate ? dayjs(item.warrantyExpireDate) : null;
              const isExpired = !expireDate || now.isAfter(expireDate);
              const daysLeft = expireDate ? expireDate.diff(now, 'day') : 0;

              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="border border-border rounded-3xl p-4 flex flex-col justify-between group transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="space-y-2">
                    {/* Ảnh và Tag */}
                    <div className="flex justify-between items-start">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border">
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isExpired ? ' text-muted-foreground border-border' : ' text-foreground border-primary/60'
                        }`}>
                        {isExpired ? "Hết bảo hành" : "Còn bảo hành"}
                      </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div>
                      <p >ID: {item.orderNumber?.slice(-8)}</p>
                      <h3 className=" font-bold text-lg line-clamp-1 group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                    </div>

                    {/* Thanh tiến trình / Thông số */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground flex items-center gap-1.5"><Calendar size={14} /> Ngày mua:</span>
                        <span className="text-foreground font-medium">{dayjs(item.deliveredAt).format("DD/MM/YYYY")}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground flex items-center gap-1.5"><Clock size={14} /> Ngày hết hạn:</span>
                        <span className={`font-bold ${isExpired ? 'text-red-500' : 'text-emerald-400'}`}>
                          {expireDate ? expireDate.format("DD/MM/YYYY") : "Chưa cập nhật"}
                        </span>
                      </div>

                      {!isExpired && (
                        <Badge variant={'success'} >Thời gian còn lại {daysLeft} ngày</Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button size="large" type="dashed" onClick={handleClick}>
                      {isExpired ? "Liên hệ hỗ trợ" : "Yêu cầu bảo hành"}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      {filteredItems.length === 0 && !loading && (
        <EmptyState
          height="sm"
          title="Trống"
          description="Không tìm thấy thiết bị nào phù hợp"
          actionLabel="Xem lại tất cả"
          onAction={() => {
            setActiveTab("all");  
            setSearchQuery("");  
          }} 
        />
      )}
    </div>
  );
}

export function SupportContent() {
  return <Contact />;
}

export function TermsContent() {
  return <TermsPage />;
}

export function ActivityContent() {
  const user = useUserInfo();
  const userId = user?.id;
  if (!userId) return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl border border-primary/20 transition-all hover:scale-105">
            <HistoryOutlined className="text-2xl text-blue-600" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-0.5">
              Lịch sử hoạt động
            </h2>
            <p className="text-sm text-muted-foreground">
              Xem lại các hoạt động, thay đổi và nhật ký thao tác của tài khoản
            </p>
          </div>
        </div>
      </div>

      <div>
        <ActivityLogs
          fetchLogsApi={() =>
            detailActivityLogForUser(userId) as Promise<{
              data: { success: boolean; message: string; data: ActivityLog[] };
            }>
          }
        />
      </div>
    </div>
  );
}
