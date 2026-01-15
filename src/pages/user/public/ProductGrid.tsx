"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import HomeTabbar from "./HomeTabbar";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { productService } from "@/api/services/product";
import { useTranslation } from "react-i18next";
import ServiceFeatures from "./ServiceFeatures";
import PageLoading from "@/components/common/loading/PageLoading";

const extractProducts = async (apiCall: () => Promise<any>): Promise<any[]> => {
  const res = await apiCall();

  if (Array.isArray(res)) return res;

  if (res?.data && Array.isArray(res.data)) return res.data;

  if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;

  return [];
};

const ProductGrid = () => {
  const { t } = useTranslation();

  const productTabs = [
    { title: t("product.all"), value: "all" },
    { title: t("product.new"), value: "new" },
    { title: t("product.bestSeller"), value: "bestSeller" },
    { title: t("product.featured"), value: "featured" },
    { title: t("product.deal"), value: "deal" },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultTab = productTabs[0]?.value || "all";
  const tabFromUrl = searchParams.get("tab");
  const selectedTab =
    tabFromUrl && productTabs.some(t => t.value === tabFromUrl)
      ? tabFromUrl
      : defaultTab;

  const handleTabSelect = useCallback(
    (tab: string) => setSearchParams({ tab }),
    [setSearchParams]
  );

  // Map tab → API function
  const tabApiMap = useMemo<Record<string, () => Promise<any[]>>>(() => ({
    all: () => extractProducts(() => productService.getActiveProducts()),
    new: () => extractProducts(() => productService.getProductsByNew()),
    bestSeller: () => extractProducts(() => productService.getProductsByBestSeller()),
    featured: () => extractProducts(() => productService.getProductsByFeatured()),
    deal: () => extractProducts(() => productService.getProductsByDeal()),
  }), []);

  const fetchProductsByTab = useCallback(async () => {
    setLoading(true);
    try {
      const fetchFn = tabApiMap[selectedTab] || tabApiMap.all;
      const data = await fetchFn();
      setProducts(data);
    } catch (error) {
      console.error("Product fetching Error", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchProductsByTab();
  }, [selectedTab, fetchProductsByTab]);

  const handleRefresh = useCallback(() => fetchProductsByTab(), [fetchProductsByTab]);
  const handleViewAll = useCallback(() => setSearchParams({ tab: defaultTab }), [
    setSearchParams,
    defaultTab,
  ]);

  return (
    <div className="flex flex-col lg:px-0 mb-2">
      <div className="mb-2">
        <img className="rounded-lg  w-full" alt="img" src="https://cdn2.cellphones.com.vn/insecure/rs:fill:1200:75/q:90/plain/https://dashboard.cellphones.com.vn/storage/s-edu-2-0-special-desk.gif" />
      </div>
      <HomeTabbar
        productType={productTabs}
        selectedTab={selectedTab}
        onTabSelect={handleTabSelect}
      />

      {loading ? (
        <PageLoading
        height={300}
        text={t('shop.loading_products')}
      />
      ) : products.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-2">
            <AnimatePresence mode="popLayout"> 
              {products.map(product => (
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
        <NoProductAvailable 
          onRefresh={handleRefresh} 
          onViewAll={handleViewAll} />
      )}
    </div>
  );
};

export default ProductGrid;
