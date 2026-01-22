"use client";

import Title from "@/ui/title";
import { useParams } from "react-router";
import BrandPage from "@/pages/user/brand/page";
import { useTranslation } from "react-i18next";
import { useBrand } from "@/hooks/useBrand";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/api/services/product";
import { Product } from "@/types";

const DetailBrand = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { useActiveBrands } = useBrand();
  const { data: brands = [], isLoading: isBrandLoading } = useActiveBrands();
  const { 
    data: products = [], 
    isLoading: isProductLoading,
    refetch: refetchProducts 
  } = useQuery({
    queryKey: ["products", "active"],
    queryFn: async () => {
      const res = await productService.getActiveProducts();
      return res.data as unknown as Product[]; 
    },
    staleTime: 1000 * 60 * 5,
  });

  const currentSlug = slug || "all";
  const foundBrand = brands.find((b: any) => b.slug?.current === currentSlug);

  return (
    <div>
      <Title className="text-lg mb-5 uppercase tracking-wide">
        {t("brand.page_title")}{" "}
        <span className="font-bold text-primary">
          {currentSlug === "all" ? t("brand.all_products") : foundBrand?.name}
        </span>
      </Title>

      <BrandPage 
        brands={brands} 
        products={products} 
        slug={currentSlug}
        onRefresh={async () => { await refetchProducts(); }} 
        isFetching={isBrandLoading || isProductLoading}
      />
    </div>
  );
};

export default DetailBrand;