import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";
import { ProductStatus } from "@/types/enum";

// ========================= Interfaces ========================= //

export interface ProductImageDto {
  url: string;
  alt?: string;
  sortOrder?: number;
}
export interface CategoryProductDto {
  _id: string;
  name: string;
  slug?: string;
}
export interface BrandProductDto {
  _id: string;
  name: string;
  slug?: string;
}
export interface ReviewReplyProductDto {
  _id: string;
  comment: string;
  user?: any;
  userName?: string;
  isAdmin?: boolean;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}
export interface ReviewProductDto {
  _id: string;
  rating: number;
  comment: string;
  user: any;
  type: 'Đã mua hàng' | 'Chưa mua hàng';
  images?: string[];
  replies?: ReviewReplyProductDto[];
  createdAt?: string;
  updatedAt?: string;
}
export interface DimensionsDto {
  length: number;
  width: number;
  height: number;
}
export interface CreateProductDto {
  name: string;
  productType?: string
  slug?: string;
  price: number;
  discount?: number;
  description?: string;
  shortDescription?: string;
  image?: string;
  images?: ProductImageDto[];
  category: string;
  brand: string;
  stock?: number;
  status?: ProductStatus;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  specifications?: string[];
  warrantyPeriod?: number;
  sku?: string;
  weight?: number;
  dimensions?: DimensionsDto;
  tags?: string[];
  sortOrder?: number;
}
export interface Product {
  _id: string;
  name: string;
  productType?: string
  slug?: string;
  price: number;
  discount?: number;
  description?: string;
  shortDescription?: string;
  image?: string;
  images?: ProductImageDto[];
  category?: CategoryProductDto;
  brand?: BrandProductDto;
  stock?: number;
  status?: ProductStatus;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  specifications?: string[];
  warrantyPeriod?: number;
  sku?: string;
  weight?: number;
  dimensions?: DimensionsDto;
  viewCount?: number;
  soldCount?: number;
  reviewCount?: number;
  averageRating?: number;
  tags?: string[];
  sortOrder?: number;
  isDeleted?: boolean;
  reviews?: ReviewProductDto[];
  createdAt?: string;
  updatedAt?: string;
}
export interface ProductListResponse {
  success: boolean;
  message: string;
  data: {
    data: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
export interface CreateReviewDto {
  rating: number;
  comment: string;
  images?: string[];
}
export interface ReplyReviewDto {
  comment: string;
}

// ========================= Product Service ========================= //

export const productService = {
  create: async (data: CreateProductDto): Promise<{ success: boolean; message: string; data: Product }> => {
    const response = await apiClient.post({ url: API_URL.PRODUCT.CREATE, data });
    return response.data as { success: boolean; message: string; data: Product };
  },

  getProductsByFeatured: async (): Promise<{ success: boolean; message: string; data: Product[] }> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.FEATURED });
    return response.data as { success: boolean; message: string; data: Product[] };
  },

  getProductsByNew: async (): Promise<{ success: boolean; message: string; data: Product[] }> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.NEW });
    return response.data as { success: boolean; message: string; data: Product[] };
  },

  getProductsByBestSeller: async (): Promise<{ success: boolean; message: string; data: Product[] }> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.BEST_SELLERS });
    return response.data as { success: boolean; message: string; data: Product[] };
  },

  getProductsByDeal: async (): Promise<{ success: boolean; message: string; data: Product[] }> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.DEALS });
    return response.data as { success: boolean; message: string; data: Product[] };
  },

  updateProduct: async (id: string, data: CreateProductDto): Promise<{ success: boolean; message: string; data: Product }> => {
    const response = await apiClient.patch({ url: API_URL.PRODUCT.BY_ID(id), data });
    return response.data as { success: boolean; message: string; data: Product };
  },

  getAllProducts: async (
    page: number = 1,
    limit: number = 20,
    options: { search?: string; status?: ProductStatus; isFeatured?: boolean, productType?: string }
  ): Promise<ProductListResponse> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.GET_ALL, params: { page, limit, ...(options || {}) } });
    return response.data as ProductListResponse;
  },

  getActiveProducts: async (
    options?: { productType?: string } 
  ): Promise<{ success: boolean; message: string; data: Product[] }> => {
    const response = await apiClient.get({
      url: API_URL.PRODUCT.GET_ACTIVE,
      params: options || {},
    });
    return response.data as {
      success: boolean;
      message: string;
      data: Product[];
    };
  },

  getProductById: async (id: string): Promise<{ success: boolean; message: string; data: Product }> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.BY_ID(id) });
    return response.data as { success: boolean; message: string; data: Product };
  },

  getProductBySlug: async (slug: string): Promise<{ success: boolean; message: string; data: Product }> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.BY_SLUG(slug) });
    return response.data as { success: boolean; message: string; data: Product };
  },

  getProductByCategory: async (
    page: number = 1,
    limit: number = 20,
    categoryId: string,
    options: { search?: string; status?: ProductStatus; isFeatured?: boolean }
  ): Promise<ProductListResponse> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.BY_CATEGORY(categoryId), params: { page, limit, ...(options || {}), categoryId } });
    return response.data as ProductListResponse;
  },

  getProductByBrand: async (
    page: number = 1,
    limit: number = 20,
    brandId: string,
    options: { search?: string; status?: ProductStatus; isFeatured?: boolean }
  ): Promise<ProductListResponse> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.BY_BRAND(brandId), params: { page, limit, ...(options || {}), brandId } });
    return response.data as ProductListResponse;
  },

  getProductByRelated: async (productId: string): Promise<{ success: boolean; message: string; data: Product[] }> => {
    const response = await apiClient.get({ url: API_URL.PRODUCT.RELATED(productId), params: { productId } });
    return response.data as { success: boolean; message: string; data: Product[] };
  },

  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete({ url: API_URL.PRODUCT.BY_ID(id) });
    return response.data as { success: boolean; message: string };
  },

  addReview: async (productId: string, data: CreateReviewDto): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await apiClient.post({ url: API_URL.PRODUCT.REVIEWS(productId), data });
    return response.data as { success: boolean; message: string; data: ReviewProductDto };
  },

  replyToReview: async (productId: string, reviewId: string, data: ReplyReviewDto): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await apiClient.post({ url: API_URL.PRODUCT.REVIEW_REPLY(productId, reviewId), data });
    return response.data as { success: boolean; message: string; data: ReviewProductDto };
  },

  deleteReview: async (productId: string, reviewId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete({ url: API_URL.PRODUCT.REVIEW_DELETE(productId, reviewId) });
    return response.data as { success: boolean; message: string };
  },
};
