"use client";

import Title from "@/ui/title";
import { useParams } from "react-router";
import CategoryPage from "@/pages/user/category/page";
import { useEffect, useState } from "react";
import { categoryService } from "@/api/services/category";
import { productService } from "@/api/services/product";
import { useTranslation } from "react-i18next";

const DetailCategory = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [category, setCategory] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const response = await categoryService.getActive();
      if (response.success && response.data) setCategory(response.data);
      else setCategory([]);
    };
    fetchCategory();
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await productService.getActiveProducts();
      if (response.success && response.data) setProducts(response.data);
      else setProducts([]);
    };
    fetchProducts();
  }, [category]);

  const currentSlug = slug || "all";
  
  const foundCategory = category.find(cat => cat.slug === currentSlug);

  const categoryDisplayName =
    currentSlug === "all" 
      ? t("category.all_products") 
      : foundCategory?.name || slug;

  return (
    <div>
      <Title className="text-lg mb-5 uppercase tracking-wide">
        {t("category.page_title")}{" "}
        <span className="font-bold text-primary capitalize tracking-wide">
          {categoryDisplayName}
        </span>
      </Title>

      <CategoryPage categories={category} products={products} slug={currentSlug} />
    </div>
  );
};

export default DetailCategory;