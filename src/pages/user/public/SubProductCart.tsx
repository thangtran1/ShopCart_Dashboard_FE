"use client";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { productService } from "@/api/services/product";
import { ProductType } from "@/types/enum";
import { Badge } from "@/ui/badge";
import { useTranslation } from "react-i18next";
import PageLoading from "@/components/common/loading/PageLoading";
import { useNavigate } from "react-router";

export default function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [productsByType, setProductsByType] = useState<Record<string, any[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const fetchProductsByType = useCallback(async () => {
    setLoading(true);
    try {
      const types = Object.values(ProductType);
      const responses = await Promise.all(
        types.map((type) =>
          productService
            .getActiveProducts({ productType: type })
            .then((res) => ({ type, data: res.data }))
            .catch(() => ({ type, data: [] }))
        )
      );
      const results = responses.reduce((acc, curr) => {
        acc[curr.type] = curr.data;
        return acc;
      }, {} as Record<string, any[]>);
      setProductsByType(results);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsByType();
  }, [fetchProductsByType]);

  const hasProducts = Object.values(productsByType).some((p) => p.length > 0);
  const handleRefresh = useCallback(() => {
    fetchProductsByType();
  }, [fetchProductsByType]);

  return (
    <div className="space-y-6 antialiased">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
        >
          {t("product.hero_title")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
            {t("product.hero_subtitle")}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-muted-foreground text-lg"
        >
          {t("product.hero_description")}
        </motion.p>
      </div>

      {loading ? (
        <PageLoading height={300} text={t("shop.loading_products")} />
      ) : hasProducts ? (
        <div className="space-y-6">
          {Object.entries(productsByType)
            .filter(([_, products]) => products.length > 0)
            .map(([type, products]) => (
              <section key={type} id={type} className="scroll-mt-32">
                <div className="flex items-center justify-between mb-6 group">
                  <div className="flex cursor-pointer items-center gap-3">
                    <h2 className="text-2xl md:text-4xl font-bold border-l-4 border-indigo-600 pl-3 transition-all group-hover:pl-5 group-hover:border-indigo-400">
                      {t(`product.type_${type.toLowerCase()}`, {
                        defaultValue: type,
                      })}
                    </h2>
                    <Badge variant={"success"} className="h-6">
                      {t("product.count_label", { count: products.length })}
                    </Badge>
                  </div>
                  <div className="h-[2px] flex-grow mx-8 bg-gradient-to-r from-indigo-100 to-transparent hidden md:block opacity-50" />
                </div>

                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>
            ))}
        </div>
      ) : (
        <NoProductAvailable 
        onRefresh={handleRefresh}
        onViewAll={() => navigate("/category")}
        />
      )}
    </div>
  );
}