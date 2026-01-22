"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/api/services/product";

export const useProduct = () => {
  const useActiveProducts = (filters?: { category?: string; brand?: string; price?: string }) => {
    return useQuery({
      queryKey: ["products", "active", filters],
      queryFn: async () => {
        const res = await productService.getActiveProducts();
        return res.data || [];
      },
      staleTime: 1000 * 60 * 5,
    });
  };
  const useSearchProducts = (query: string) => {
    return useQuery<any[]>({
      queryKey: ["products", "search", query],
      queryFn: async () => {
        if (!query.trim()) return [];

        const res = await productService.getActiveProducts();
        const allProducts = res.data as any[];

        return allProducts.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand?.name.toLowerCase().includes(query.toLowerCase())
        );
      },
      enabled: query.trim().length > 0, 
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    useActiveProducts,
    useSearchProducts
  };
};