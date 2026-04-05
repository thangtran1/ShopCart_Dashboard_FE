import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { orderService } from "@/api/services/orderApi";
import { productService } from "@/api/services/product";
import { StatsPeriod, statsService } from "@/api/services/chartApi";
import type { OrderConfig } from "@/types";

import AnalysisCard from "./analysis-card";
import RevenueChart from "./revenue-chart";
import OrderStatusChart from "./order-status-chart";
import TopProducts from "./top-products";
import RecentOrders from "./recent-orders";
import UserGrowthChart from "./user-growth-chart";
import ActiveSessions from "./active-sessions";
import CouponStats from "./coupon-stats";
import SystemOverview from "./system-overview";
import { Skeleton } from "@/ui/skeleton";

const GRADIENTS = {
  revenue: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  orders: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  users: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  products: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
};

interface KPISummary {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueTrend: number;
  orderTrend: number;
  userTrend: number;
  productTrend: number;
}

const formatCurrency = (v: number) => {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B ₫`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M ₫`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ₫`;
  return `${v.toLocaleString("vi-VN")} ₫`;
};

function Analysis() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<KPISummary | null>(null);
  const [kpiLoading, setKpiLoading] = useState(true);

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        setKpiLoading(true);
        const [ordersRes, productsRes, userStatsRes] =
          await Promise.allSettled([
            orderService.getAllOrdersAdmin({ page: 1, limit: 1000 }),
            productService.getAllProducts(1, 1, {}),
            statsService.user(StatsPeriod.MONTH),
          ]);

        let totalRevenue = 0;
        let totalOrders = 0;
        let orders: OrderConfig[] = [];
        if (ordersRes.status === "fulfilled") {
          const res = ordersRes.value;
          orders = res?.data || [];
          totalOrders = res?.pagination?.total || orders.length;
          totalRevenue = orders.reduce(
            (sum, o) => sum + (o.totalAmount || 0),
            0
          );
        }

        let totalProducts = 0;
        if (productsRes.status === "fulfilled") {
          const res = productsRes.value;
          totalProducts = res?.data?.pagination?.total || 0;
        }

        let totalUsers = 0;
        let userTrend = 0;
        if (userStatsRes.status === "fulfilled") {
          const stats = userStatsRes.value;
          if (stats.series[0]?.data) {
            totalUsers = stats.series[0].data.reduce((a, b) => a + b, 0);
            const data = stats.series[0].data;
            if (data.length >= 2) {
              const last = data[data.length - 1];
              const prev = data[data.length - 2];
              userTrend = prev > 0 ? ((last - prev) / prev) * 100 : 0;
            }
          }
        }

        let revenueTrend = 0;
        let orderTrend = 0;
        if (orders.length > 0) {
          const now = new Date();
          const mid = new Date(now);
          mid.setDate(mid.getDate() - 15);
          const start = new Date(now);
          start.setDate(start.getDate() - 30);

          const recent = orders.filter((o) => new Date(o.createdAt) >= mid);
          const prev = orders.filter(
            (o) =>
              new Date(o.createdAt) >= start && new Date(o.createdAt) < mid
          );

          const recentRevenue = recent.reduce(
            (s, o) => s + (o.totalAmount || 0),
            0
          );
          const prevRevenue = prev.reduce(
            (s, o) => s + (o.totalAmount || 0),
            0
          );
          revenueTrend =
            prevRevenue > 0
              ? ((recentRevenue - prevRevenue) / prevRevenue) * 100
              : 0;
          orderTrend =
            prev.length > 0
              ? ((recent.length - prev.length) / prev.length) * 100
              : 0;
        }

        setSummary({
          totalRevenue,
          totalOrders,
          totalUsers,
          totalProducts,
          revenueTrend,
          orderTrend,
          userTrend,
          productTrend: 0,
        });
      } catch (e) {
        console.error("Error fetching KPI summary:", e);
      } finally {
        setKpiLoading(false);
      }
    };

    fetchKPI();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] w-full rounded-2xl" />
          ))
        ) : summary ? (
          <>
            <AnalysisCard
              title={t("dashboard.analysis.total-revenue")}
              value={summary.totalRevenue}
              formatter={formatCurrency}
              trend={summary.revenueTrend}
              trendLabel={t("dashboard.analysis.vs-prev-period")}
              icon="lucide:banknote"
              gradient={GRADIENTS.revenue}
              delay={0}
            />
            <AnalysisCard
              title={t("dashboard.analysis.total-orders")}
              value={summary.totalOrders}
              trend={summary.orderTrend}
              trendLabel={t("dashboard.analysis.vs-prev-period")}
              icon="lucide:shopping-bag"
              gradient={GRADIENTS.orders}
              delay={0.1}
            />
            <AnalysisCard
              title={t("dashboard.analysis.users")}
              value={summary.totalUsers}
              trend={summary.userTrend}
              trendLabel={t("dashboard.analysis.vs-prev-cycle")}
              icon="lucide:users"
              gradient={GRADIENTS.users}
              delay={0.2}
            />
            <AnalysisCard
              title={t("dashboard.analysis.products")}
              value={summary.totalProducts}
              icon="lucide:package"
              gradient={GRADIENTS.products}
              delay={0.3}
            />
          </>
        ) : null}
      </div>

      {/* Revenue + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <OrderStatusChart />
        </div>
      </div>

      {/* Top Products + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopProducts />
        <RecentOrders />
      </div>

      {/* User Growth + Active Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <UserGrowthChart />
        </div>
        <div className="lg:col-span-2">
          <ActiveSessions />
        </div>
      </div>

      {/* Coupon Stats + System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CouponStats />
        <SystemOverview />
      </div>
    </div>
  );
}

export default Analysis;
