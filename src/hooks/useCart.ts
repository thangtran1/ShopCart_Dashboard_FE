import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/api/services/cartApi";

export const useCart = () => {
  const queryClient = useQueryClient();

  // 1. Lấy giỏ hàng từ DB
  const { data: items = [], isLoading: loading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cartService.getCart();
      return res.items;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // 2. Mutation: Thêm sản phẩm
  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.addToCart({ productId, quantity }),
    onSuccess: (response) => {
      const updatedItems = response?.items || response.items;
      queryClient.setQueryData(["cart"], updatedItems);
    },
  });

  // 3. Mutation: Xóa sản phẩm
  const removeMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeItem(productId),
    onSuccess: (response) => {
      const updatedItems = response?.items || response.items;
      queryClient.setQueryData(["cart"], updatedItems);
    },
    onError: (error) => {
      console.error("Lỗi khi xóa sản phẩm:", error);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });

  // 3. Mutation: giảm SL sản phẩm
  const decreaseMutation = useMutation({
    mutationFn: (productId: string) => cartService.decreaseItem(productId),
    onSuccess: (response) => {
      const updatedItems = response?.items || response.items;
      queryClient.setQueryData(["cart"], updatedItems);
    },
    onError: (error) => {
      console.error("Lỗi khi giảm SL sản phẩm:", error);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });

  // 4. Mutation: Làm trống giỏ hàng (MỚI BỔ SUNG)
  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      // Cập nhật cache thành mảng rỗng ngay lập tức
      queryClient.setQueryData(["cart"], []);
    },
    onError: (error) => {
      console.error("Lỗi khi reset giỏ hàng:", error);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });

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