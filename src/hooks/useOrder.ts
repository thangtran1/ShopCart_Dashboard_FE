import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateOrderRequest, orderService } from '@/api/services/orderApi';

export const useOrder = () => {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách đơn hàng của tôi
  const { data: orders = [], isLoading: loadingOrders, refetch: fetchMyOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getMyOrders(),
    enabled: true,
  });

  // 2. Mutation đặt hàng
  const placeOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) => orderService.createOrder(orderData),
    onSuccess: () => {
      // Làm mới danh sách đơn hàng trong cache sau khi đặt hàng thành công
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // 3. Mutation Hủy đơn hàng
  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.cancelOrders(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // 4. Mutation Thay đổi trạng thái (Admin)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
    },
  });

  return { 
    orders, 
    loading: loadingOrders || placeOrderMutation.isPending || cancelOrderMutation.isPending, 
    isPlacingOrder: placeOrderMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    fetchMyOrders, 
    placeOrder: placeOrderMutation.mutateAsync,
    cancelOrder: cancelOrderMutation.mutateAsync, 
    updateStatus: updateStatusMutation.mutateAsync
  };
};