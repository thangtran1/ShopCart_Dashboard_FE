import apiClient from "../apiClient";

import type { UserInfo, UserToken } from "#/entity";
import { API_URL } from "@/router/routes/api.route";

export interface SignInReq {
  email: string;
  password: string;
}

export type SignInRes = { data: UserToken & { user: UserInfo } };

export interface ForgotPasswordReq {
  email: string;
}

export interface VerifyOtpReq {
  email: string;
  otp: string;
}

export interface ResetPasswordReq {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordRes {
  data?: {
    success: boolean;
    message?: string;
  };
}

export type VerifyOtpRes = {
  data?: {
    success: boolean;
    message?: string;
    token?: string;
  };
};

export interface ResetPasswordRes {
  data?: {
    success: boolean;
    message?: string;
  };
}
//  forgot Password

const login = (data: SignInReq) =>
  apiClient.post<SignInRes>({
    url: API_URL.AUTH.LOGIN,
    data,
  });

const forgotPassword = (data: ForgotPasswordReq) =>
  apiClient.post<ForgotPasswordRes>({
    url: API_URL.AUTH.FORGOT_PASSWORD,
    data,
  });

const verifyOtp = (data: VerifyOtpReq) =>
  apiClient.post<VerifyOtpRes>({
    url: API_URL.AUTH.VERIFY_OTP,
    data,
  });

const resetPassword = (data: ResetPasswordReq) =>
  apiClient.post<ResetPasswordRes>({
    url: API_URL.AUTH.RESET_PASSWORD,
    data,
  });

const logout = () =>
  apiClient.post<{ data: { success: boolean; message: string } }>({
    url: API_URL.AUTH.LOGOUT,
  });

export default {
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout,
};
