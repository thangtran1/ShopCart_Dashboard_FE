import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";


export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface CouponResponse {
  success: true
  data: Coupon[];
  pagination: {
    total: number
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ICouponFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | string;
  discountType?: 'fixed' | 'percentage' | '';
  status?: 'active' | 'expired' | 'outOfStock' | '';
}

export const couponService = {
  getAvailableCoupons: async (): Promise<Coupon[]> => {
    const response = await apiClient.get({
      url: API_URL.COUPONS.AVAILABLE,
    });
    return response.data.data;
  },

  validateCoupon: async (code: string, amount: number) => {
    const response = await apiClient.get({
      url: API_URL.COUPONS.VALIDATE,
      params: { code, amount },
    });
    return response.data;
  },

  // Lấy tất cả coupon (có phân trang & search)
  getAllCouponsAdmin: async (filters: ICouponFilters): Promise<CouponResponse> => {
    const { page = 1, limit = 10, search = "", isActive, discountType, status } = filters;
  
    const response = await apiClient.get({
      url: API_URL.COUPONS.ADMIN_ALL,
      params: { 
        page, 
        limit, 
        search,
        ...(isActive !== undefined && { isActive }),
        ...(discountType && { discountType }),
        ...(status && { status }),
      },
    });
  
    return response.data;
  },

  // Lấy chi tiết 1 coupon để sửa
  getCouponDetail: async (id: string): Promise<Coupon> => {
    const response = await apiClient.get({
      url: API_URL.COUPONS.GET_DETAIL(id),
    });
    return response.data.data;
  },

  // Tạo mới coupon
  createCoupon: async (data: Partial<Coupon>): Promise<Coupon> => {
    const response = await apiClient.post({
      url: API_URL.COUPONS.CREATE,
      data: data,
    });
    return response.data.data;
  },

  // Cập nhật coupon
  updateCoupon: async (id: string, data: Partial<Coupon>): Promise<Coupon> => {
    const response = await apiClient.put({
      url: API_URL.COUPONS.UPDATE(id),
      data: data,
    });
    return response.data.data;
  },

  // Xóa coupon
  deleteCoupon: async (id: string): Promise<void> => {
    await apiClient.delete({
      url: API_URL.COUPONS.DELETE(id),
    });
  },
};