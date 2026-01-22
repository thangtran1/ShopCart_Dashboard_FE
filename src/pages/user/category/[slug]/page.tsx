"use client";

import Title from "@/ui/title";
import { useParams } from "react-router";
import CategoryPage from "@/pages/user/category/page";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCategory } from "@/hooks/useCategory"; 

const DetailCategory = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  
  const { useActiveCategories, useCategoryProducts } = useCategory();
  
  const { 
    data: categoriesData, 
    isLoading: catLoading 
  } = useActiveCategories();

  const { 
    data: productsData, 
    isLoading: prodLoading, 
    refetch: refetchProducts 
  } = useCategoryProducts();

  const categories = useMemo(() => categoriesData || [], [categoriesData]);
  const products = useMemo(() => productsData || [], [productsData]);
  
  const currentSlug = slug || "all";
  const foundCategory = useMemo(() => 
    categories.find(cat => cat.slug === currentSlug), 
    [categories, currentSlug]
  );

  return (
    <div>
      <Title className="text-lg mb-5 uppercase tracking-wide">
        {t("category.page_title")}{" "}
        <span className="font-bold text-primary">
          {currentSlug === "all" ? t("category.all_products") : foundCategory?.name}
        </span>
      </Title>

      <CategoryPage 
        categories={categories} 
        products={products} 
        slug={currentSlug}
        onRefresh={async () => { await refetchProducts(); }} 
        isFetching={catLoading || prodLoading}   
      />
    </div>
  );
};

export default DetailCategory;