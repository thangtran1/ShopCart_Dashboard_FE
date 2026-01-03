import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartResponse {
  _id: string;
  userId: string;
  items: CartItem[];
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export const cartService = {
    // Lấy thông tin giỏ hàng
    getCart: async (): Promise<CartResponse> => {
      const response = await apiClient.get({ url: API_URL.CART.GET });
      return response.data.data;
    },
  
    // Thêm sản phẩm
    addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
      const response = await apiClient.post({ 
        url: API_URL.CART.ADD, 
        data 
      });
      return response.data.data;
    },
  
    // Xóa 1 sản phẩm trong giỏ hàng
    removeItem: async (productId: string): Promise<CartResponse> => {
      const response = await apiClient.delete({ 
        url: API_URL.CART.REMOVE_PRODUCT(productId) 
      });
      return response.data.data;
    },
  
    // Làm trống giỏ
    clearCart: async (): Promise<CartResponse> => {
      const response = await apiClient.delete({ url: API_URL.CART.CLEAR });
      return response.data.data;
    },

    // giảm 1 sản phẩm trong quantity
    decreaseItem: async (productId: string): Promise<CartResponse> => {
      const response = await apiClient.patch({ 
        url: API_URL.CART.DECREASE_PRODUCT(productId) 
      });
      return response.data.data;
    },

  };