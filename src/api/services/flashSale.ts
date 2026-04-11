import apiClient from "../apiClient";

export const flashSaleService = {
  // Admin APIs
  getAll: (params?: any) => apiClient.get({ url: "/flash-sales", params }),
  getById: (id: string) => apiClient.get({ url: `/flash-sales/${id}` }),
  create: (data: any) => apiClient.post({ url: "/flash-sales", data }),
  update: (id: string, data: any) => apiClient.put({ url: `/flash-sales/${id}`, data }),
  toggleStatus: (id: string, status: string) => apiClient.patch({ url: `/flash-sales/${id}/status`, data: { status } }),
  delete: (id: string) => apiClient.delete({ url: `/flash-sales/${id}` }),

  // Public APIs
  getActive: () => apiClient.get({ url: "/flash-sales/active" }),
};
