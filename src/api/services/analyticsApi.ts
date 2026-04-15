import apiClient from '../apiClient';

export interface KPISummary {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueTrend: number;
  orderTrend: number;
  userTrend: number;
  productTrend: number;
}

export interface RevenueChartData {
  labels: string[];
  revenueData: number[];
  orderCountData: number[];
}

export const analyticsApi = {
  getKPISummary: async (): Promise<KPISummary> => {
    const res = await apiClient.get({ url: '/analytics/kpi-summary' });
    return res.data?.data;
  },
  getRevenueChart: async (timeRange: string): Promise<RevenueChartData> => {
    const res = await apiClient.get({ url: `/analytics/revenue-chart?timeRange=${timeRange}` });
    return res.data?.data;
  }
};
