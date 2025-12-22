import { AuthSessionStatus, BasicStatus } from "@/types/enum";
import apiClient from "../apiClient";
import { API_URL } from "@/router/routes/api.route";
export interface ActivityLog {
  id: string;
  ip?: string;
  timestamp: string;
  type: string;
  userAgent?: string;
}

export interface AuthSession {
  userId: string;
  sessionStatus: AuthSessionStatus;
  lastActivityType: "login" | "logout";
  lastActivityTime: string;
  ip: string;
  userAgent: string;
  userName: string;
  email: string;
  status: BasicStatus;
}

export interface AuthSessionListResponse {
  success: boolean;
  message: string;
  data: {
    authSessions: AuthSession[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number, pageSize?: number) => void;
}

// Lấy lịch sử hoạt động của user
export const detailActivityLogForUser = async (userId: string) => {
  return await apiClient.get<{ data: { success: boolean; message: string; data: ActivityLog[] } }>({
    url: API_URL.ACTIVITY_LOG.GET_BY_ID(userId),
  });
};

// Lấy lịch sử hoạt động của admin
export const getActivityLogsAdmin = async () => {
  return await apiClient.get<{ data: { success: boolean; message: string; data: ActivityLog[] } }>({
    url: API_URL.ACTIVITY_LOG.GET_ADMIN,
  });
};

// Admin API Services
export const getAllAuthSessions = {
  getAll: async (
    page: number = 1,
    limit: number = 20,
    options: { keyword?: string; sessionStatus?: AuthSessionStatus; from?: string; to?: string }
  ): Promise<AuthSessionListResponse> => {
    const response = await apiClient.get({
      url: API_URL.ACTIVITY_LOG.GET_ALL_SESSIONS,
      params: { page, limit, ...(options || {}) },
    });
    return response.data;
  },
};
