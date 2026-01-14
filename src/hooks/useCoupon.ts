"use client";
import { useState, useEffect, useCallback } from "react";
import { couponService, ICouponFilters } from "@/api/services/couponApi";
import { toast } from "sonner"; 
import { useTranslation } from "react-i18next";

export const useCoupon = () => {
  const { t } = useTranslation(); 
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
      setError(t("coupon.error_fetch"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // 1. Lấy tất cả mã giảm giá cho Admin
  const fetchAdminCoupons = useCallback(
    async (filters: ICouponFilters) => {
      setLoading(true);
      setError(null);
      try {
        const res = await couponService.getAllCouponsAdmin(filters);
        return res; 
      } catch (err) {
        console.error("Lỗi lấy danh sách admin:", err);
        setError(t("coupon.error_fetch"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  // 2. Tạo mới Voucher
  const createCoupon = async (data: any) => {
    try {
      const res = await couponService.createCoupon(data);
      toast.success(t("coupon.toast.create_success"));
      return res;
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("coupon.toast.create_error"));
      throw err;
    }
  };

  // 3. Cập nhật Voucher
  const updateCoupon = async (id: string, data: any) => {
    try {
      const res = await couponService.updateCoupon(id, data);
      toast.success(t("coupon.toast.update_success"));
      return res;
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("coupon.toast.update_error"));
      throw err;
    }
  };

  // 4. Xóa Voucher
  const deleteCoupon = async (id: string) => {
    try {
      await couponService.deleteCoupon(id);
      toast.success(t("coupon.toast.delete_success"));
      return true;
    } catch (err) {
      toast.error(t("coupon.toast.delete_error"));
      return false;
    }
  };

  return {
    coupons, 
    loading,
    error,
    refreshCoupons: fetchCoupons, 
    fetchAdminCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  };
};