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
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        categoryService.getActive(),
        productService.getActiveProducts()
      ]);

      if (catRes.success) setCategory(catRes.data);
      if (prodRes.success) setProducts(prodRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentSlug = slug || "all";
  const foundCategory = category.find(cat => cat.slug === currentSlug);
  const categoryDisplayName = currentSlug === "all" 
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

      <CategoryPage 
        categories={category} 
        products={products} 
        slug={currentSlug}
        onRefresh={fetchData} 
        isFetching={loading}   
      />
    </div>
  );
};

export default DetailCategory;