import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CreateOrderRequest, 
  orderService, 
  AdminOrderQuery, 
  UpdateOrderAdminRequest 
} from '@/api/services/orderApi';

export const useOrder = (adminParams?: AdminOrderQuery) => {
  const queryClient = useQueryClient();

  // ==========================================
  //                USER QUERIES
  // ==========================================

  // 1. Lấy danh sách đơn hàng cá nhân
  const { data: orders = [], isLoading: loadingOrders, refetch: fetchMyOrders } = useQuery({
    queryKey: ["orders", "me"],
    queryFn: () => orderService.getMyOrders(),
  });

  // ==========================================
  //                ADMIN QUERIES
  // ==========================================

  // 2. Lấy danh sách toàn bộ đơn hàng (Cho Admin)
  const { data: adminOrdersData, isLoading: loadingAdminOrders } = useQuery({
    queryKey: ["orders", "admin", adminParams], // queryKey chứa params để tự động refetch khi filter thay đổi
    queryFn: () => orderService.getAllOrdersAdmin(adminParams || {}),
    enabled: !!adminParams, // Chỉ chạy khi có truyền params (thường ở trang Admin)
  });

  // ==========================================
  //                MUTATIONS
  // ==========================================

  // 3. Đặt hàng
  const placeOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) => orderService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "me"] });
    },
  });

  // 4. Hủy đơn hàng (User)
  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.cancelOrders(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // 5. Cập nhật đơn hàng gộp (Admin: Status, Address, Name...)
  const updateOrderAdminMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderAdminRequest }) => 
      orderService.updateOrderAdmin(id, data),
    onSuccess: () => {
      // Làm mới cả cache của user và admin để dữ liệu đồng bộ
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // 6. Xóa đơn hàng (Admin)
  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.deleteOrderAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "admin"] });
    },
  });

  return { 
    // Data
    orders, 
    adminOrders: adminOrdersData?.data || [],
    pagination: adminOrdersData?.pagination,
    
    // Loading states
    loading: loadingOrders || loadingAdminOrders,
    isPlacingOrder: placeOrderMutation.isPending,
    isUpdating: updateOrderAdminMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,

    // Actions
    fetchMyOrders, 
    placeOrder: placeOrderMutation.mutateAsync,
    cancelOrder: cancelOrderMutation.mutateAsync, 
    updateOrderAdmin: updateOrderAdminMutation.mutateAsync, // Dùng hàm gộp mới
    deleteOrder: deleteOrderMutation.mutateAsync
  };
};