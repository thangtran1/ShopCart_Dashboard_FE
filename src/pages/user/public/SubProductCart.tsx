import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { productService } from "@/api/services/product";
import { ProductType } from "@/types/enum";
import { Skeleton } from "antd";

export default function ProductsPage() {
    const [productsByType, setProductsByType] = useState<Record<string, any[]>>(
        {}
    );
    const [loading, setLoading] = useState(true);

    const fetchProductsByType = useCallback(async () => {
        setLoading(true);
        try {
            const types = Object.values(ProductType);
            const results: Record<string, any[]> = {};

            await Promise.all(
                types.map(async (type) => {
                    const res = await productService.getActiveProducts({
                        productType: type,
                    });
                    results[type] = res.data;
                })
            );

            setProductsByType(results);
        } catch (error) {
            console.error("Product fetching error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductsByType();
    }, [fetchProductsByType]);

    // Kiểm tra toàn bộ productsByType có sản phẩm không
    const hasProducts = Object.values(productsByType).some(
        (products) => products.length > 0
    );

    return (
        <div className="pb-3 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Sản phẩm công nghệ
            </h1>

            {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="space-y-4">
                        <Skeleton.Input active className="!w-60 !h-6" />
                        <Skeleton active paragraph={{ rows: 3 }} />
                    </div>
                ))
            ) : hasProducts ? (
                Object.entries(productsByType)
                    .filter(([_, products]) => products.length > 0) // chỉ giữ loại có sản phẩm
                    .map(([type, products]) => (
                        <section key={type} className="space-y-4">
                            <div className="rounded-t-2xl bg-error/70 p-4">
                                <h2 className="md:text-2xl font-semibold">{type}</h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-2">
                                {products.map((product) => (
                                    <AnimatePresence key={product._id}>
                                        <motion.div
                                            layout
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <ProductCard key={product._id} product={product} />
                                        </motion.div>
                                    </AnimatePresence>
                                ))}
                            </div>
                        </section>
                    ))
            ) : (
                <NoProductAvailable />
            )}
        </div>
    );
}
