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
};