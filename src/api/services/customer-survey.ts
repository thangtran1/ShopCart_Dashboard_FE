import { API_URL } from "@/router/routes/api.route";
import apiClient from "../apiClient";

export interface SurveyQuestion {
  _id: string;
  title: string;
  options: string[];
  order: number;
}

export interface SurveyAnswer {
  questionId: string;
  questionTitle: string;
  selectedOptions: string[];
}

export interface SubmitSurveyDto {
  surveyData: SurveyAnswer[];
  customerFeedback: string;
}

export interface SurveyResponse {
  _id: string;
  surveyData: SurveyAnswer[];
  customerFeedback: string;
  createdAt: string;
}

export const customerSurveyService = {
  // 1. Lấy danh sách câu hỏi (Dùng cho cả khách trả lời và Admin quản lý)
  getQuestions: async () => {
    const response = await apiClient.get({ url: API_URL.CUSTOMER_SURVEY.GET_QUESTIONS });
    return response.data;
  },

  // 2. Tạo câu hỏi mới (Admin)
  createQuestion: async (data: Omit<SurveyQuestion, '_id'>) => {
    const response = await apiClient.post({ url: API_URL.CUSTOMER_SURVEY.CREATE_QUESTION, data });
    return response.data;
  },

  // 3. Cập nhật câu hỏi (Admin)
  updateQuestion: async (id: string, data: Partial<SurveyQuestion>) => {
    const response = await apiClient.put({ url: API_URL.CUSTOMER_SURVEY.UPDATE_QUESTION(id), data });
    return response.data;
  },

  // 4. Xóa câu hỏi (Admin)
  deleteQuestion: async (id: string) => {
    const response = await apiClient.delete({ url: API_URL.CUSTOMER_SURVEY.DELETE_QUESTION(id) });
    return response.data;
  },

  // 5. Gửi kết quả khảo sát (Khách hàng)
  submitSurvey: async (data: SubmitSurveyDto) => {
    const response = await apiClient.post({ url: API_URL.CUSTOMER_SURVEY.SUBMIT, data });
    return response.data;
  },

  // 6. Lấy danh sách tất cả phản hồi (Admin)
  getAllResponses: async () => {
    const response = await apiClient.get({ url: API_URL.CUSTOMER_SURVEY.GET_RESPONSES });
    return response.data;
  },
};