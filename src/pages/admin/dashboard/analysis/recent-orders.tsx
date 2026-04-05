import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { orderService } from "@/api/services/orderApi";
import type { OrderConfig } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { motion } from "framer-motion";

const STATUS_KEYS: Record<string, string> = {
  pending: "status-pending", confirmed: "status-confirmed", processing: "status-processing",
  shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled", refunded: "status-refunded",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  processing: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
  shipped: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800",
  delivered: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  cancelled: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  refunded: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
};

export default function RecentOrders() {
  const { t } = useTranslation();
  const A = "dashboard.analysis";
  const [orders, setOrders] = useState<OrderConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await orderService.getAllOrdersAdmin({ page: 1, limit: 6 });
        setOrders(res?.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>{t(`${A}.recent-orders`)}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-16 w-full rounded-lg" />))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }} className="h-full">
      <Card className="h-full">
        <CardHeader><CardTitle className="text-lg font-semibold">🧾 {t(`${A}.recent-orders`)}</CardTitle></CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-2.5">
              {orders.map((order, index) => {
                const status = order.status?.toLowerCase() || "pending";
                const statusColor = STATUS_COLORS[status] || "";
                return (
                  <motion.div key={order._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-border hover:bg-accent/30 transition-all">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
                      <span className="text-sm font-bold">#</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.customerEmail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold">{(order.totalAmount || 0).toLocaleString("vi-VN")}₫</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${statusColor}`}>
                      {t(`${A}.${STATUS_KEYS[status] || status}`)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center"><div className="text-4xl mb-2">📋</div><p>{t(`${A}.no-orders-yet`)}</p></div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
