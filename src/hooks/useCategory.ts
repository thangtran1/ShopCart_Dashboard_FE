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

  return {
    useActiveCategories,
    useCategoryProducts,
  };
};