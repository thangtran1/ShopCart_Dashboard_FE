import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Chart, useChart } from "@/components/admin/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { orderService } from "@/api/services/orderApi";
import type { OrderConfig } from "@/types";
import { Skeleton } from "@/ui/skeleton";
import { motion } from "framer-motion";

type TimeRange = "7d" | "30d" | "90d" | "all";

export default function RevenueChart() {
  const { t } = useTranslation();
  const A = "dashboard.analysis";
  const [orders, setOrders] = useState<OrderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await orderService.getAllOrdersAdmin({ page: 1, limit: 500 });
        setOrders(res?.data || []);
      } catch (e) {
        console.error("Error fetching orders for revenue:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { labels, revenueData, orderCountData } = useMemo(() => {
    if (!orders.length)
      return { labels: [] as string[], revenueData: [] as number[], orderCountData: [] as number[] };

    const now = new Date();
    let filtered = orders;

    if (timeRange !== "all") {
      let daysBack = 30;
      if (timeRange === "7d") daysBack = 7;
      if (timeRange === "90d") daysBack = 90;

      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - daysBack);

      filtered = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d >= startDate && d <= now;
      });
    }

    const grouped: Record<string, { revenue: number; count: number }> = {};
    for (const order of filtered) {
      const date = new Date(order.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
      if (!grouped[date]) grouped[date] = { revenue: 0, count: 0 };
      grouped[date].revenue += order.totalAmount || 0;
      grouped[date].count += 1;
    }

    const entries = Object.entries(grouped).sort((a, b) => {
      const [da, ma] = a[0].split("/").map(Number);
      const [db, mb] = b[0].split("/").map(Number);
      return ma !== mb ? ma - mb : da - db;
    });

    return {
      labels: entries.map(([k]) => k),
      revenueData: entries.map(([, v]) => v.revenue),
      orderCountData: entries.map(([, v]) => v.count),
    };
  }, [orders, timeRange]);

  const chartOptions = useChart({
    chart: { stacked: false },
    stroke: { width: [3, 0], curve: "smooth" },
    fill: {
      type: ["gradient", "solid"],
      gradient: { type: "vertical", shadeIntensity: 0, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] },
    },
    xaxis: { categories: labels, type: "category" },
    yaxis: [
      {
        title: { text: `${t(`${A}.revenue`)} (₫)` },
        labels: {
          formatter: (v: number) => {
            if (v >= 1000000) return `${(v / 1000000).toFixed(0)}M`;
            if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
            return v.toString();
          },
        },
      },
      {
        opposite: true,
        title: { text: t(`${A}.order-count`) },
        labels: { formatter: (v: number) => Math.floor(v).toString() },
      },
    ],
    tooltip: {
      shared: true,
      y: {
        formatter: (val: number, opts: any) => {
          if (opts.seriesIndex === 0) return `${val.toLocaleString("vi-VN")} ₫`;
          return `${val} ${t(`${A}.orders-unit`)}`;
        },
      },
    },
    legend: { show: true, position: "top", markers: { strokeWidth: 0, offsetX: -4 } },
    colors: ["#6366f1", "#22c55e"],
  });

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>{t(`${A}.revenue-trend`)}</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-[350px] w-full rounded-xl" /></CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">📈 {t(`${A}.revenue-trend`)}</span>
            <Select onValueChange={(v) => setTimeRange(v as TimeRange)} defaultValue={timeRange}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">{t(`${A}.7-days`)}</SelectItem>
                <SelectItem value="30d">{t(`${A}.30-days`)}</SelectItem>
                <SelectItem value="90d">{t(`${A}.90-days`)}</SelectItem>
                <SelectItem value="all">{t(`${A}.all`)}</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {labels.length > 0 ? (
            <Chart
              type="area"
              series={[
                { name: t(`${A}.revenue`), type: "area", data: revenueData },
                { name: t(`${A}.order-count`), type: "column", data: orderCountData },
              ]}
              options={chartOptions}
              height={350}
            />
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>{t(`${A}.no-order-data`)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
