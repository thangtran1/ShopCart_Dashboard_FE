import axios, {
  type AxiosRequestConfig,
  type AxiosError,
  type AxiosResponse,
} from "axios";

import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";

import { toast } from "sonner";
import type { Result } from "#/api";
import { ResultEnum } from "#/enum";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userStore = JSON.parse(localStorage.getItem("userStore") || "{}");
    const token = userStore?.state?.userToken?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (!res.data) {
      throw new Error(t("api.apiRequestFailed"));
    }

    const { success, message } = res.data;
    const data = res.data;

    const hasSuccess = success === true;

    if (hasSuccess) {
      if (data) {
        return { ...res, data };
      }
      throw new Error(t("api.noDataReturned"));
    }

    throw new Error(message || t("api.apiRequestFailed"));
  },
  async (error: AxiosError<Result>) => {
    const { response, message, config } = error || {};
    const originalRequest = config as any;

    // Nếu là API login mà bị 401 thì trả lỗi về luôn cho LoginForm, không chạy xuống logic Refresh bên dưới
    if (originalRequest.url?.includes("/login") || originalRequest.url?.includes("/signin")) {
      return Promise.reject(error);
    }
    

    if (response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = userStore.getState().userToken?.refreshToken;
        
        const refreshRes = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = refreshRes.data.data;

        userStore.getState().actions.setUserToken({ accessToken, refreshToken: newRefreshToken });

        processQueue(null, accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        userStore.getState().actions.clearUserInfoAndToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!config?.headers?.suppressToast) {
      const errMsg = Array.isArray(response?.data?.message)
        ? response.data.message.join("\n")
        : response?.data?.message || message || t("api.errorMessage");

      toast.error(errMsg, { position: "top-center" });
    }

    const status = response?.status;
    if (status === ResultEnum.TIMEOUT) {
      userStore.getState().actions.clearUserInfoAndToken();
    }
    return Promise.reject(error);
  }
);

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "GET" });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "POST" });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "PUT" });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "DELETE" });
  }

  patch<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "PATCH" });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}
export default new APIClient();
