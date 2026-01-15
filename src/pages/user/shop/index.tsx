"use client";
import { Product } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import Title from "@/ui/title";
import CategoryList from "@/components/user/shop/CategoryList";
import BrandList from "@/components/user/shop/BrandList";
import PriceList from "@/components/user/shop/PriceList";
import ProductCard from "@/pages/user/public/ProductCard";
import NoProductAvailable from "../public/NoProductAvailable";
import { brandService } from "@/api/services/brands";
import { categoryService } from "@/api/services/category";
import { productService } from "@/api/services/product";
import PageLoading from "@/components/common/loading/PageLoading";
import { useTranslation } from "react-i18next";

const Shop = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Đọc filter từ URL
  const selectedCategory = searchParams.get("category");
  const selectedBrand = searchParams.get("brand");
  const selectedPrice = searchParams.get("price");

  // Hàm cập nhật URL khi filter thay đổi
  const updateFilter = useCallback((key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Wrapper functions để set filter
  const setSelectedCategory = (value: string | null) => updateFilter("category", value);
  const setSelectedBrand = (value: string | null) => updateFilter("brand", value);
  const setSelectedPrice = (value: string | null) => updateFilter("price", value);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await brandService.getActive();
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getActive();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchBrands, fetchCategories]);

  // Fetch products on filter change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productService.getActiveProducts();
      const allProducts = response.data;
      let filtered = allProducts;

      if (selectedCategory) {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat) {
          filtered = filtered.filter((p) => p.category?._id === cat._id);
        }
      }
      if (selectedBrand) {
        const br = brands.find((b) => b.slug === selectedBrand);
        if (br) {
          filtered = filtered.filter((p) => p.brand?._id === br._id);
        }
      }
      if (selectedPrice) {
        const [minStr, maxStr] = selectedPrice.split("-");
        const min = Number(minStr) || 0;
        const max = maxStr === "Infinity" ? Infinity : Number(maxStr);

        filtered = filtered.filter(
          (p) => p.price >= min && p.price <= max
        );
      }
      setProducts(filtered as any[]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [categories, brands, selectedCategory, selectedBrand, selectedPrice]);

  useEffect(() => {
    if (categories.length > 0 && brands.length > 0) {
      fetchProducts();
    }
  }, [fetchProducts, categories.length, brands.length]);

  const handleRefresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleViewAll = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return (
    <div>
      <div className="sticky top-0 z-10 mb-5 bg-background/80 backdrop-blur-md pb-2">
        <div className="flex items-center justify-between">
          <Title className="text-lg uppercase tracking-wide">
            {t("shop.title")}
          </Title>

          {(selectedCategory || selectedBrand || selectedPrice) && (
            <button
              onClick={handleResetFilters}
              className="text-primary cursor-pointer underline text-sm mt-2 font-medium hover:text-primary/80 transition-colors"
            >
              {t("shop.reset_filter")}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 border-t border-border">
        {/* Sidebar Filter */}
        <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-border scrollbar-hide">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <BrandList
            brands={brands}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
          <PriceList
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1 pt-2">
          <div className="h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="p-20 flex flex-col gap-2 items-center justify-center">
                <PageLoading
                  height={300}
                  text={t("shop.loading_products")}
                />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 py-2">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <NoProductAvailable
                onRefresh={handleRefresh}
                onViewAll={handleViewAll}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;