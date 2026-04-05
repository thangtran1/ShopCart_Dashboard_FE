import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { productService, type Product } from "@/api/services/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { motion } from "framer-motion";

export default function TopProducts() {
  const { t } = useTranslation();
  const A = "dashboard.analysis";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await productService.getProductsByBestSeller();
        setProducts((res?.data || []).slice(0, 8));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const maxSold = Math.max(...products.map((p) => p.soldCount || 0), 1);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>{t(`${A}.top-products`)}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-14 w-full rounded-lg" />))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="h-full">
      <Card className="h-full">
        <CardHeader><CardTitle className="text-lg font-semibold">🏆 {t(`${A}.top-products`)}</CardTitle></CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product, index) => (
                <motion.div key={product._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.08 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-colors group">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0 ${
                    index === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : index === 1 ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    : index === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-muted text-muted-foreground"
                  }`}>{index + 1}</div>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                    {product.image ? (<img src={product.image} alt={product.name} className="w-full h-full object-cover" />)
                    : (<div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">📷</div>)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{
                          background: index === 0 ? "linear-gradient(90deg, #f59e0b, #f97316)"
                            : index === 1 ? "linear-gradient(90deg, #94a3b8, #64748b)"
                            : index === 2 ? "linear-gradient(90deg, #fb923c, #ea580c)"
                            : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                        }} initial={{ width: 0 }} animate={{ width: `${((product.soldCount || 0) / maxSold) * 100}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {(product.soldCount || 0).toLocaleString("vi-VN")} {t(`${A}.sold`)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary shrink-0">{(product.price || 0).toLocaleString("vi-VN")}₫</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center"><div className="text-4xl mb-2">🛍️</div><p>{t(`${A}.no-product-data`)}</p></div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
