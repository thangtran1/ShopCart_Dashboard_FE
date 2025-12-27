import { addressService, CreateAddressDto } from "@/api/services/addressesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddressActions = (onClose?: () => void) => {
  const queryClient = useQueryClient();

  // 1. GET ALL
  const { data: addressData, isLoading: isFetching } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAll(1, 50), // Lấy trang 1, limit 50
  });

  // 2. CREATE
  const { mutateAsync: createAddress, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateAddressDto) => addressService.create(data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Thêm địa chỉ mới thành công");
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        if (onClose) onClose();
      }
    },
    onError: (err: any) => toast.error(err?.message || "Không thể thêm địa chỉ"),
  });

  // 3. UPDATE
  const { mutateAsync: updateAddress, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAddressDto }) => 
      addressService.updateAddress(id, data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Cập nhật địa chỉ thành công");
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        if (onClose) onClose();
      }
    },
    onError: (err: any) => toast.error(err?.message || "Cập nhật thất bại"),
  });

  // 4. DELETE
  const { mutateAsync: deleteAddress, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Xóa địa chỉ thành công");
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }
    },
    onError: (err: any) => toast.error(err?.message || "Xóa thất bại"),
  });

  return {
    addresses: addressData?.data || [],
    isFetching,
    createAddress,
    isCreating,
    updateAddress,
    isUpdating,
    deleteAddress,
    isDeleting
  };
};