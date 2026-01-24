"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { customerSurveyService, SubmitSurveyDto, SurveyFilters, SurveyQuestion } from "@/api/services/customer-survey";

export const useCustomerSurvey = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

   // 1. Lấy danh sách câu hỏi (Dùng cho cả User và Admin)
   const useQuestions = (filters: SurveyFilters) => {
    return useQuery({
      queryKey: ["customer-survey", "questions", filters], 
      queryFn: async () => {
        const res = await customerSurveyService.getQuestions(filters);
        return res; 
      },
    });
  };
  
  // 2. Lấy danh sách phản hồi
  const useAllResponses = (filters: SurveyFilters) => {
    return useQuery({
      queryKey: ["customer-survey", "responses", filters],
      queryFn: async () => {
        const res = await customerSurveyService.getAllResponses(filters);
        return res;
      },
    });
  };

   // 3. Gửi kết quả khảo sát (User)
  const submitSurveyMutation = useMutation({
    mutationFn: (data: SubmitSurveyDto) => customerSurveyService.submitSurvey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-survey", "responses"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t("shop-feedback.toast.submit_error"));
    },
  });

   // 4. Tạo câu hỏi mới (Admin)
  const createQuestionMutation = useMutation({
    mutationFn: (data: Omit<SurveyQuestion, "_id">) => customerSurveyService.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-survey", "questions"] });
      toast.success(t("shop-feedback.toast.create_success"));
    }
  });

   // 5. Cập nhật câu hỏi (Admin)
   const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SurveyQuestion> }) =>
      customerSurveyService.updateQuestion(id, data),
  
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer-survey", "questions"],
        exact: false,
      });
      toast.success(t("shop-feedback.toast.update_success"));
    },
  
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || t("shop-feedback.toast.update_error");
      toast.error(errorMsg || t("shop-feedback.toast.update_error"));
    },
  });

   // 6. Xóa câu hỏi (Admin)
  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => customerSurveyService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-survey", "questions"] });
      toast.success(t("shop-feedback.toast.delete_success"));
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t("shop-feedback.toast.delete_error"));
    },
  });

  const deleteResponsesMutation = useMutation({
    mutationFn: (id: string) => customerSurveyService.deleteResponse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["customer-survey", "responses"] 
      });
      toast.success(t("shop-feedback.toast.delete_success"));
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t("shop-feedback.toast.delete_error"));
    },
  });

  return {
    // Queries
    useQuestions,
    useAllResponses,

    // Actions
    submitSurvey: submitSurveyMutation.mutateAsync,
    createQuestion: createQuestionMutation.mutateAsync,
    updateQuestion: updateQuestionMutation.mutateAsync,
    deleteQuestion: deleteQuestionMutation.mutateAsync,
    deleteResponses: deleteResponsesMutation.mutateAsync,


    // Loading States cho Mutations (Hành động)
    isActionLoading:
      submitSurveyMutation.isPending ||
      createQuestionMutation.isPending ||
      updateQuestionMutation.isPending ||
      deleteQuestionMutation.isPending ||
      deleteResponsesMutation.isPending,

  };
};