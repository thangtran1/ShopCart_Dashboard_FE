"use client";
import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Filter, RotateCcw, X, SlidersHorizontal } from "lucide-react";
import Title from "@/ui/title";
import CategoryList from "@/components/user/shop/CategoryList";
import BrandList from "@/components/user/shop/BrandList";
import PriceList from "@/components/user/shop/PriceList";
import ProductCard from "@/pages/user/public/ProductCard";
import NoProductAvailable from "../public/NoProductAvailable";
import PageLoading from "@/components/common/loading/PageLoading";
import { useTranslation } from "react-i18next";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { useBrand } from "@/hooks/useBrand";
import { useCategory } from "@/hooks/useCategory";
import { useProduct } from "@/hooks/useProducts";

const Shop = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const selectedCategory = searchParams.get("category");
  const selectedBrand = searchParams.get("brand");
  const selectedPrice = searchParams.get("price");

  const { useActiveBrands } = useBrand();
  const { useActiveCategories } = useCategory();
  const { useActiveProducts } = useProduct();

  const { data: brandsData, isLoading: brandsLoading } = useActiveBrands();
  const { data: categoriesData, isLoading: categoriesLoading } = useActiveCategories();
  
  const { 
    data: allProducts, 
    isLoading: productsLoading, 
    refetch 
  } = useActiveProducts({ 
    category: selectedCategory || undefined, 
    brand: selectedBrand || undefined, 
    price: selectedPrice || undefined 
  });

  const brands = useMemo(() => brandsData || [], [brandsData]);
  const categories = useMemo(() => categoriesData || [], [categoriesData]);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    let result = [...allProducts];

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) result = result.filter((p: any) => p.category?._id === cat._id);
    }

    if (selectedBrand) {
      const br = brands.find((b: any) => b.slug === selectedBrand);
      if (br) result = result.filter((p: any) => p.brand?._id === br._id);
    }

    if (selectedPrice) {
      const [minStr, maxStr] = selectedPrice.split("-");
      const min = Number(minStr) || 0;
      const max = maxStr === "Infinity" ? Infinity : Number(maxStr);
      result = result.filter((p: any) => p.price >= min && p.price <= max);
    }

    return result;
  }, [allProducts, selectedCategory, selectedBrand, selectedPrice, categories, brands]);

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

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setIsMobileFilterOpen(false);
  };

  const isInitialLoading = productsLoading || categoriesLoading || brandsLoading;

  return (
    <div className="pb-10">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md pb-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Title className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
            {t("shop.title")}
          </Title>

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
              className="md:hidden relative bg-transparent border border-primary/30 flex items-center cursor-pointer justify-center gap-2 text-foreground rounded-full text-sm font-bold active:scale-95 transition-transform"
            >
              <SlidersHorizontal size={16} />
              {t("shop.filter")}
              {activeFiltersCount > 0 && (
                <Badge variant={'error'} className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 mt-4">
        <aside className="hidden md:block w-68 shrink-0 border-r space-y-2 sticky top-32 h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={(v) => updateFilter("category", v)}
            loading={categoriesLoading}
          />
          <BrandList
            brands={brands}
            loading={brandsLoading}
            selectedBrand={selectedBrand}
            setSelectedBrand={(v) => updateFilter("brand", v)}
          />
          <PriceList
            selectedPrice={selectedPrice}
            setSelectedPrice={(v) => updateFilter("price", v)}
          />
        </aside>

        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-[80%] bg-background p-4 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-primary" />
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Bộ lọc</h3>
                </div>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-muted rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                <CategoryList categories={categories} selectedCategory={selectedCategory} setSelectedCategory={(v) => updateFilter("category", v)} />
                <BrandList brands={brands} selectedBrand={selectedBrand} setSelectedBrand={(v) => updateFilter("brand", v)} />
                <PriceList selectedPrice={selectedPrice} setSelectedPrice={(v) => updateFilter("price", v)} />
              </div>

              <div className="pt-4 border-t mt-auto grid grid-cols-2 gap-2">
                <button onClick={handleResetFilters} className="rounded-xl border border-border py-3 font-bold text-xs uppercase">{t('shop.clear_all')}</button>
                <button onClick={() => setIsMobileFilterOpen(false)} className="rounded-xl bg-primary py-3 text-white font-bold text-xs uppercase">{t('shop.apply')}</button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1">
          {isInitialLoading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center">
              <PageLoading height={120} text={t("shop.loading_products")} />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {filteredProducts.map((product) => (
                <div key={product._id} className="animate-in fade-in zoom-in-95 duration-500">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
              <NoProductAvailable
                onRefresh={refetch}
                onViewAll={handleResetFilters}
              />
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;