import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";
import { AddressType } from "@/types/enum";
export interface CreateAddressDto {
  type: AddressType;      // 1 (Nhà), 2 (Công ty)
  title: string;          // Tên gợi nhớ
  address: string;        
  full_address: string; 
  province_id: number;  
  district_id: number;  
  ward_id: number;       
  is_default: boolean;
}

export interface MemberId {
    _id: string;
    email: string;
    name: string;
    phone: string
}

export interface Address {
  _id: string;
  member_id: MemberId;
  type?: AddressType;
  title?: string;
  address?: string;
  full_address?: string;
  province_id?: number;
  district_id?: number;
  ward_id?: number;
  is_default?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressListResponse {
  success: boolean;
  message: string;
  data: Address[];
  meta: {
    total: number;
    page: number;
    limit: number
  }
}

export const addressService = {
  create: async (data: CreateAddressDto) => {   
    const response = await apiClient.post({ url: API_URL.ADDRESSES.CREATE, data });
    return response.data;
  },

  getAll: async (
    page: number = 1,
    limit: number = 20,
    options: { search?: string } = {}
  ): Promise<AddressListResponse> => {
    const response = await apiClient.get({
      url: API_URL.ADDRESSES.GET_ALL_USER,
      params: { page, limit, ...options },
    });
    return response.data;
  },

  getAllAdmin: async (
    page: number = 1,
    limit: number = 20,
    options: { search?: string } = {}
  ): Promise<AddressListResponse> => {
    const response = await apiClient.get({
      url: API_URL.ADDRESSES.GET_ALL_ADMIN,
      params: { page, limit, ...options },
    });
    return response.data;
  },

  updateAddress: async (id: string, data: CreateAddressDto) => {
    const response = await apiClient.patch({ url: API_URL.ADDRESSES.UPDATE(id), data });
    return response.data;
  },

  deleteAddress: async (id: string) => {
    const response = await apiClient.delete({ url: API_URL.ADDRESSES.DELETE(id) });
    return response.data;
  },

  deleteAddressAdmin: async (id: string) => {
    const response = await apiClient.delete({ url: API_URL.ADDRESSES.DELETE_ADMIN(id) });
    return response.data;
  },
};
