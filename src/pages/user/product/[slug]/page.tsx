import { useParams } from "react-router";
import { Button, Tabs } from "antd";

import ImageView from "@/components/user/products/ImageView";
import PriceView from "@/components/user/products/PriceView";
import ProductCharacteristics from "@/components/user/products/ProductCharacteristics";
import ProductReviewSection from "@/components/user/products/ProductReviewSection";
import AddToCartButton from "@/components/user/AddToCartButton";
import { useCallback, useEffect, useState } from "react";
import { productService } from "@/api/services/product";
import { Check } from "lucide-react";
import { cn } from "@/utils";
import { promotions, paymentOffers } from "@/constants/data";
import RelatedProducts from "../components/RelatedProducts";
import BuyNowButton from "@/components/user/BuyNowButton";

const SingleProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProductBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    const response = await productService.getProductBySlug(slug);
    if (response.success) setProduct(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (slug) fetchProductBySlug(slug);
  }, [slug, fetchProductBySlug]);

  if (loading || !product) return <div>Loading...</div>;

  const items = [
    {
      key: "details",
      label: "Mô tả sản phẩm",
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Thông tin sản phẩm */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Thông tin sản phẩm</h3>
            <div className="space-y-3 p-4 bg-muted border rounded-lg text-sm">
              {[
                { label: "Thương hiệu", value: product?.brand?.name },
                { label: "Danh mục", value: product?.category?.name },
                {
                  label: "Tình trạng",
                  value: product?.stock === 0 ? "Hết hàng" : "Còn hàng",
                },
                {
                  label: "Bảo hành",
                  value: product?.warrantyPeriod || "12 tháng",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between border-b pb-2 last:border-none last:pb-0"
                >
                  <span>{item.label}</span>
                  <span className="font-medium">
                    {item.value || "Đang cập nhật"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Đặc điểm nổi bật */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Đặc điểm nổi bật</h3>
            <div className="text-sm mb-3 leading-relaxed bg-muted p-4 border rounded-lg">
              {product?.description ? (
                <p className="whitespace-pre-line">{product.description}</p>
              ) : (
                <p className="italic">Chưa có mô tả</p>
              )}
            </div>
            <ProductCharacteristics product={product as any} />
          </div>

          {/* Mô tả chi tiết */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Mô tả chi tiết</h3>
            <div className="p-4 border rounded-lg bg-muted text-sm leading-relaxed">
              {product?.description ? (
                <div
                  className="prose max-w-full"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="italic">Chưa có mô tả chi tiết</p>
              )}
            </div>
          </div>

          {/* Thông số kỹ thuật */}
          {product?.specifications && (
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Thông số kỹ thuật</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {(product.specifications as string[]).map((item, idx) => (
                  <div key={idx} className="p-3 border bg-muted rounded-lg">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },

    // TAB ĐÁNH GIÁ
    {
      key: "reviews",
      label: "Đánh giá",
      children: (
        <ProductReviewSection
          product={product}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-10 mb-2">
        {product?.images && (
          <ImageView
            images={product.images}
            product={product}
            isStock={product.stock}
          />
        )}

        <div className="w-full md:w-1/2 flex flex-col gap-5 mt-">
          <div className="space-y-1"></div>

          <div className="space-y-2">
            <PriceView
              price={product?.price}
              discount={product?.discount}
              stock={product?.stock}
              className="text-lg font-bold"
            />
          </div>

          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center mb-3">
              <span className="mr-2">🎁</span>
              Khuyến mãi hấp dẫn
            </h3>
            <ul className="space-y-3">
              {promotions.map((promo) => (
                <li key={promo.id} className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2 mt-0.5">
                    {promo.id}
                  </span>
                  <p className="text-sm text-gray-700">
                    {promo.text}
                    <a
                      href={promo.link}
                      className="text-blue-600 ml-1 font-medium hover:underline"
                    >
                      Xem chi tiết
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap flex-col sm:flex-row items-stretch justify-start !w-full gap-3">
            <Button
              color="primary"
              variant="outlined"
              className="flex-1 min-h-[50px]"
            >
              <span className="font-bold">Trả góp 0%</span>
            </Button>

            <BuyNowButton product={product} />

            <AddToCartButton
              product={product}
              className="flex-1 min-h-[50px]"
            />
          </div>

          <div className={cn("border border-primary/40 rounded-lg p-4 bg-[#f1f6ff]")}>
            <h3 className="text-xl font-bold text-gray-900 flex items-center pb-2">
              <span className="mr-2 text-red-600">🎁</span>
              Ưu đãi thanh toán
            </h3>
            <ul className="space-y-3">
              {paymentOffers.map((offer) => (
                <li key={offer.id} className="flex items-start text-sm text-gray-700">
                  <Check className="flex-shrink-0 w-4 h-4 text-green-600 mr-2 mt-0.5" />

                  <p className="leading-relaxed">
                    <span className={cn({ "text-blue-600 font-medium hover:underline": offer.isLink })}>
                      {offer.text}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t py-5">
        <Tabs defaultActiveKey="details" items={items} size="large" />
      </div>
      <RelatedProducts product={product} />
    </>
  );
};

export default SingleProductPage;
