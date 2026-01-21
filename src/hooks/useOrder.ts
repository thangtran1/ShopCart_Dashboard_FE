import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CreateOrderRequest, 
  orderService, 
  AdminOrderQuery, 
  UpdateOrderAdminRequest 
} from '@/api/services/orderApi';
import { useUserToken } from "@/store/userStore";

export const useOrder = (param?: string | AdminOrderQuery) => {
  const queryClient = useQueryClient();
  const token = useUserToken();
  const isObject = typeof param === 'object' && param !== null;
  const userStatus = isObject ? undefined : (param as string);
  const adminParams = isObject ? (param as AdminOrderQuery) : undefined;


  const { data: orders = [], isLoading: loadingOrders, refetch: fetchMyOrders } = useQuery({
    queryKey: ["orders", "me", userStatus || 'all', token?.accessToken], 
    queryFn: async () => {
      if (!token?.accessToken) return [];
      return orderService.getMyOrders(userStatus);
    },
    enabled: !isObject && !!token?.accessToken 
  });

  const { data: adminOrdersData, isLoading: loadingAdminOrders } = useQuery({
    queryKey: ["orders", "admin", adminParams],
    queryFn: () => orderService.getAllOrdersAdmin(adminParams || {}),
    // Chỉ chạy khi param truyền vào là một Object filters (đang ở giao diện Admin)
    enabled: isObject,
  });

  const placeOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) => orderService.createOrder(orderData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.cancelOrders(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const updateOrderAdminMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderAdminRequest }) => 
      orderService.updateOrderAdmin(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.deleteOrderAdmin(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders", "admin"] }),
  });

  const rePaymentMutation = useMutation({
    mutationFn: (amount: string) => orderService.testPaymentMoMo(amount),
  });

  const confirmMomoPaymentMutation = useMutation({
    mutationFn: ({ orderNumber, resultCode }: { orderNumber: string; resultCode: string }) => 
      orderService.confirmMomoPayment(orderNumber, resultCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return { 
    orders, 
    adminOrders: adminOrdersData?.data || [],
    pagination: adminOrdersData?.pagination,
    
    loading: isObject ? loadingAdminOrders : loadingOrders,
    isPlacingOrder: placeOrderMutation.isPending,
    isUpdating: updateOrderAdminMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,

    fetchMyOrders, 
    placeOrder: placeOrderMutation.mutateAsync,
    cancelOrder: cancelOrderMutation.mutateAsync, 
    updateOrderAdmin: updateOrderAdminMutation.mutateAsync,
    deleteOrder: deleteOrderMutation.mutateAsync,

    confirmMomoPayment: confirmMomoPaymentMutation.mutateAsync,
    isConfirming: confirmMomoPaymentMutation.isPending,

    rePayment: rePaymentMutation.mutateAsync,
    isRePaying: rePaymentMutation.isPending,
  };
};