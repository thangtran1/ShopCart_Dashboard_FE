"use client";

import Title from "@/ui/title";
import { useParams } from "react-router";
import BrandPage from "@/pages/user/brand/page";
import { useEffect, useState, useCallback } from "react";
import { productService } from "@/api/services/product";
import { brandService } from "@/api/services/brands";
import { useTranslation } from "react-i18next";

const DetailBrand = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [brandRes, prodRes] = await Promise.all([
        brandService.getActive(),
        productService.getActiveProducts()
      ]);
      if (brandRes.success) setBrands(brandRes.data);
      if (prodRes.success) setProducts(prodRes.data);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentSlug = slug || "all";
  const foundBrand = brands.find(b => b.slug === currentSlug);

  const brandDisplayName = currentSlug === "all" 
      ? t("brand.all_products") 
      : foundBrand?.name || slug;

  return (
    <div className="container mx-auto">
      <Title className="text-lg mb-5 uppercase tracking-wide">
        {t("brand.page_title")}{" "}
        <span className="font-bold text-primary capitalize tracking-wide">
          {brandDisplayName}
        </span>
      </Title>

      <BrandPage 
        brands={brands} 
        products={products} 
        slug={currentSlug} 
        onRefresh={fetchData} 
        isFetching={isFetching}
      />
    </div>
  );
};

export default DetailBrand;