import { useState, useEffect, useCallback } from "react";
import { couponService } from "@/api/services/couponApi";
import { toast } from "sonner"; 

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

  // 1. Lấy tất cả mã giảm giá cho Admin (có phân trang/search)
  const fetchAdminCoupons = useCallback(
    async (page = 1, limit = 10, search = "") => {
      setLoading(true);
      try {
        const res = await couponService.getAllCouponsAdmin(page, limit, search);
        return res;
      } catch (err) {
        console.error("Lỗi lấy danh sách admin:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 2. Tạo mới Voucher
  const createCoupon = async (data: any) => {
    try {
      const res = await couponService.createCoupon(data);
      toast.success("Tạo voucher thành công");
      return res;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi tạo voucher");
      throw err;
    }
  };

  // 3. Cập nhật Voucher
  const updateCoupon = async (id: string, data: any) => {
    try {
      const res = await couponService.updateCoupon(id, data);
      toast.success("Cập nhật thành công");
      return res;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật");
      throw err;
    }
  };

  // 4. Xóa Voucher
  const deleteCoupon = async (id: string) => {
    try {
      await couponService.deleteCoupon(id);
      toast.success("Đã xóa voucher");
      return true;
    } catch (err) {
      toast.error("Không thể xóa voucher");
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