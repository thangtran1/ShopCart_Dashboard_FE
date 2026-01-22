"use client";

import { useQuery } from "@tanstack/react-query";
import { brandService } from "@/api/services/brands";

export const useBrand = () => {

  const useActiveBrands = () => {
    return useQuery({
      queryKey: ["brands", "active"],
      queryFn: async () => {
        const res = await brandService.getActive();
        return res.data;
      },
      staleTime: 1000 * 60 * 30, 
    });
  };

  return {
    useActiveBrands,
  };
};