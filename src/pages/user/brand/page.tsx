"use client";

import { Product } from "@/types";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Package, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import NoProductAvailable from "@/pages/user/public/NoProductAvailable";
import ProductCard from "@/pages/user/public/ProductCard";
import { useMemo, useState } from "react";
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
  brands = [],
  products: allProducts = [],
  slug = "all",
  onRefresh,
  isFetching,
}: Props) => {
  const { t } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleBrandChange = (newSlug: string) => {
    if (newSlug === slug) return;
    navigate(newSlug === "all" ? "/brand" : `/brand/${newSlug}`);
  };

  const brandCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    allProducts.forEach((p) => {
      const brandId = p.brand?._id;
      if (brandId) map[brandId] = (map[brandId] || 0) + 1;
    });
    return map;
  }, [allProducts]);

  const currentBrand = useMemo(() => {
    return brands.find((b) => {
      const bSlug = typeof b.slug === 'object' ? b.slug?.current : b.slug;
      return bSlug === slug;
    });
  }, [brands, slug]);

  const filteredProducts = useMemo(() => {
    if (slug === "all") return allProducts;
    if (!currentBrand) return [];
    return allProducts.filter((p) => p.brand?._id === currentBrand._id);
  }, [allProducts, slug, currentBrand]);

  return (
    <div className="pb-3 flex flex-row items-start gap-4">
      <aside
        className={`sticky top-24 rounded-xl shadow-md border bg-card transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? "w-16" : "w-64"
          }`}
      >
        <div className={`p-4 bg-primary flex items-center shadow-sm ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
          {!isSidebarCollapsed && (
            <h3 className="font-bold text-white flex items-center gap-2 truncate text-sm uppercase tracking-tighter">
              <Package className="w-4 h-4 flex-none" />{" "}
              {t("brand.sidebar_title")}
            </h3>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 hover:bg-white/20 rounded-md transition-colors text-white"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex flex-col p-2 max-h-[70vh] overflow-y-auto scrollbar-hide">
          <button
            onClick={() => handleBrandChange("all")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all mb-1
              ${slug === "all" ? "bg-primary/20 text-primary font-bold" : "text-foreground hover:bg-accent"}`}
          >
            <LayoutGrid size={20} className="flex-none" />
            {!isSidebarCollapsed && <span className="truncate text-sm">{t("brand.all_brands")}</span>}
          </button>

          {brands.map((item) => {
            const itemSlug = typeof item.slug === 'object' ? item.slug?.current : item.slug;

            if (!itemSlug) return null; 

            const isActive = itemSlug === slug;

            return (
              <button
                key={item._id}
                onClick={() => handleBrandChange(itemSlug)}
                className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all mb-1
        ${isActive ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-accent"}`}
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
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <motion.div
          key={slug}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-2 rounded-xl shadow-sm border p-4 bg-card"
        >
          <div className="flex items-center gap-4">
            {slug !== "all" && currentBrand?.image?.asset?.url && (
              <div className="w-16 h-16 bg-white p-2 border rounded-lg overflow-hidden flex items-center justify-center flex-none">
                <img src={currentBrand.image.asset.url} alt={currentBrand.name} className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-primary uppercase leading-none">
                {slug === "all" ? t("brand.all_brands") : currentBrand?.name}
              </h2>
              <p className="text-muted-foreground text-sm italic line-clamp-2">
                {slug === "all" ? t("brand.explore_all") : currentBrand?.description || t("brand.no_description")}
              </p>
            </div>
          </div>
        </motion.div>

        {isFetching ? (
          <PageLoading height={400} text={t("brand.loading")} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NoProductAvailable onRefresh={onRefresh} onViewAll={() => navigate("/brand")} />
        )}
      </main>
    </div>
  );
};

export default BrandPage;