import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";
import { OrderConfig, ShippingAddress } from "@/types";

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
  couponCode?: string;
}

// Interface cho việc cập nhật đơn hàng (Admin)
export interface UpdateOrderAdminRequest {
  status?: string;
  customerName?: string;
  shippingAddress?: Partial<ShippingAddress>;
}

export interface AdminOrderQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}

export const orderService = {
  // ==========================================
  //                USER ACTIONS
  // ==========================================

  createOrder: async (orderData: CreateOrderRequest): Promise<OrderConfig> => {
    const response = await apiClient.post({ 
      url: API_URL.ORDERS.CREATE, 
      data: orderData 
    });
    return response.data.data;
  },

  getMyOrders: async (status?: string): Promise<OrderConfig[]> => {
    const response = await apiClient.get({ 
      url: API_URL.ORDERS.GET_MY_ORDERS,
      // Nếu status là 'all' thì không gửi, ngược lại thì gửi ?status=...
      params: status && status !== "all" ? { status } : {} 
    });
    return response.data.data;
  },

  getOrderDetail: async (id: string): Promise<OrderConfig> => {
    const response = await apiClient.get({ url: API_URL.ORDERS.GET_BY_ID(id) });
    return response.data.data;
  },

  cancelOrders: async (id: string): Promise<OrderConfig> => {
    const response = await apiClient.post({ 
      url: API_URL.ORDERS.CANCEL_STATUS_PENDING(id) 
    });
    return response.data.data;
  },

  // ==========================================
  //                ADMIN ACTIONS
  // ==========================================

  // 1. Lấy tất cả đơn hàng (Admin) kèm phân trang/filter
  getAllOrdersAdmin: async (params: AdminOrderQuery) => {
    const response = await apiClient.get({ 
      url: API_URL.ORDERS.ADMIN_GET_ALL,
      params // Tự động chuyển object thành query string (?page=1&limit=10...)
    });
    return response.data; // Trả về cả { data, pagination }
  },

  // 2. API Gộp: Cập nhật thông tin đơn hàng hoặc trạng thái (Admin)
  // Bạn có thể gửi { status: 'shipped' } hoặc gửi cả cụm dữ liệu
  updateOrderAdmin: async (id: string, updateData: UpdateOrderAdminRequest): Promise<OrderConfig> => {
    const response = await apiClient.patch({
      url: API_URL.ORDERS.ADMIN_UPDATE(id),
      data: updateData
    });
    return response.data.data;
  },

  // 3. Xóa đơn hàng (Admin - Soft Delete)
  deleteOrderAdmin: async (id: string): Promise<void> => {
    await apiClient.delete({ 
      url: API_URL.ORDERS.ADMIN_DELETE(id) 
    });
  },
};