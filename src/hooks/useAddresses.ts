"use client";
import { addressService, CreateAddressDto } from "@/api/services/addressesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useAddressActions = (onClose?: () => void) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // 1. GET ALL
  const { data: addressData, isLoading: isFetching } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAll(1, 50),
  });

  // 2. CREATE
  const { mutateAsync: createAddress, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateAddressDto) => addressService.create(data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t("address.toast.create_success"));
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        if (onClose) onClose();
      }
    },
    onError: (err: any) => toast.error(err?.message || t("address.toast.create_error")),
  });

  // 3. UPDATE
  const { mutateAsync: updateAddress, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAddressDto }) => 
      addressService.updateAddress(id, data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t("address.toast.update_success"));
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        if (onClose) onClose();
      }
    },
    onError: (err: any) => toast.error(err?.message || t("address.toast.update_error")),
  });

  // 4. DELETE
  const { mutateAsync: deleteAddress, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t("address.toast.delete_success"));
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }
    },
    onError: (err: any) => toast.error(err?.message || t("address.toast.delete_error")),
  });

  // 5. DELETE ADMIN
  const { mutateAsync: deleteAddressAdmin, isPending: isAdminDeleting } = useMutation({
    mutationFn: (id: string) => addressService.deleteAddressAdmin(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t("address.toast.admin_delete_success"));
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }
    },
    onError: (err: any) => toast.error(err?.message || t("address.toast.delete_error")),
  });

  return {
    addresses: addressData?.data || [],
    isFetching,
    createAddress,
    isCreating,
    updateAddress,
    isUpdating,
    deleteAddress,
    isDeleting,
    deleteAddressAdmin,
    isAdminDeleting
  };
};