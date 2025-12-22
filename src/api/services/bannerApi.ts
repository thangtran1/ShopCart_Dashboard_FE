import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";

export interface BannerSettings {
  _id?: string;
  id?: string;
  backgroundColor: string;
  textColor: string;
  scrollSpeed: number;
  bannerSpacing: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerConfig {
  _id?: string;
  id: string;
  content: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBannerRequest {
  content: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateBannerRequest {
  id: string;
  content?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateBannerSettingsRequest {
  backgroundColor?: string;
  textColor?: string;
  scrollSpeed?: number;
  bannerSpacing?: number;
  isActive?: boolean;
}

const transformBanner = (banner: any): BannerConfig => ({
  id: banner._id || banner.id,
  content: banner.content,
  isActive: banner.isActive,
  order: banner.order,
  createdAt: banner.createdAt,
  updatedAt: banner.updatedAt,
});

export const getBannerSettings = async (): Promise<BannerSettings> => {
  const response = await apiClient.get({ url: API_URL.BANNER.SETTINGS });
  return response.data.data;
};

export const updateBannerSettings = async (settings: UpdateBannerSettingsRequest): Promise<BannerSettings> => {
  const response = await apiClient.put({
    url: API_URL.BANNER.SETTINGS,
    data: settings,
  });
  return response.data.data;
};

export const resetBannerSettings = async (): Promise<BannerSettings> => {
  const response = await apiClient.post({ url: API_URL.BANNER.SETTINGS_RESET });
  return response.data.data;
};

// Banner CRUD

export const createBanner = async (banner: CreateBannerRequest): Promise<BannerConfig> => {
  const response = await apiClient.post({ url: API_URL.BANNER.CREATE, data: banner });
  return response.data.data;
};

export const getAllBanners = async (page = 1, limit = 10) => {
  const response = await apiClient.get({ url: API_URL.BANNER.GET_ALL, params: { page, limit } });
  return {
    banners: response.data.data.map(transformBanner),
    pagination: response.data.pagination,
  };
};

export const getActiveBanners = async (): Promise<BannerConfig[]> => {
  const response = await apiClient.get({ url: API_URL.BANNER.GET_ACTIVE });
  return response.data.data;
};

export const getBannerById = async (id: string): Promise<BannerConfig> => {
  const response = await apiClient.get({ url: API_URL.BANNER.GET_BY_ID(id) });
  return response.data.data;
};

export const updateBanner = async (banner: UpdateBannerRequest): Promise<BannerConfig> => {
  const { id, ...updateData } = banner;
  const response = await apiClient.put({ url: API_URL.BANNER.UPDATE(id), data: updateData });
  return response.data.data;
};

export const toggleBanner = async (id: string, isActive: boolean): Promise<BannerConfig> => {
  const response = await apiClient.put({ url: API_URL.BANNER.TOGGLE(id), data: { isActive } });
  return response.data.data;
};

export const updateBannerOrder = async (id: string, order: number): Promise<BannerConfig> => {
  const response = await apiClient.patch({ url: API_URL.BANNER.ORDER(id), data: { order } });
  return response.data.data;
};

export const deleteBanner = async (id: string): Promise<void> => {
  await apiClient.delete({ url: API_URL.BANNER.DELETE(id) });
};

// ========== BATCH OPERATIONS ==========

export const batchUpdateBanners = async (
  updates: Array<{ id: string; data: Partial<UpdateBannerRequest> }>
): Promise<BannerConfig[]> => {
  const promises = updates.map(({ id, data }) => updateBanner({ id, ...data }));

  const results = await Promise.all(promises);

  return results;
};

// ========== UTILITY FUNCTIONS ==========

export const prefetchBannerData = async (): Promise<void> => {
  await Promise.all([getBannerSettings(), getActiveBanners()]);
};
