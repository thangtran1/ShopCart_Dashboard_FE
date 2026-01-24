"use client";
import { Link } from "react-router";
import SeeMore from "@/ui/see-more";
import { Badge } from "@/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { useTranslation } from "react-i18next";
import { useBrand } from "@/hooks/useBrand";
import { Brand } from "@/api/services/brands";

export default function ShopByBrands() {
  const { t } = useTranslation();

  const { useActiveBrands } = useBrand();
  const { data: brands = [], isLoading, isError } = useActiveBrands();
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mt-2">
      <div className="lg:col-span-4 space-y-2">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="px-3 py-1 uppercase tracking-wider text-primary border-primary/30 bg-primary/5 w-fit"
          >
            {t("brands.badge")}
          </Badge>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t("brands.title_main")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              {t("brands.title_sub")}
            </span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {t("brands.description")}
          </p>
        </div>

        <SeeMore to="/brand">{t("brands.see_all")}</SeeMore>
      </div>

      <div className="lg:col-span-8">
        {isLoading || isError ? (
          renderSkeleton()
        ) : brands.length === 0 ? (
          <EmptyState
            height="sm"
            title={t("brands.empty_title")}
            description={t("brands.empty_description")}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {brands.slice(0, 8).map((brand: Brand) => {
              const slugData = brand.slug as any;
              const brandSlug = typeof slugData === "object" && slugData !== null
                ? slugData.current
                : slugData;

              return (
                <Link
                  key={brand._id}
                  to={`/brand/${brandSlug}`}
                  className="group aspect-[4/2] rounded-xl flex flex-col items-center justify-center border border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-500 bg-white dark:bg-card"
                >
                  <div className="relative w-full h-10 mb-2">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain transition-all duration-500 scale-90 group-hover:scale-100"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-foreground uppercase group-hover:text-primary transition-colors">
                    {t("brands.product_count", {
                      count: brand.productCount,
                    })}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}