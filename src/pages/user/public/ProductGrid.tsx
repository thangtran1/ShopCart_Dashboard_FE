"use client";

import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import HomeTabbar from "./HomeTabbar";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { useTranslation } from "react-i18next";
import ServiceFeatures from "./ServiceFeatures";
import PageLoading from "@/components/common/loading/PageLoading";
import { useProduct } from "@/hooks/useProducts";

const ProductGrid = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { useProductsByTab } = useProduct();

  const productTabs = [
    { title: t("product.all"), value: "all" },
    { title: t("product.new"), value: "new" },
    { title: t("product.bestSeller"), value: "bestSeller" },
    { title: t("product.featured"), value: "featured" },
    { title: t("product.deal"), value: "deal" },
  ];

  const defaultTab = "all";
  const selectedTab = searchParams.get("tab") || defaultTab;

  const { 
    data: products = [], 
    isLoading, 
    refetch 
  } = useProductsByTab(selectedTab);

  const handleTabSelect = useCallback(
    (tab: string) => setSearchParams({ tab }),
    [setSearchParams]
  );

  const handleViewAll = () => setSearchParams({ tab: defaultTab });

  return (
    <div className="flex flex-col lg:px-0 mb-2">
      <div className="mb-2">
        <img 
          className="rounded-lg w-full" 
          alt="banner" 
          src="https://cdn2.cellphones.com.vn/insecure/rs:fill:1200:75/q:90/plain/https://dashboard.cellphones.com.vn/storage/s-edu-2-0-special-desk.gif" 
        />
      </div>

      <HomeTabbar
        productType={productTabs}
        selectedTab={selectedTab}
        onTabSelect={handleTabSelect}
      />

      {isLoading ? (
        <PageLoading height={300} text={t('shop.loading_products')} />
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-2">
            <AnimatePresence mode="popLayout">
              {products.map((product: any) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-6 border-y border-primary/30">
            <ServiceFeatures />
          </div>
        </>
      ) : (
        <NoProductAvailable onRefresh={refetch} onViewAll={handleViewAll} />
      )}
    </div>
  );
};

export default ProductGrid;
