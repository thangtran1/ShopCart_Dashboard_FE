"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService, type Category } from "@/api/services/category";
import { productService } from "@/api/services/product";

export const useCategory = () => {

  const useActiveCategories = () => {
    return useQuery({
      queryKey: ["categories", "active"],
      queryFn: async () => {
        const res = await categoryService.getActive();
        return res.data as Category[];
      },
      staleTime: 1000 * 60 * 30,
    });
  };

  const useCategoryProducts = () => {
    return useQuery({
      queryKey: ["products", "active"],
      queryFn: async () => {
        const res = await productService.getActiveProducts();
        return res.data; 
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  const useSearchProducts = (query: string) => {
    return useQuery<any[]>({
      queryKey: ["products", "search", query],
      queryFn: async () => {
        const res = await productService.getActiveProducts();
        const allProducts = res.data as any[];

        if (!query.trim()) return [];

        return allProducts.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand?.name.toLowerCase().includes(query.toLowerCase())
        );
      },
      enabled: query.length > 0,
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    useActiveCategories,
    useCategoryProducts,
    useSearchProducts,
  };
};