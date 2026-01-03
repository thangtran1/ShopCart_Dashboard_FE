import { useState, useEffect, useCallback } from "react";
import { couponService } from "@/api/services/couponApi";

export const useCoupon = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await couponService.getAvailableCoupons();
      setCoupons(res || []);
    } catch (err) {
      console.error("Lỗi lấy mã giảm giá:", err);
      setError("Không thể tải danh sách mã giảm giá");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return {
    coupons,
    loading,
    error,
    refreshCoupons: fetchCoupons, 
  };
};