import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/api/services/cartApi";
import { useUserToken } from "@/store/userStore";

export const useCart = () => {
  const queryClient = useQueryClient();
  const token = useUserToken();
  const cartKey = ["cart", token?.accessToken];

  // 1. Lấy giỏ hàng từ DB
  const { data: items = [], isLoading: loading } = useQuery({
    queryKey: cartKey, 
    queryFn: async () => {
      if (!token?.accessToken) return [];
      const res = await cartService.getCart();
      return res.items || [];
    },
    enabled: !!token?.accessToken, // Chỉ chạy khi đã login
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // 2. Mutation: Thêm sản phẩm
  const addMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (!token?.accessToken) {
        return { items: [] }; 
      }
      return cartService.addToCart({ productId, quantity });
    },
    onSuccess: (response) => {
      const updatedItems = response?.items || [];
      queryClient.setQueryData(cartKey, updatedItems);
    },
  });

  // 3. Mutation: Xóa sản phẩm
  const removeMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeItem(productId),
    onSuccess: (response) => {
      const updatedItems = response?.items || [];
      queryClient.setQueryData(cartKey, updatedItems);
    },
    onError: (error) => {
      console.error("Lỗi khi xóa sản phẩm:", error);
      queryClient.invalidateQueries({ queryKey: cartKey });
    }
  });

  // 4. Mutation: Giảm SL sản phẩm
  const decreaseMutation = useMutation({
    mutationFn: (productId: string) => cartService.decreaseItem(productId),
    onSuccess: (response) => {
      const updatedItems = response?.items || [];
      queryClient.setQueryData(cartKey, updatedItems);
    },
    onError: (error) => {
      console.error("Lỗi khi giảm SL sản phẩm:", error);
      queryClient.invalidateQueries({ queryKey: cartKey });
    }
  });

  // 5. Mutation: Làm trống giỏ hàng
  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.setQueryData(cartKey, []);
    },
    onError: (error) => {
      console.error("Lỗi khi reset giỏ hàng:", error);
      queryClient.invalidateQueries({ queryKey: cartKey });
    }
  });


  // Tính tổng số lượng thực tế (Ví dụ: 1 iPhone + 2 Ốp lưng = 2 món)
  const totalAmount = items.reduce(
    (total: number, item: any) => total + item.product.price * item.quantity,
    0
  );

  return {
    items,
    loading,
    addToCart: addMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    decreaseItem: decreaseMutation.mutateAsync,
    clearCart: clearMutation.mutateAsync,
    totalAmount,
  };
};