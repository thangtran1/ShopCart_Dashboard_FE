import { Separator } from "@/ui/separator";
import Title from "@/ui/title";
import ProductCard from "../../public/ProductCard";
import { useState, useEffect } from "react";
import { productService } from "@/api/services/product";
import NoProductAvailable from "../../public/NoProductAvailable";
import { useTranslation } from "react-i18next";

interface RelatedProductsProps {
  product: any;
}

export default function RelatedProducts({ product }: RelatedProductsProps) {
  const { t } = useTranslation(); 
  const productId = product?.id;
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const fetchRelatedProducts = async () => {
    if (!productId) return;
    const res = await productService.getProductByRelated(productId);
    if (res?.success) setRelatedProducts(res.data || []);
  };

  useEffect(() => {
    fetchRelatedProducts();
  }, [product]);

  return (
    <div className="mt-2">
      <Title>{t("product.related_title")}</Title>
      <p className="text-muted-foreground">
        {t("product.related_desc")}
      </p>
      
      <Separator className="my-4" />

      <div className="mt-2">
      {relatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      ) : (
        <NoProductAvailable />
      )}
      </div>
    </div>
  );
}