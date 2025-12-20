"use client";

import { Product } from "@/types";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Package, LayoutGrid } from "lucide-react";
import NoProductAvailable from "@/pages/user/public/NoProductAvailable";
import ProductCard from "@/pages/user/public/ProductCard";
import { useEffect, useState } from "react";

interface Props {
  brands: any[];
  slug?: string;
  products: Product[];
}

const BrandPage = ({ brands, products: allProducts, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug || "all");
  const [loading, setLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (slug && slug !== currentSlug) setCurrentSlug(slug);
  }, [slug]);

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    navigate(newSlug === "all" ? "/brand" : `/brand/${newSlug}`);
  };

  const getBrandCount = (brandId: string) =>
    allProducts.filter((p) => p.brand?._id === brandId).length;

  const totalProductCount = allProducts.length;

  // Lọc sản phẩm theo categorySlug
  const filteredProducts = allProducts.filter((p) =>
    currentSlug === "all"
      ? true
      : p.brand?._id === brands.find((cat) => cat.slug === currentSlug)?._id
  );

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 200);
  };
  const handleViewAll = () => navigate("/brand");

  const currentCategory = brands.find((cat) => cat.slug === currentSlug);
  console.log("🚀 ~ BrandPage ~ currentCategory:", currentCategory);

  return (
    <div className="pb-3 flex flex-row items-start gap-2">
      {/* Sidebar */}
      <div
        className={`rounded-lg shadow-sm border transition-all duration-300 ${
          isSidebarCollapsed ? "w-12" : "w-54"
        }`}
      >
        <div className="p-4 bg-primary/90 flex justify-between items-center">
          {!isSidebarCollapsed && (
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 flex-none" /> Thương hiệu
            </h3>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-foreground cursor-pointer text-sm font-medium hover:text-gray-200"
          >
            {isSidebarCollapsed ? "»" : "«"}
          </button>
        </div>

        <div className="flex flex-col">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`group flex items-center gap-2 px-3 py-3 border-b hover:bg-primary/10 transition-colors duration-200 relative
              ${
                currentSlug === "all"
                  ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                  : "text-foreground"
              }`}
          >
            <LayoutGrid className="w-5 h-5 flex-none" />
            <span
              className={`flex-1 truncate cursor-pointer transition-opacity duration-300 ${
                isSidebarCollapsed
                  ? "opacity-0 absolute left-16 shadow-md px-2 py-1 rounded-md group-hover:opacity-100 bg-background"
                  : "opacity-100"
              }`}
            >
              Tất cả thương hiệu
            </span>
            {!isSidebarCollapsed && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full flex-none">
                {totalProductCount}
              </span>
            )}
          </button>

          {brands?.map((item) => (
            <button
              key={item._id}
              onClick={() => handleCategoryChange(item.slug || "")}
              className={`group cursor-pointer flex justify-between items-center px-3 py-3 border-b hover:bg-primary/10 transition-colors duration-200
                ${
                  item.slug === currentSlug
                    ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                    : "text-foreground"
                }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Package className="w-5 h-5 flex-none" />
                <span
                  className={`truncate overflow-hidden whitespace-nowrap min-w-0 ${
                    isSidebarCollapsed
                      ? "opacity-0 absolute left-16 shadow-md px-2 py-1 rounded-md group-hover:opacity-100 bg-background"
                      : "opacity-100"
                  }`}
                >
                  {item.name}
                </span>
              </div>
              {!isSidebarCollapsed && (
                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full flex-none">
                  {getBrandCount(item._id)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 rounded-lg shadow-sm border p-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary capitalize mb-1">
                {currentSlug === "all"
                  ? "Tất cả thương hiệu"
                  : currentCategory?.name}
              </h2>
              {currentSlug === "all" ? (
                <p className="text-foreground text-sm">
                  Khám phá tất cả sản phẩm trong cửa hàng
                </p>
              ) : (
                currentCategory?.description && (
                  <p className="text-foreground text-sm">
                    {currentCategory.description}
                  </p>
                )
              )}
              {!loading && filteredProducts.length > 0 && (
                <p className="text-sm text-primary mt-2 font-medium">
                  {filteredProducts.length} Sản phẩm có sẵn
                </p>
              )}
            </div>

            {currentSlug !== "all" && currentCategory?.logo && (
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-md">
                <img
                  src={currentCategory.logo}
                  alt={currentCategory.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-80 space-y-4 text-center rounded-lg shadow-sm border">
            <motion.div
              className="flex items-center space-x-2 text-primary"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Đang tải sản phẩm...</span>
            </motion.div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[100vh] overflow-y-auto py-2"
          >
            {filteredProducts.map((product, index) => (
              <AnimatePresence key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </motion.div>
        ) : (
          <NoProductAvailable
            onRefresh={handleRefresh}
            onViewAll={handleViewAll}
          />
        )}
      </div>
    </div>
  );
};

export default BrandPage;
