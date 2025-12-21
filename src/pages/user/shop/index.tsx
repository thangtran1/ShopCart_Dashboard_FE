"use client";
import { Product } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import Title from "@/ui/title";
import CategoryList from "@/components/user/shop/CategoryList";
import BrandList from "@/components/user/shop/BrandList";
import PriceList from "@/components/user/shop/PriceList";
import { Loader2 } from "lucide-react";
import ProductCard from "@/pages/user/public/ProductCard";
import NoProductAvailable from "../public/NoProductAvailable";
import { brandService } from "@/api/services/brands";
import { categoryService } from "@/api/services/category";
import { productService } from "@/api/services/product";

const Shop = () => {
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
    setLoading(false);
  }, [categories, brands, selectedCategory, selectedBrand, selectedPrice]);

  useEffect(() => {
    if (categories.length > 0 && brands.length > 0) {
      fetchProducts();
    }
  }, [fetchProducts]);

  // Callback cho NoProductAvailable - Làm mới (fetch lại với filter hiện tại)
  const handleRefresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Callback cho NoProductAvailable - Xem tất cả (xóa hết filter)
  const handleViewAll = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Reset tất cả filters
  const handleResetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return (
    <div>
      <div className="sticky top-0 z-10 mb-5">
        <div className="flex items-center justify-between">
          <Title className="text-lg uppercase tracking-wide">
            Get the products as your needs
          </Title>

          {(selectedCategory || selectedBrand || selectedPrice) && (
            <button
              onClick={handleResetFilters}
              className="text-primary underline text-sm mt-2 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 border-t border-border">
        <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r scrollbar-hide">
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

        <div className="flex-1 pt-2">
          <div
            className={
              products.length > 0
                ? "h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide"
                : "pr-2"
            }
          >
            {loading ? (
              <div className="p-20 flex flex-col gap-2 items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="font-semibold tracking-wide text-base">
                  Đang tải phẩm . . .
                </p>
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
