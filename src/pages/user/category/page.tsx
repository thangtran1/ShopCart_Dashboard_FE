"use client";

import { Product } from "@/types";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Package, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"; // Thêm Chevron
import NoProductAvailable from "@/pages/user/public/NoProductAvailable";
import ProductCard from "@/pages/user/public/ProductCard";
import { useEffect, useMemo, useState } from "react";
import PageLoading from "@/components/common/loading/PageLoading";
import { useTranslation } from "react-i18next";

interface Props {
  categories: any[];
  slug?: string;
  products: Product[];
  onRefresh?: () => Promise<void>; 
  isFetching?: boolean;         
}

const CategoryPage = ({ 
  categories, 
  products = [],
  slug, 
  onRefresh, 
  isFetching 
}: Props) => {
  const { t } = useTranslation();
  const [currentSlug, setCurrentSlug] = useState(slug || "all");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug && slug !== currentSlug) setCurrentSlug(slug);
  }, [slug, currentSlug]);

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    navigate(newSlug === "all" ? "/category" : `/category/${newSlug}`);
  };

  const categoryCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      const categoryId = typeof p.category === "object" ? p.category._id : p.category;
      if (categoryId) {
        map[categoryId] = (map[categoryId] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  const totalProductCount = products.length;

  const currentCategory = categories.find(cat => cat.slug === currentSlug);

  const filteredProducts = useMemo(() => {
    if (currentSlug === "all") return products;
    if (!currentCategory) return [];
    return products.filter(p => {
      const categoryId = typeof p.category === "object" ? p.category._id : p.category;
      return categoryId === currentCategory._id;
    });
  }, [products, currentSlug, currentCategory]);

  return (
    <div className="pb-3 flex flex-row items-start gap-4">
      <aside className={`sticky top-24 rounded-xl shadow-md border bg-card transition-all duration-300 overflow-hidden ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}>
        
        <div className={`p-4 bg-primary flex items-center shadow-sm ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
          {!isSidebarCollapsed && (
            <h3 className="font-bold text-white flex items-center gap-2 truncate text-sm uppercase tracking-tighter">
              <Package className="w-4 h-4 flex-none" /> {t("category.sidebar_title")}
            </h3>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 hover:bg-white/20 rounded-md transition-colors text-white"
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
            onClick={() => handleCategoryChange("all")}
            className={`group flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all
              ${currentSlug === "all" ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-accent"}`}
          >
            <LayoutGrid size={20} className="flex-none" />
            {!isSidebarCollapsed && (
              <div className="flex justify-between items-center w-full min-w-0">
                <span className="truncate text-sm">{t("category.all_categories")}</span>
                <span className="text-[10px] font-bold bg-primary/20 px-2 py-0.5 rounded-full">{totalProductCount}</span>
              </div>
            )}
          </button>

          {categories?.map(item => (
            <button
              key={item._id}
              onClick={() => handleCategoryChange(item.slug)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all
                ${item.slug === currentSlug ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-accent"}`}
            >
              <Package size={20} className="flex-none" />
              {!isSidebarCollapsed && (
                <div className="flex justify-between items-center w-full min-w-0">
                  <span className="truncate text-sm">{item.name}</span>
                  <span className="text-[10px] font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                    {categoryCountMap[item._id] || 0}
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
          className="mb-4 rounded-xl shadow-sm border p-4 bg-card"
        >
          <h2 className="text-2xl font-black text-primary uppercase">
            {currentSlug === "all" ? t("category.all_categories") : currentCategory?.name}
          </h2>
          <p className="text-muted-foreground text-sm mt-1 italic">
            {currentSlug === "all" ? t("category.explore_all") : currentCategory?.description}
          </p>
        </motion.div>

        {isFetching ? (
          <PageLoading height={400} text={t("category.loading")} />
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
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NoProductAvailable
            onRefresh={onRefresh} 
            onViewAll={() => navigate("/category")}
          />
        )}
      </main>
    </div>
  );
};

export default CategoryPage;