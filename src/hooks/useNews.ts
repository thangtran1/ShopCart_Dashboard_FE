"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { INews, newsService, INewsFilters } from "@/api/services/newsApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useNews = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const usePublicNews = (sort?: string) => {
    return useQuery({
      queryKey: ["news", "public", sort],
      queryFn: async () => {
        const res = await newsService.getPublic(sort);
        return res.data as INews[];
      },
      staleTime: 1000 * 60 * 5, 
    });
  };

  const useNewsDetail = (slug: string) => {
    return useQuery({
      queryKey: ["news", "detail", slug],
      queryFn: async () => {
        const res = await newsService.getDetail(slug);
        return res.data as INews;
      },
      enabled: !!slug, 
      staleTime: 1000 * 60 * 10,
    });
  };

  const useAdminNews = (filters: INewsFilters) => {
    return useQuery({
      queryKey: ["news", "admin", filters],
      queryFn: () => newsService.getAllAdmin(filters),
      placeholderData: (previousData) => previousData, 
    });
  };

  const createNewsMutation = useMutation({
    mutationFn: (data: Partial<INews>) => newsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success(t("news.toast.create_success"));
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t("news.toast.create_error"));
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<INews> }) =>
      newsService.update(id, data),
    onSuccess: (_,) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["news", "detail"] });
      toast.success(t("news.toast.update_success"));
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t("news.toast.update_error"));
    },
  });

  // 6. Xóa tin tức
  const deleteNewsMutation = useMutation({
    mutationFn: (id: string) => newsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success(t("news.toast.delete_success"));
    },
    onError: () => {
      toast.error(t("news.toast.delete_error"));
    },
  });

  return {
    // Hook truy vấn (Dùng cho UI)
    usePublicNews,
    useNewsDetail,
    useAdminNews,

    // Hàm hành động (Dùng cho Form/Button)
    createNews: createNewsMutation.mutateAsync,
    updateNews: updateNewsMutation.mutateAsync,
    deleteNews: deleteNewsMutation.mutateAsync,

    // Trạng thái loading chung cho các hành động
    isActionLoading: 
      createNewsMutation.isPending || 
      updateNewsMutation.isPending || 
      deleteNewsMutation.isPending,
  };
};