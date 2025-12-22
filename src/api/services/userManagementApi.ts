import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";

// ========== FUNCTIONS ==========
export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "green";
    case "inactive":
      return "orange";
    default:
      return "default";
  }
};
export const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "red";
    case "moderator":
      return "orange";
    case "user":
      return "blue";
    default:
      return "default";
  }
};
// ========== TYPES ==========
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
  lastLoginAt?: string;
  loginCount?: number;
  isEmailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface CreateUserReq {
  email: string;
  name: string;
  password: string;
  role?: string;
  status?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
}

export interface UpdateUserReq {
  email?: string;
  name?: string;
  role?: string;
  status?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
}

export interface AdminUpdateUserPasswordReq {
  newPassword: string;
}
export interface QueryUserParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | string;
  status?: UserStatus | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isDeleted?: boolean;
  isNewUsers?: boolean;
}

export interface GetUsersRes {
  success: boolean;
  message: string;
  data: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ========== TRANSFORM FUNCTIONS ==========
const transformUser = (user: any): User => ({
  id: user._id,
  email: user.email,
  name: user.name,
  role: user.role,
  status: user.status,
  avatar: user.avatar,
  phone: user.phone,
  dateOfBirth: user.dateOfBirth,
  address: user.address,
  bio: user.bio,
  lastLoginAt: user.lastLoginAt,
  loginCount: user.loginCount,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ========== API CALLS ==========

// Get all users with pagination and filters
export const getUsers = async (params?: QueryUserParams) => {
  const response = await apiClient.get({
    url: API_URL.USER.GetAll,
    params,
  });

  // Transform the response data
  if (response.data.success && response.data.data) {
    return {
      ...response,
      data: {
        ...response.data,
        data: response.data.data.map(transformUser),
      },
    };
  }

  return response;
};

// Get user by ID
export const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get({
    url: API_URL.USER.GetById.replace(":id", id),
  });
  return transformUser(response.data.data);
};

// Create new user
export const createUser = async (data: CreateUserReq) => {
  const response = await apiClient.post<any>({
    url: API_URL.USER.Create,
    data,
  });

  // Transform the response data if it contains user data
  if (response.data.success && response.data.data) {
    return {
      ...response,
      data: {
        ...response.data,
        data: transformUser(response.data.data),
      },
    };
  }

  return response;
};

// Bulk create users from Excel
export const bulkCreateUsers = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<any>({
    url: API_URL.USER.BulkCreate,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// Update user
export const updateUser = async (id: string, data: UpdateUserReq) => {
  const response = await apiClient.put<any>({
    url: API_URL.USER.Update.replace(":id", id),
    data,
  });

  // Transform the response data if it contains user data
  if (response.data.success && response.data.data) {
    return {
      ...response,
      data: {
        ...response.data,
        data: transformUser(response.data.data),
      },
    };
  }

  return response;
};

// Delete one or many users
export const deleteUser = async (ids: string | string[]) => {
  return await apiClient.delete({
    url: API_URL.USER.Delete,
    data: { ids },
  });
};

// Bulk update status
export const bulkUpdateUserStatus = async (ids: string[], status: string) => {
  return await apiClient.patch({
    url: API_URL.USER.BulkUpdateStatus,
    data: { ids, status },
  });
};

// Soft delete users
export const softDeleteUser = async (ids: string | string[]) => {
  return await apiClient.delete({
    url: API_URL.USER.SoftDelete,
    data: { ids },
  });
};

// Restore users
export const restoreUser = async (ids: string | string[]) => {
  return await apiClient.patch({
    url: API_URL.USER.Restore,
    data: { ids },
  });
};

// Admin update user password
export const adminUpdateUserPassword = async (
  id: string,
  data: AdminUpdateUserPasswordReq
) => {
  return await apiClient.patch({
    url: API_URL.USER.AdminUpdateUserPassword.replace(":id", id),
    data,
  });
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  bulkUpdateUserStatus,
  softDeleteUser,
  restoreUser,
  adminUpdateUserPassword,
};
