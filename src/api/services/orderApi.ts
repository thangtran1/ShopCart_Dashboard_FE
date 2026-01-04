import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";
import {  OrderConfig, ShippingAddress } from "@/types";


export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
  couponCode?: string
}

export const orderService = {
    // Tạo đơn hàng mới (Checkout)
    createOrder: async (orderData: CreateOrderRequest): Promise<OrderConfig> => {
      const response = await apiClient.post({ 
        url: API_URL.ORDERS.CREATE, 
        data: orderData 
      });
      return response.data.data;
    },
  
    // Lấy lịch sử đơn hàng của tôi
    getMyOrders: async (): Promise<OrderConfig[]> => {
      const response = await apiClient.get({ url: API_URL.ORDERS.GET_MY_ORDERS });
      return response.data.data;
    },
  
    // Lấy chi tiết một đơn hàng theo ID
    getOrderDetail: async (id: string): Promise<OrderConfig> => {
      const response = await apiClient.get({ url: API_URL.ORDERS.GET_BY_ID(id) });
      return response.data.data;
    },

    // Hủy đơn hàng (User)
    cancelOrders: async (id: string): Promise<OrderConfig> => {
      const response = await apiClient.post({ 
        url: API_URL.ORDERS.CANCEL_STATUS_PENDING(id) 
      });
      return response.data.data;
    },

    // API Admin cập nhật trạng thái - ĐÃ SỬA LỖI Ở ĐÂY
    updateOrderStatus: async (id: string, status: string) => {
      const response = await apiClient.post({
        url: API_URL.ORDERS.UPDATE_ORDER_STATUS(id),
        data: { status }
      });
      return response.data;
    },
  };