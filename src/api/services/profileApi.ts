import { BasicStatus } from "@/types/enum";
import apiClient from "../apiClient";
import { API_URL } from "@/router/routes/api.route";

// ========== INTERFACES ==========
export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  role: string;
  status: BasicStatus;
  bio?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  loginCount: number;
  isEmailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileReq {
  name?: string;
  bio?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
}

export interface AdminChangePasswordReq {
  currentPassword: string;
  newPassword: string;
}

export interface SystemSettings {
  _id: string;
  defaultLanguage: string;
  systemName: string;
  systemDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSystemSettingsReq {
  defaultLanguage?: string;
  systemName?: string;
  systemDescription?: string;
}

// Get user profile
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get({ url: API_URL.PROFILE.GetProfile });
  return response.data.data;
};

// Update user profile
export const updateUserProfile = async (
  data: UpdateProfileReq
): Promise<UserProfile> => {
  const response = await apiClient.patch({
    url: API_URL.PROFILE.UpdateProfile,
    data,
  });
  return response.data.data;
};

// User change password
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await apiClient.patch({
    url: API_URL.PROFILE.ChangePassword,
    data,
  });
};

// Admin change password
export const adminChangePassword = async (data: AdminChangePasswordReq) => {
  const response = await apiClient.patch({
    url: API_URL.PROFILE.AdminChangePassword,
    data,
  });
  return response.data;
};

// Get system settings
export const getSystemSettings = async (): Promise<SystemSettings> => {
  const response = await apiClient.get({ url: API_URL.PROFILE.GetSystemSettings });
  return response.data.data;
};

// Update system settings
export const updateSystemSettings = async (
  data: UpdateSystemSettingsReq
): Promise<SystemSettings> => {
  const response = await apiClient.put({
    url: API_URL.PROFILE.UpdateSystemSettings,
    data,
  });
  return response.data.data;
};

// Get default language
export const getDefaultLanguage = async (): Promise<string> => {
  const response = await apiClient.get({ url: API_URL.PROFILE.GetDefaultLanguage });
  return response.data.data.defaultLanguage;
};

// Upload avatar
export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient.post({
    url: API_URL.PROFILE.UploadAvatar,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data.avatarUrl;
};

export default {
  getUserProfile,
  updateUserProfile,
  adminChangePassword,
  getSystemSettings,
  updateSystemSettings,
  getDefaultLanguage,
  uploadAvatar,
};
