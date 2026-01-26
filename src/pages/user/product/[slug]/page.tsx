import { Link, useParams } from "react-router";
import { Tabs } from "antd";

import ImageView from "@/components/user/products/ImageView";
import PriceView from "@/components/user/products/PriceView";
import ProductCharacteristics from "@/components/user/products/ProductCharacteristics";
import ProductReviewSection from "@/components/user/products/ProductReviewSection";
import AddToCartButton from "@/components/user/AddToCartButton";
import { useCallback, useEffect, useState } from "react";
import { productService } from "@/api/services/product";
import { promotions } from "@/constants/data";
import RelatedProducts from "../components/RelatedProducts";
import BuyNowButton from "@/components/user/BuyNowButton";
import { useTranslation } from "react-i18next";
import PageLoading from "@/components/common/loading/PageLoading";
import useStore from "@/store/store";

const SingleProductPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRelated, setFetchingRelated] = useState(false);

  const { addViewedProduct } = useStore();

  useEffect(() => {
    if (product) {
      // Mỗi khi product thay đổi (người dùng vào trang mới), lưu vào lịch sử
      addViewedProduct(product);
    }
  }, [product, addViewedProduct]);

  const fetchRelated = useCallback(async (id: string) => {
    setFetchingRelated(true);
    try {
      const res = await productService.getProductByRelated(id);
      if (res?.success) setRelatedProducts(res.data || []);
    } finally {
      setFetchingRelated(false);
    }
  }, []);

  const fetchProductBySlug = useCallback(async (targetSlug: string) => {
    setLoading(true);
    const response = await productService.getProductBySlug(targetSlug);
    if (response.success && response.data) {
      setProduct(response.data);
      fetchRelated(response.data._id);
    }
    setLoading(false);
  }, [fetchRelated]);

  useEffect(() => {
    if (slug) fetchProductBySlug(slug);
  }, [slug, fetchProductBySlug]);

  const handleRefreshRelated = async () => {
    const id = product?._id || product?.id;
    if (id) await fetchRelated(id);
  };

  if (loading || !product) return <PageLoading height={400} text={t("product_page.loading")} />;

  const items = [
    {
      key: "details",
      label: t("product_page.tabs.details"),
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Thông tin sản phẩm */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{t("product_page.info.title")}</h3>
            <div className="space-y-3 p-4 bg-muted border rounded-lg text-sm">
              {[
                { label: t("product_page.info.brand"), value: product?.brand?.name },
                { label: t("product_page.info.category"), value: product?.category?.name },
                {
                  label: t("product_page.info.status"),
                  value: product?.stock === 0 ? t("product_page.info.out_of_stock") : t("product_page.info.in_stock"),
                },
                {
                  label: t("product_page.info.warranty"),
                  value: product?.warrantyPeriod || `12 ${t("product_page.info.months")}`,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between border-b pb-2 last:border-none last:pb-0">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.value || t("product_page.info.updating")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Đặc điểm nổi bật */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{t("product_page.highlights.title")}</h3>
            <div className="text-sm mb-3 leading-relaxed bg-muted p-4 border rounded-lg">
              {product?.description ? (
                <p className="whitespace-pre-line">{product.description}</p>
              ) : (
                <p className="italic">{t("product_page.highlights.no_desc")}</p>
              )}
            </div>
            <ProductCharacteristics product={product as any} />
          </div>

          {/* Mô tả chi tiết */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3">{t("product_page.full_desc.title")}</h3>
            <div className="p-4 border rounded-lg bg-muted text-sm leading-relaxed">
              {product?.description ? (
                <div
                  className="prose max-w-full"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="italic">{t("product_page.full_desc.no_desc_detail")}</p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "reviews",
      label: t("product_page.tabs.reviews"),
      children: <ProductReviewSection product={product} />,
    },
  ];

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-[56%_1fr] gap-8 mb-6 items-start">
        <div className="w-full">
          {product?.images && (
            <ImageView images={product.images} product={product} isStock={product.stock} />
          )}
        </div>

        <div className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-1">
            <PriceView
              price={product?.price}
              discount={product?.discount}
              stock={product?.stock}
              className="text-2xl font-bold text-primary"
            />
          </div>

          <div className="relative overflow-hidden border border-red-100 rounded-2xl bg-gradient-to-br from-red-50 to-white p-5">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="text-6xl">🎁</span>
            </div>
            <h3 className="text-lg font-bold text-red-600 flex items-center gap-2 mb-4">
              <span className="p-1.5 bg-red-100 rounded-lg">🔥</span>
              {t("product_page.promotions.title")}
            </h3>
            <ul className="space-y-3 relative z-10">
              {promotions.map((promo) => (
                <li key={promo.id} className="flex items-start gap-3 group">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {promo.id}
                  </div>
                  <p className="text-sm text-gray-700 leading-snug">
                    {promo.text}
                    <Link to={promo.link} className="text-blue-600 ml-1 font-semibold hover:underline decoration-2">
                      {t("product_page.promotions.view_detail")}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex [&>div]:!h-12 [&>div_button]:!h-12 items-center gap-3 w-full mt-2">
            <div className="flex-1 [&>button]:w-full">
              <BuyNowButton product={product} />
            </div>

            <div className="flex-1 [&>div]:w-full [&>div_button]:w-full">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t py-5">
        <Tabs defaultActiveKey="details" items={items} size="large" />
      </div>
      <RelatedProducts
        relatedProducts={relatedProducts}
        isFetching={fetchingRelated}
        onRefresh={handleRefreshRelated}
      />
    </>
  );
};
export default SingleProductPage;
