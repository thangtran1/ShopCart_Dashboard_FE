"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { brandService, CreateBrandDto } from "@/api/services/brands";
import { BrandStatus } from "@/types/enum";

export const useBrand = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const useActiveBrands = () => {
    return useQuery({
      queryKey: ["brands", "active"],
      queryFn: async () => {
        const res = await brandService.getActive();
        return res.data;
      },
      staleTime: 1000 * 60 * 30, 
    });
  };

  const useAdminBrands = (
    page: number,
    limit: number,
    options: { search?: string; status?: BrandStatus; isFeatured?: boolean }
  ) => {
    return useQuery({
      queryKey: ["brands", "admin", { page, limit, ...options }],
      queryFn: () => brandService.getAllBrands(page, limit, options),
      placeholderData: (previousData) => previousData, 
    });
  };

  const useFeaturedBrands = () => {
    return useQuery({
      queryKey: ["brands", "featured"],
      queryFn: async () => {
        const res = await brandService.getBrandsFeatured();
        return res.data;
      },
      staleTime: 1000 * 60 * 10,
    });
  };

  const createBrandMutation = useMutation({
    mutationFn: (data: CreateBrandDto) => brandService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success(t("brand.toast.create_success") || "Tạo thương hiệu thành công");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Lỗi khi tạo thương hiệu");
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBrandDto }) =>
      brandService.updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success(t("brand.toast.update_success") || "Cập nhật thành công");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật");
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (id: string) => brandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success(t("brand.toast.delete_success") || "Đã xóa thương hiệu");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Lỗi khi xóa");
    },
  });

  return {
    // Queries
    useActiveBrands,
    useAdminBrands,
    useFeaturedBrands,

    // Actions (MutateAsync để có thể dùng try/catch trong Component nếu cần)
    createBrand: createBrandMutation.mutateAsync,
    updateBrand: updateBrandMutation.mutateAsync,
    deleteBrand: deleteBrandMutation.mutateAsync,

    // Loading states
    isActionLoading:
      createBrandMutation.isPending ||
      updateBrandMutation.isPending ||
      deleteBrandMutation.isPending,
  };
};