import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Chart, useChart } from "@/components/admin/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { orderService } from "@/api/services/orderApi";
import type { OrderConfig } from "@/types";
import { Skeleton } from "@/ui/skeleton";
import { motion } from "framer-motion";

const STATUS_KEYS: Record<string, string> = {
  pending: "status-pending",
  confirmed: "status-confirmed",
  processing: "status-processing",
  shipped: "status-shipped",
  delivered: "status-delivered",
  cancelled: "status-cancelled",
  refunded: "status-refunded",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", confirmed: "#3b82f6", processing: "#6366f1",
  shipped: "#8b5cf6", delivered: "#22c55e", cancelled: "#ef4444", refunded: "#6b7280",
};

export default function OrderStatusChart() {
  const { t } = useTranslation();
  const A = "dashboard.analysis";
  const [orders, setOrders] = useState<OrderConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getAllOrdersAdmin({ page: 1, limit: 500 });
        setOrders(res?.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const { labels, series, colors } = useMemo(() => {
    const statusCount: Record<string, number> = {};
    for (const order of orders) {
      const s = order.status?.toLowerCase() || "unknown";
      statusCount[s] = (statusCount[s] || 0) + 1;
    }
    const entries = Object.entries(statusCount).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
    return {
      labels: entries.map(([s]) => t(`${A}.${STATUS_KEYS[s] || s}`)),
      series: entries.map(([, c]) => c),
      colors: entries.map(([s]) => STATUS_COLORS[s] || "#9ca3af"),
    };
  }, [orders, t]);

  const chartOptions = useChart({
    labels, colors,
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: { show: true, label: t(`${A}.total-order-label`), fontSize: "14px" },
            value: { fontSize: "28px", fontWeight: 700 },
          },
        },
      },
    },
    legend: { show: true, position: "bottom", fontSize: "13px" },
    tooltip: { y: { formatter: (val: number) => `${val} ${t(`${A}.orders-unit`)}` } },
    stroke: { width: 3 },
  });

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>{t(`${A}.order-distribution`)}</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-[350px] w-full rounded-xl" /></CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="h-full">
      <Card className="h-full">
        <CardHeader><CardTitle className="text-lg font-semibold">🍩 {t(`${A}.order-distribution`)}</CardTitle></CardHeader>
        <CardContent>
          {series.length > 0 ? (
            <Chart type="donut" series={series} options={chartOptions} height={350} />
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <div className="text-center"><div className="text-4xl mb-2">📦</div><p>{t(`${A}.no-order-data`)}</p></div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
