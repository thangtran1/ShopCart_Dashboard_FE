import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";
import { CategoryStatus } from "@/types/enum";
export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: CategoryStatus;
  sortOrder?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  status?: CategoryStatus;
  image?: string;
  productCount?: number;
  sortOrder?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data: {
    data: Category[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const categoryService = {
  create: async (data: CreateCategoryDto) => {
    const response = await apiClient.post({ url: API_URL.CATEGORY.CREATE, data });
    return response.data;
  },

  getActive: async () => {
    const response = await apiClient.get({ url: API_URL.CATEGORY.GET_ACTIVE });
    return response.data;
  },

  getAllCategories: async (
    page: number = 1,
    limit: number = 20,
    options: { search?: string; status?: CategoryStatus; isFeatured?: boolean } = {}
  ): Promise<CategoryListResponse> => {
    const response = await apiClient.get({
      url: API_URL.CATEGORY.GET_ALL,
      params: { page, limit, ...options },
    });
    return response.data;
  },

  getCategoryBySlug: async (slug: string) => {
    const response = await apiClient.get({ url: API_URL.CATEGORY.GET_BY_SLUG(slug) });
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await apiClient.get({ url: API_URL.CATEGORY.GET_BY_ID(id) });
    return response.data;
  },

  updateCategory: async (id: string, data: CreateCategoryDto) => {
    const response = await apiClient.patch({ url: API_URL.CATEGORY.UPDATE(id), data });
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete({ url: API_URL.CATEGORY.DELETE(id) });
    return response.data;
  },
};
