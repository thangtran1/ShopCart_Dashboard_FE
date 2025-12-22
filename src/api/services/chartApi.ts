import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";

export interface ResponseStats {
  labels: string[];
  series: { name: string; data: number[] }[];
}

export enum StatsPeriod {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

const getStats = async (url: string, period?: StatsPeriod): Promise<ResponseStats> => {
  const response = await apiClient.get({
    url,
    params: period ? { period: period.toString() } : undefined,
  });
  return response.data.data as ResponseStats;
};

export const statsService = {
  user: (period: StatsPeriod) => getStats(API_URL.STATS.USER, period),
  banner: (period: StatsPeriod) => getStats(API_URL.STATS.BANNER, period),
  notification: (period: StatsPeriod) => getStats(API_URL.STATS.NOTIFICATION, period),
  activityLog: (period: StatsPeriod) => getStats(API_URL.STATS.ACTIVITY_LOG, period),
  maintenance: () => getStats(API_URL.STATS.MAINTENANCE),
};
