import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";

export interface OrderItem {
  product: string; 
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderConfig {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  notes?: string;
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
  };