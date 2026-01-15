"use client";
import { Link } from "react-router";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";
import SeeMore from "@/ui/see-more";
import { useCallback, useEffect, useState } from "react";
import { Brand, brandService } from "@/api/services/brands";
import { Badge } from "@/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { useTranslation } from "react-i18next";

export default function ShopByBrands() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const extraData = [
    {
      title: t("brands.extra.shipping_title"),
      description: t("brands.extra.shipping_desc"),
      icon: <Truck size={40} />
    },
    {
      title: t("brands.extra.return_title"),
      description: t("brands.extra.return_desc"),
      icon: <GitCompareArrows size={40} />
    },
    {
      title: t("brands.extra.support_title"),
      description: t("brands.extra.support_desc"),
      icon: <Headset size={40} />
    },
    {
      title: t("brands.extra.guarantee_title"),
      description: t("brands.extra.guarantee_desc"),
      icon: <ShieldCheck size={40} />
    },
  ];

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await brandService.getActive();
      if (response.success) {
        setBrands(response.data || []);
      } else {
        setError(true);
        setBrands([]);
      }
    } catch {
      setError(true);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
      ))}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mt-2">
        <div className="lg:col-span-4 space-y-2">
          <div className="space-y-2">
            <Badge variant="outline" className="px-3 py-1 uppercase tracking-wider text-primary border-primary/30 bg-primary/5 w-fit">
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

          <SeeMore to="/brand">
            {t("brands.see_all")}
          </SeeMore>
        </div>

        <div className="lg:col-span-8">
          {loading || error ? (
            renderSkeleton()
          ) : brands.length === 0 ? (
            <EmptyState
              height="sm"
              title={t("brands.empty_title")}
              description={t("brands.empty_description")}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {brands.slice(0, 8).map((brand) => (
                <Link
                  key={brand._id}
                  to={`/brand/${brand.slug}`}
                  className="group aspect-[4/2] rounded-xl flex flex-col items-center justify-center border border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative w-full h-10 mb-2">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain transition-all duration-500 scale-90 group-hover:scale-100"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-foreground uppercase group-hover:text-primary transition-colors">
                    {t("brands.product_count", { count: brand.productCount })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
        {extraData.map((item, index) => (
          <div
            key={index}
            className="relative overflow-hidden group p-4 rounded-3xl bg-white dark:bg-card border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                {item.icon}
              </div>
              <div>
                <h4 className="text-lg font-bold">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}