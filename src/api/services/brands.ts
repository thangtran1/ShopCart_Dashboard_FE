import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";
import { BrandStatus } from "@/types/enum";
export interface CreateBrandDto {
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  website?: string;
  status?: BrandStatus;
  sortOrder?: number;
  isFeatured?: boolean;
}

export interface Brand {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  status?: BrandStatus;
  logo?: string;
  website?: string;
  productCount?: number;
  sortOrder?: number;
  isFeatured?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandListResponse {
  success: boolean;
  message: string;
  data: {
    data: Brand[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const brandService = {
  create: async (data: CreateBrandDto) => {
    const response = await apiClient.post({ url: API_URL.BRAND.CREATE, data });
    return response.data;
  },

  getActive: async () => {
    const response = await apiClient.get({ url: API_URL.BRAND.GET_ACTIVE });
    return response.data;
  },

  getAllBrands: async (
    page: number = 1,
    limit: number = 20,
    options: { search?: string; status?: BrandStatus; isFeatured?: boolean } = {}
  ): Promise<BrandListResponse> => {
    const response = await apiClient.get({
      url: API_URL.BRAND.GET_ALL,
      params: { page, limit, ...options },
    });
    return response.data;
  },

  getBrandBySlug: async (slug: string) => {
    const response = await apiClient.get({ url: API_URL.BRAND.GET_BY_SLUG(slug) });
    return response.data;
  },

  getBrandById: async (id: string) => {
    const response = await apiClient.get({ url: API_URL.BRAND.GET_BY_ID(id) });
    return response.data;
  },

  getBrandsFeatured: async () => {
    const response = await apiClient.get({ url: API_URL.BRAND.GET_FEATURED });
    return response.data;
  },

  updateBrand: async (id: string, data: CreateBrandDto) => {
    const response = await apiClient.patch({ url: API_URL.BRAND.UPDATE(id), data });
    return response.data;
  },

  deleteBrand: async (id: string) => {
    const response = await apiClient.delete({ url: API_URL.BRAND.DELETE(id) });
    return response.data;
  },
};
