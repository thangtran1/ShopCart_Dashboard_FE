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

  return { 
    orders, 
    loading: loadingOrders || placeOrderMutation.isPending, 
    isPlacingOrder: placeOrderMutation.isPending,
    fetchMyOrders, 
    placeOrder: placeOrderMutation.mutateAsync 
  };
};