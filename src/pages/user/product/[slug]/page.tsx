import { Link, useParams } from "react-router";
import { Tabs } from "antd";

import ImageView from "@/components/user/products/ImageView";
import PriceView from "@/components/user/products/PriceView";
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
import { Separator } from "@/ui/separator";
import ProductSpecsModal from "../components/ProductSpecsModal";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/ui/button";

const SingleProductPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRelated, setFetchingRelated] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

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
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

            <div className="flex flex-col">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                {t("product_page.info.title")}
              </h3>

              <div className="grid grid-cols-2 gap-2 h-full">
                {[
                  { label: t("product_page.info.brand"), value: product?.brand?.name },
                  { label: t("product_page.info.category"), value: product?.category?.name },
                  {
                    label: t("product_page.info.status"),
                    value: product?.stock === 0
                      ? t("product_page.info.out_of_stock")
                      : t("product_page.info.in_stock"),
                    isStatus: true,
                    stock: product?.stock
                  },
                  {
                    label: t("product_page.info.warranty"),
                    value: product?.warrantyPeriod ? `${product.warrantyPeriod} ${t("product_page.info.months")}` : `12 ${t("product_page.info.months")}`,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-muted/40 border border-primary/10 rounded-2xl flex flex-col justify-center bg-gradient-to-br from-primary/5 to-transparent transition-colors"
                  >
                    <span className="text-xs text-foreground uppercase font-semibold tracking-wider mb-1">
                      {item.label}
                    </span>
                    <span className={`text-sm text-muted-foreground font-bold ${item.isStatus ? (item.stock === 0 ? 'text-red-500' : 'text-green-600') : 'text-foreground'}`}>
                      {item.value || t("product_page.info.updating")}
                    </span>
                  </div>
                ))}

                <div className="col-span-2 p-4 bg-primary/5 border border-dashed border-primary/20 rounded-2xl flex items-center justify-center">
                  <p className="text-sm text-primary font-medium italic">
                    ✨ {t("Sản phẩm chính hãng 100%")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                {t("product_page.specs.title")}
              </h3>

              <div className="p-4 border border-primary/20 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent shadow-sm h-full flex flex-col">
                <div className="space-y-4 mb-6 flex-1">
                  {(product?.specifications || []).slice(0, 4).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 p-1 bg-background rounded-md shadow-sm border border-border shrink-0">
                        <LayoutGrid className="w-3.5 h-3.5 text-primary/70" />
                      </div>
                      <span className="text-sm font-medium leading-relaxed line-clamp-2">{item}</span>
                    </div>
                  ))}

                  {(!product?.specifications || product.specifications.length === 0) && (
                    <p className="text-sm italic text-muted-foreground">{t("product_page.info.updating")}</p>
                  )}
                </div>

                {(product?.specifications?.length || 0) > 4 && (
                  <Button 
                  className="w-full rounded-2xl text-white cursor-pointer"
                  size='lg'
                  onClick={() => setIsSpecsOpen(true)}
                  >
                    <LayoutGrid size={16} />
                    {t("product_page.specs.view_all")}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <ProductSpecsModal
            isOpen={isSpecsOpen}
            onClose={() => setIsSpecsOpen(false)}
            specs={product?.specifications || []}
          />
          <div className="md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold mb-3">{t("product_page.full_desc.title")}</h3>
            <div className="p-4 border bg-muted rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden">
              {product?.description ? (
                <div
                  className="prose prose-blue max-w-full"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="italic text-muted-foreground text-center py-10">
                  {t("product_page.full_desc.no_desc_detail")}
                </p>
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

  const commitmentList = [
    {
      id: 1,
      iconUrl: "https://cdn2.fptshop.com.vn/svg/Type_Bao_hanh_chinh_hang_4afa1cb34d.svg",
      text: t('product.commitment.feature_1'),
    },
    {
      id: 2,
      iconUrl: "https://cdn2.fptshop.com.vn/svg/Type_Giao_hang_toan_quoc_318e6896b4.svg",
      text: t('product.commitment.feature_2'),
    },
    {
      id: 3,
      iconUrl: "https://cdn2.fptshop.com.vn/svg/Type_Doi_tra_ff3d266f2b.svg",
      text: t('product.commitment.feature_3'),
    },
    {
      id: 4,
      iconUrl: "https://cdn2.fptshop.com.vn/svg/icon_ktv_8c9caa2c06.svg",
      text: t('product.commitment.feature_4'),
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

          <Separator className="mt-2" />

          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                {t('product.commitment_title')}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
              {commitmentList.map((policy) => (
                <div key={policy.id} className="flex items-center gap-3.5 group">
                  <div className="shrink-0 w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110">
                    <img
                      src={policy.iconUrl}
                      alt="policy-icon"
                      className="w-full h-full object-contain dark:invert dark:brightness-200 transition-all duration-300"
                    />
                  </div>
                  <span className="text-[14.5px] font-medium text-foreground leading-snug">
                    {policy.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full mt-2">
            <div className="flex-1">
              <BuyNowButton product={product} />
            </div>

            <div className="flex-1">
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
