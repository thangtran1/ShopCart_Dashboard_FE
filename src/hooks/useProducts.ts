"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { productService } from "@/api/services/product";
import { ProductType } from "@/types/enum";

export const useProduct = () => {
  // Lấy sản phẩm đang hoạt động (cho Shop)
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

  // Lấy sản phẩm theo Tab (cho ProductGrid Trang chủ)
  const useProductsByTab = (tab: string) => {
    return useQuery({
      queryKey: ["products", "tab", tab],
      queryFn: async () => {
        let res;
        switch (tab) {
          case "new": res = await productService.getProductsByNew(); break;
          case "bestSeller": res = await productService.getProductsByBestSeller(); break;
          case "featured": res = await productService.getProductsByFeatured(); break;
          case "deal": res = await productService.getProductsByDeal(); break;
          default: res = await productService.getActiveProducts();
        }
        return res.data || [];
      },
      staleTime: 1000 * 60 * 5, 
    });
  };

  // Tìm kiếm sản phẩm (cho Modal Search)
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

  // Hook lấy sản phẩm theo từng Type (dành cho ProductsPage)
  const useProductsByAllTypes = () => {
    const types = Object.values(ProductType);

    return useQueries({
      queries: types.map((type) => ({
        queryKey: ["products", "type", type],
        queryFn: async () => {
          const res = await productService.getActiveProducts({ productType: type });
          return { type, data: res.data || [] };
        },
        staleTime: 1000 * 60 * 5,
      })),
      combine: (results) => {
        return {
          data: results.reduce((acc, curr) => {
            if (curr.data) acc[curr.data.type] = curr.data.data;
            return acc;
          }, {} as Record<string, any[]>),
          isLoading: results.some((r) => r.isLoading),
          isFetching: results.some((r) => r.isFetching),
          refetch: () => results.forEach((r) => r.refetch()),
        };
      },
    });
  };

  return {
    useActiveProducts,
    useProductsByTab,
    useSearchProducts,
    useProductsByAllTypes
  };
};