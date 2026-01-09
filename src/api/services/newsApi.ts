import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";

export interface INews {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  shortDescription: string;
  content: string;
  category: string;
  views: number;
  isPublished: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface NewsPaginationResponse {
  success: boolean;
  message: string;
  data: INews[];
  total: number;
  page: number;
  lastPage: number;
}

export const newsService = {
  // --- PUBLIC ---

  getPublic: async (sort?: string): Promise<NewsResponse<INews[]>> => {
    const response = await apiClient.get({
      url: API_URL.NEWS.GET_PUBLIC(sort),
    });
    return response.data;
  },

  getDetail: async (slug: string): Promise<NewsResponse<INews>> => {
    const response = await apiClient.get({
      url: API_URL.NEWS.GET_DETAIL(slug),
    });
    return response.data;
  },

  // --- ADMIN ---
  getAllAdmin: async (
    page: number,
    limit: number,
    search?: string
  ): Promise<NewsPaginationResponse> => {
    const response = await apiClient.get({
      url: API_URL.NEWS.GET_ALL_ADMIN(page, limit, search),
    });
    return response.data;
  },

  create: async (payload: Partial<INews>): Promise<NewsResponse<INews>> => {
    const response = await apiClient.post({
      url: API_URL.NEWS.CREATE,
      data: payload,
    });
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<INews>
  ): Promise<NewsResponse<INews>> => {
    const response = await apiClient.put({
      url: API_URL.NEWS.UPDATE(id),
      data: payload,
    });
    return response.data;
  },

  delete: async (id: string): Promise<NewsResponse<null>> => {
    const response = await apiClient.delete({
      url: API_URL.NEWS.DELETE(id),
    });
    return response.data;
  },
};
