import apiClient from "@/api/apiClient";

const AI_CHAT_PREFIX = "/ai-chat";

export interface ProductSuggestion {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  discount: number;
}

export interface AiChatMessage {
  _id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  productSuggestions: ProductSuggestion[];
  tokensUsed: number;
  createdAt: string;
}

export interface AiChatUsage {
  tokensUsed: number;
  messagesCount: number;
  maxTokensPerDay: number;
  maxMessagesPerDay: number;
  isEnabled: boolean;
}

export interface AiChatSettings {
  isEnabled: boolean;
  maxTokensPerUserPerDay: number;
  maxMessagesPerUserPerDay: number;
  model: string;
}

export interface UserUsageStat {
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  totalMessages: number;
  totalTokens: number;
  lastActive: string;
  maxMessages: number;
  maxTokens: number;
  isOverLimit: boolean;
}

export const aiChatApi = {
  sendMessage: async (message: string) => {
    const res = await apiClient.post<any>({
      url: `${AI_CHAT_PREFIX}/send`,
      data: { message },
      headers: { suppressToast: true }
    });
    return res.data.data as {
      reply: string;
      productSuggestions: ProductSuggestion[];
      usage: { tokensUsed: number; messagesCount: number };
    };
  },

  getHistory: async () => {
    const res = await apiClient.get<any>({ url: `${AI_CHAT_PREFIX}/history` });
    return res.data.data as AiChatMessage[];
  },

  clearHistory: async () => {
    const res = await apiClient.delete<any>({ url: `${AI_CHAT_PREFIX}/history` });
    return res.data;
  },

  getUsage: async () => {
    const res = await apiClient.get<any>({ url: `${AI_CHAT_PREFIX}/usage` });
    return res.data.data as AiChatUsage;
  },

  // Admin
  getModels: async () => {
    const res = await apiClient.get<any>({ url: `${AI_CHAT_PREFIX}/models` });
    return res.data.data as { id: string; owned_by: string; created: number }[];
  },

  getUserStats: async () => {
    const res = await apiClient.get<any>({ url: `${AI_CHAT_PREFIX}/admin/user-stats` });
    return res.data.data as { list: UserUsageStat[]; totalLifetimeTokens: number; totalLifetimeUsers: number };
  },

  getSettings: async () => {
    const res = await apiClient.get<any>({ url: `${AI_CHAT_PREFIX}/settings` });
    return res.data.data as AiChatSettings;
  },

  updateSettings: async (data: Partial<AiChatSettings>) => {
    const res = await apiClient.patch<any>({
      url: `${AI_CHAT_PREFIX}/settings`,
      data,
    });
    return res.data.data as AiChatSettings;
  },
};
