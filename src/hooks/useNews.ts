"use client";
import { INews, newsService, NewsPaginationResponse, INewsFilters } from "@/api/services/newsApi";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useNews = () => {
  const { t } = useTranslation(); 
  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Lấy danh sách tin tức cho Public
  const fetchPublicNews = useCallback(async (sort?: string) => {
    setLoading(true);
    try {
      const res = await newsService.getPublic(sort);
      if (res.success) {
        setNews(res.data);
      }
      return res;
    } catch (err) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicNews();
  }, [fetchPublicNews]);

  // 2. Lấy chi tiết tin tức
  const getNewsDetail = async (slug: string) => {
    try {
      const res = await newsService.getDetail(slug);
      return res.data;
    } catch (err) {
      console.log(t("news.error.not_found"));
      return null;
    }
  };

  // 3. Lấy tất cả tin tức cho Admin
  const fetchAdminNews = useCallback(
    async (filters: INewsFilters): Promise<NewsPaginationResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await newsService.getAllAdmin(filters);
        return res;
      } catch (err) {
        console.error("Lỗi lấy danh sách admin:", err);
        toast.error(t("news.toast.fetch_admin_error"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t] 
  );

  // 4. Tạo mới tin tức
  const createNews = async (data: Partial<INews>) => {
    try {
      const res = await newsService.create(data);
      toast.success(t("news.toast.create_success"));
      return res;
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("news.toast.create_error"));
      throw err;
    }
  };

  // 5. Cập nhật tin tức
  const updateNews = async (id: string, data: Partial<INews>) => {
    try {
      const res = await newsService.update(id, data);
      toast.success(t("news.toast.update_success"));
      return res;
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("news.toast.update_error"));
      throw err;
    }
  };

  // 6. Xóa tin tức
  const deleteNews = async (id: string) => {
    try {
      await newsService.delete(id);
      toast.success(t("news.toast.delete_success"));
      return true;
    } catch (err) {
      toast.error(t("news.toast.delete_error"));
      return false;
    }
  };

  return {
    news,
    loading,
    error,
    refreshNews: fetchPublicNews,
    getNewsDetail,
    fetchAdminNews,
    createNews,
    updateNews,
    deleteNews,
  };
};