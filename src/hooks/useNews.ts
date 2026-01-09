import { INews, newsService, NewsPaginationResponse } from "@/api/services/newsApi";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export const useNews = () => {
  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Lấy danh sách tin tức cho Public (Khách hàng)
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

  // Tự động gọi lần đầu khi hook được mount
  useEffect(() => {
    fetchPublicNews();
  }, [fetchPublicNews]);

  // 2. Lấy chi tiết tin tức (Dùng khi cần lấy lẻ 1 bài)
  const getNewsDetail = async (slug: string) => {
    try {
      const res = await newsService.getDetail(slug);
      return res.data;
    } catch (err) {
      toast.error("Không tìm thấy bài viết");
      return null;
    }
  };

  // 3. Lấy tất cả tin tức cho Admin (Phân trang/Search)
  const fetchAdminNews = useCallback(
    async (page: number, limit: number, search?: string): Promise<NewsPaginationResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await newsService.getAllAdmin(page, limit, search);
        return res;
      } catch (err) {
        console.error("Lỗi lấy danh sách admin:", err);
        toast.error("Lỗi khi tải dữ liệu quản trị");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 4. Tạo mới tin tức
  const createNews = async (data: Partial<INews>) => {
    try {
      const res = await newsService.create(data);
      toast.success("Đăng tin tức thành công");
      return res;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi tạo tin tức");
      throw err;
    }
  };

  // 5. Cập nhật tin tức
  const updateNews = async (id: string, data: Partial<INews>) => {
    try {
      const res = await newsService.update(id, data);
      toast.success("Cập nhật tin tức thành công");
      return res;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật");
      throw err;
    }
  };

  // 6. Xóa tin tức
  const deleteNews = async (id: string) => {
    try {
      await newsService.delete(id);
      toast.success("Đã xóa bài viết");
      return true;
    } catch (err) {
      toast.error("Không thể xóa bài viết");
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