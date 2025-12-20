import { Tabs } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import { productService } from "@/api/services/product";
import { ProductStatus } from "@/types/enum";

export default function SubProductCard() {
    const [activeTab, setActiveTab] = useState("watch");
    const [products, setProducts] = useState<any[]>([]);

    const bannerUrl = activeTab === "watch"
        ? "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:960/q:90/plain/https://media-asset.cellphones.com.vn/page_configs/01K8WKEW3CH6FD5HGP201X8WAC.png"
        : "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:960/q:90/plain/https://media-asset.cellphones.com.vn/page_configs/01KA0B56WR5FQC2QKJH8SQXAFR.jpg";


    const fetchProducts = useCallback(async () => {
        try {
            const res = await productService.getAllProducts(1, 100, { status: ProductStatus.ACTIVE });
            setProducts(res.data.data);
        } catch (error) {
            console.error("Product fetching error:", error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const renderGrid = (items: any[]) => (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-2">
                {items.map(product => (
                    <AnimatePresence key={product._id}>
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    </AnimatePresence>
                ))}
            </div>
        </>
    );

    return (
        <div className="flex gap-4">
            <div className="hidden lg:block w-[20%] h-[700px]">
                <img
                    src={bannerUrl}
                    alt="Banner"
                    className="h-full w-full rounded-xl object-cover shadow-sm"
                />
            </div>

            <div className="w-full">
                <div className="rounded-2xl border shadow-sm">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        centered
                        className="custom-full-tabs"
                        items={[
                            {
                                key: "watch",
                                label: <span className="font-medium">Đồng hồ</span>,
                                children: renderGrid(products),
                            },
                            {
                                key: "audio",
                                label: <span className="font-medium">Âm thanh</span>,
                                children: renderGrid(products),
                            },
                        ]}
                    />
                </div>
            </div>

            <style>{`
        .custom-full-tabs .ant-tabs-nav-list {
          width: 100%;
          display: flex;
        }
        .custom-full-tabs .ant-tabs-tab {
          flex: 1;
          justify-content: center;
          padding: 12px 0;
        }
        .custom-full-tabs .ant-tabs-ink-bar {
          background: #d70018;
          height: 3px;
        }
        .custom-full-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #d70018;
        }
      `}</style>
        </div>
    );
}
