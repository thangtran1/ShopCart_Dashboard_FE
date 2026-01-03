import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";

export const couponService = {
  // Lấy danh sách mã giảm giá khả dụng để hiển thị cho user chọn
  getAvailableCoupons: async () => {
    const response = await apiClient.get({
      url: API_URL.COUPONS.AVAILABLE, // Đảm bảo URL này khớp với BE
    });
    return response.data.data;
  },

  // Kiểm tra nhanh một mã (Validate)
  validateCoupon: async (code: string, amount: number) => {
    const response = await apiClient.get({
      url: API_URL.COUPONS.VALIDATE,
      params: { code, amount },
    });
    return response.data;
  },
};
