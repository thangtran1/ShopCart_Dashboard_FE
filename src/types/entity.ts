import type { BasicStatus, PermissionType } from "./enum";

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserInfo {
  id: string;
  email?: string;
  username: string;
  phone?: string;
  password?: string;
  avatar?: string;
  role?: Role | string;
  status?: BasicStatus;
  permissions?: Permission[];
  loginCount?: number;
}

export interface Permission {
  id: string;
  parentId: string;
  name: string;
  label: string;
  type: PermissionType;
  route: string;
  status?: BasicStatus;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: URL;
  newFeature?: boolean;
  children?: Permission[];
}

export interface Role {
  id: string;
  name: string;
  label: string;
  status: BasicStatus;
  order?: number;
  desc?: string;
  permission?: Permission[];
}

export interface Category {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Courses {
  id: string;
  slug: string;
  title: string;
  subTitle: string;
  price: string;
  oldPrice: string;
  discountCode: string;
  thumbnail: string;
  isFree: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  status?: string;
  bio?: string;
  lastLoginAt?: string;
  loginCount?: number;
  isEmailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  senderRole: string;
  messageId?: string;
  conversationId?: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface Conversation {
  userId: string;
  userEmail: string;
  userName?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isOnline: boolean;
  hasConversation?: boolean;
}

export interface Notification {
  _id: string;
  title: string;
  content: string;
  shortDescription: string;
  type: string;
  actionUrl?: string;
  readByUsers?: string[];
  isReadByUser?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notifications {
  data: Notification;
}

// Created New User
export interface PreviewUser {
  row: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  phone?: string;
  bio?: string;
  isValid: boolean;
  error?: string;
}

export interface BulkResult {
  successCount: number;
  errorCount: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

export interface DatabaseInfo {
  dbName: string;
  collectionsCount: number;
  dataSize: string;
  storageSize: string;
  indexes: number;
  timestamp: string;
  collections: string[];
}

export interface StatItem {
  title: string;
  value: string | number;
  color: string;
  icon: string;
  isArray?: boolean;
}
export interface Backup {
  filename: string;
  size: number;
  createdAt: string;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number, pageSize?: number) => void;
}
