"use client";

import { Product } from "@/types";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Package, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import NoProductAvailable from "@/pages/user/public/NoProductAvailable";
import ProductCard from "@/pages/user/public/ProductCard";
import { useEffect, useMemo, useState } from "react";
import PageLoading from "@/components/common/loading/PageLoading";
import { useTranslation } from "react-i18next";

interface Props {
  brands: any[];
  slug?: string;
  products: Product[];
  onRefresh?: () => Promise<void>;
  isFetching?: boolean;
}

const BrandPage = ({
  brands,
  products: allProducts,
  slug,
  onRefresh,
  isFetching,
}: Props) => {
  const { t } = useTranslation();
  const [currentSlug, setCurrentSlug] = useState(slug || "all");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug && slug !== currentSlug) setCurrentSlug(slug);
  }, [slug, currentSlug]);

  const handleBrandChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    navigate(newSlug === "all" ? "/brand" : `/brand/${newSlug}`);
  };

  const brandCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    allProducts.forEach((p) => {
      const brandId = typeof p.brand === "object" ? p.brand._id : p.brand;
      if (brandId) map[brandId] = (map[brandId] || 0) + 1;
    });
    return map;
  }, [allProducts]);

  const currentBrand = useMemo(
    () => brands.find((b) => b.slug === currentSlug),
    [brands, currentSlug]
  );

  const filteredProducts = useMemo(() => {
    if (currentSlug === "all") return allProducts;
    if (!currentBrand) return [];
    return allProducts.filter((p) => {
      const brandId = typeof p.brand === "object" ? p.brand._id : p.brand;
      return brandId === currentBrand._id;
    });
  }, [allProducts, currentSlug, currentBrand]);

  return (
    <div className="pb-3 flex flex-row items-start gap-4">
      <aside
        className={`sticky top-24 rounded-xl shadow-md border bg-card transition-all duration-300 overflow-hidden ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 bg-primary flex justify-between items-center shadow-sm">
          {!isSidebarCollapsed && (
            <h3 className="font-bold text-primary-foreground flex items-center gap-2 truncate text-sm uppercase tracking-tighter">
              <Package className="w-4 h-4 flex-none" />{" "}
              {t("brand.sidebar_title")}
            </h3>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 hover:bg-white/20 rounded-md transition-colors text-primary-foreground mx-auto"
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        <nav className="flex flex-col p-2 max-h-[70vh] overflow-y-auto scrollbar-hide">
          <button
            onClick={() => handleBrandChange("all")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all mb-1
              ${
                currentSlug === "all"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent"
              }`}
          >
            <LayoutGrid size={20} className="flex-none" />
            {!isSidebarCollapsed && (
              <span className="truncate text-sm">{t("brand.all_brands")}</span>
            )}
          </button>

          {brands?.map((item) => (
            <button
              key={item._id}
              onClick={() => handleBrandChange(item.slug)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all mb-1
                ${
                  item.slug === currentSlug
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent"
                }`}
            >
              <Package size={20} className="flex-none" />
              {!isSidebarCollapsed && (
                <div className="flex justify-between items-center w-full min-w-0">
                  <span className="truncate text-sm">{item.name}</span>
                  <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {brandCountMap[item._id] || 0}
                  </span>
                </div>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <motion.div
          key={currentSlug}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 rounded-xl shadow-sm border p-4 bg-card flex justify-between items-center"
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-primary uppercase">
              {currentSlug === "all"
                ? t("brand.all_brands")
                : currentBrand?.name}
            </h2>
            <p className="text-muted-foreground text-sm italic">
              {currentSlug === "all"
                ? t("brand.explore_all")
                : currentBrand?.description}
            </p>
          </div>
          {currentSlug !== "all" && currentBrand?.logo && (
            <div className="w-16 h-16 bg-white p-2 border rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={currentBrand.logo}
                alt={currentBrand.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </motion.div>

        {isFetching ? (
          <PageLoading height={400} text={t("brand.loading")} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NoProductAvailable
            onRefresh={onRefresh}
            onViewAll={() => navigate("/brand")}
          />
        )}
      </main>
    </div>
  );
};

export default BrandPage;