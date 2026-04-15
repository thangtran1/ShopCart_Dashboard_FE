import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { analyticsApi } from "@/api/services/analyticsApi";
import type { KPISummary } from "@/api/services/analyticsApi";

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
        const data = await analyticsApi.getKPISummary();
        setSummary(data);
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
