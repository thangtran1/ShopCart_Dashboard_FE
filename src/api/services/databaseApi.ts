import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";

export interface ListBackupsParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
export const databaseAdmin = {
  getDatabaseInfo: async () => {
    const response = await apiClient.get({ url: API_URL.DATABASE.INFO });
    return response.data;
  },

  backupDatabase: async () => {
    const response = await apiClient.post({ url: API_URL.DATABASE.BACKUP });
    return response.data;
  },

  restoreDatabase: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post({
      url: API_URL.DATABASE.RESTORE,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteDatabase: async () => {
    const response = await apiClient.delete({ url: API_URL.DATABASE.DELETE });
    return response.data;
  },

  listBackups: async (params?: ListBackupsParams) => {
    const response = await apiClient.get({ url: API_URL.DATABASE.BACKUPS, params });
    return response.data;
  },

  deleteBackup: async (filename: string) => {
    const response = await apiClient.delete({ url: API_URL.DATABASE.BACKUP_DELETE(filename) });
    return response.data;
  },

  downloadBackupJson: async (filename: string) => {
    const response = await apiClient.get({ url: API_URL.DATABASE.BACKUP_DOWNLOAD_JSON(filename) });
    return response.data;
  },

  viewBackup: async (filename: string) => {
    const response = await apiClient.get({ url: API_URL.DATABASE.BACKUP_VIEW(filename) });
    return response.data;
  },
};
