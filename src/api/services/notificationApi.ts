import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";
import { NotificationType } from "@/types/enum";
export interface CreateNotificationDto {
  title: string;
  content: string;
  actionUrl?: string;
  type: NotificationType;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number, pageSize?: number) => void;
}

export interface Notification {
  _id: string;
  title: string;
  content: string;
  type: NotificationType;
  actionUrl?: string;
  readByUsers: string[];
  isReadByUser?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// Admin API Services
export const notificationAdminService = {
  create: async (
    data: CreateNotificationDto
  ): Promise<{ success: boolean; message: string; data: Notification }> => {
    const response = await apiClient.post({
      url: API_URL.NOTIFICATIONS.USER.BASE,
      data,
    });
    return response.data;
  },

  getAll: async (
    page: number = 1,
    limit: number = 20,
    options: {
      search?: string;
      type?: NotificationType;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<NotificationListResponse> => {
    const response = await apiClient.get({
      url: API_URL.NOTIFICATIONS.ADMIN.BASE,
      params: { page, limit, ...(options || {}) },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Notification> => {
    const response = await apiClient.get({
      url: API_URL.NOTIFICATIONS.ADMIN.BY_ID(id),
    });
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateNotificationDto>
  ): Promise<Notification> => {
    const response = await apiClient.put({
      url: API_URL.NOTIFICATIONS.ADMIN.BY_ID(id),
      data,
    });
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete({
      url: API_URL.NOTIFICATIONS.ADMIN.BY_ID(id),
    });
    return response.data;
  },
};

// User API Services
export const notificationUserService = {
  getAll: async (
    page: number = 1,
    limit: number = 20
  ): Promise<NotificationListResponse> => {
    const response = await apiClient.get({
      url: API_URL.NOTIFICATIONS.USER.BASE,
      params: { page, limit },
    });
    return response.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await apiClient.get({
      url: API_URL.NOTIFICATIONS.USER.UNREAD_COUNT,
    });
    return response.data;
  },

  markAsRead: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.put({
      url: API_URL.NOTIFICATIONS.USER.MARK_READ(id),
    });
    return response.data;
  },
};

