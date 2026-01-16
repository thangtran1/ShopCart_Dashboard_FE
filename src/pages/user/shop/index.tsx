"use client";
import { Product } from "@/types";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  Filter,
  RotateCcw,
  X,
  SlidersHorizontal,
} from "lucide-react";
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
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";

const Shop = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter values từ URL
  const selectedCategory = searchParams.get("category");
  const selectedBrand = searchParams.get("brand");
  const selectedPrice = searchParams.get("price");

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedBrand) count++;
    if (selectedPrice) count++;
    return count;
  }, [selectedCategory, selectedBrand, selectedPrice]);

  const updateFilter = useCallback((key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const setSelectedCategory = (v: string | null) => updateFilter("category", v);
  const setSelectedBrand = (v: string | null) => updateFilter("brand", v);
  const setSelectedPrice = (v: string | null) => updateFilter("price", v);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryService.getActive(),
          brandService.getActive()
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (brandRes.success) setBrands(brandRes.data);
      } catch (error) {
        console.error("Metadata fetch error:", error);
      }
    };
    fetchMetadata();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productService.getActiveProducts();
      let filtered = response.data || [];

      if (selectedCategory) {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat) filtered = filtered.filter((p: any) => p.category?._id === cat._id);
      }
      if (selectedBrand) {
        const br = brands.find((b) => b.slug === selectedBrand);
        if (br) filtered = filtered.filter((p: any) => p.brand?._id === br._id);
      }
      if (selectedPrice) {
        const [minStr, maxStr] = selectedPrice.split("-");
        const min = Number(minStr) || 0;
        const max = maxStr === "Infinity" ? Infinity : Number(maxStr);
        filtered = filtered.filter((p: any) => p.price >= min && p.price <= max);
      }

      setProducts(filtered as unknown as Product[]);
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [categories, brands, selectedCategory, selectedBrand, selectedPrice]);

  useEffect(() => {
    if (categories.length > 0 || brands.length > 0) {
      fetchProducts();
    }
  }, [fetchProducts, categories.length, brands.length]);

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="pb-10">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md pb-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Title className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
              {t("shop.title")}
            </Title>
          </div>

          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="hidden md:flex cursor-pointer items-center gap-2 text-xs font-bold text-destructive bg-destructive/5 hover:bg-destructive/10 px-4 py-2 rounded-full transition-all"
              >
                <RotateCcw size={14} />
                {t("shop.reset_filter")}
              </button>
            )}

            <Button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden relative bg-transparent border border-primary/30 flex hover:bg-muted items-center cursor-pointer justify-center gap-2 text-foreground rounded-full text-sm font-bold active:scale-95 transition-transform"
            >
              <SlidersHorizontal size={16} />
              {t("shop.filter")}
              {activeFiltersCount > 0 && (
                <Badge variant={'error'} className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <aside className="hidden md:block w-68 shrink-0 border-r space-y-2 sticky top-32 h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
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
        </aside>

        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[100] md:hidden overflow-hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[75%] bg-background p-4 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-primary" />
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Bộ lọc</h3>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                <CategoryList categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                <BrandList brands={brands} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
                <PriceList selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice} />
              </div>

              <div className="pt-4 border-t mt-auto grid grid-cols-2 gap-2">
                <button
                  onClick={handleResetFilters}
                  className="rounded-2xl border-error cursor-pointer border font-bold text-xs uppercase tracking-widest text-foreground active:bg-muted"
                >
                  {t('shop.clear_all')}
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="rounded-2xl py-3 bg-primary cursor-pointer text-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                >
                  {t('shop.apply')}
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1">
          {loading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center animate-pulse">
              <PageLoading height={120} text={t("shop.loading_products")} />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {products.map((product) => (
                <div key={product._id} className="animate-in fade-in zoom-in-95 duration-500">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-[50vh] flex items-center justify-center border-2 border-dashed rounded-3xl">
              <NoProductAvailable
                onRefresh={fetchProducts}
                onViewAll={handleResetFilters}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;