import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flashSaleService } from "@/api/services/flashSale";

export const useFlashSales = () => {
  const queryClient = useQueryClient();

  // Admin Hooks
  const useGetAll = (filters?: { status?: string; page?: number; limit?: number }) => useQuery({
    queryKey: ["flash-sales", filters],
    queryFn: async () => {
      const res = await flashSaleService.getAll(filters);
      return res?.data?.data || { data: [], pagination: { total: 0, page: 1, limit: 10 } };
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => flashSaleService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flash-sales"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => flashSaleService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flash-sales"] }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => flashSaleService.toggleStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flash-sales"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => flashSaleService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flash-sales"] }),
  });

  // Public Hook
  const useActiveFlashSale = () => useQuery({
    queryKey: ["flash-sales", "active"],
    queryFn: async () => {
      const res = await flashSaleService.getActive();
      return res?.data?.data || null;
    },
    staleTime: 1000 * 60 * 1, // Reload every min
  });

  return {
    useGetAll,
    useActiveFlashSale,
    createMutation,
    updateMutation,
    toggleStatusMutation,
    deleteMutation,
  };
};
