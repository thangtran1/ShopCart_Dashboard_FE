"use client";

import Title from "@/ui/title";
import { useParams } from "react-router";
import BrandPage from "@/pages/user/brand/page";
import { useEffect, useState } from "react";
import { productService } from "@/api/services/product";
import { brandService } from "@/api/services/brands";
import { useTranslation } from "react-i18next";

const DetailBrand = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchBrand = async () => {
      const response = await brandService.getActive();
      if (response.success && response.data) setBrands(response.data);
      else setBrands([]);
    };
    fetchBrand();
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await productService.getActiveProducts();
      if (response.success && response.data) setProducts(response.data);
      else setProducts([]);
    };
    fetchProducts();
  }, [brands]);

  const currentSlug = slug || "all";
  
  const foundBrand = brands.find(b => b.slug === currentSlug);

  const brandDisplayName =
    currentSlug === "all" 
      ? t("brand.all_products") 
      : foundBrand?.name || slug;

  return (
    <div>
      <Title className="text-lg mb-5 uppercase tracking-wide">
        {t("brand.page_title")}{" "}
        <span className="font-bold text-primary capitalize tracking-wide">
          {brandDisplayName}
        </span>
      </Title>

      <BrandPage brands={brands} products={products} slug={currentSlug} />
    </div>
  );
};

export default DetailBrand;