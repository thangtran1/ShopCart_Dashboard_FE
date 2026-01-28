import { detailActivityLogForUser, getActivityLogsAdmin } from "@/api/services/activity-logApi";
import { useQuery } from "@tanstack/react-query";

export const useActivityLog = (userId: string) => {
  return useQuery({
    queryKey: ["activityLogs", userId],
    queryFn: async () => {
      const response = await detailActivityLogForUser(userId);
      return response.data.data; 
    },
    staleTime: 5 * 60 * 1000, 
    placeholderData: (previousData) => previousData,
    enabled: !!userId, // Chỉ chạy khi có userId
  });
};

export const useAdminActivityLog = () => {
    return useQuery({
      queryKey: ["adminActivityLogs"],
      queryFn: async () => {
        const response = await getActivityLogsAdmin();
        return response.data.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };