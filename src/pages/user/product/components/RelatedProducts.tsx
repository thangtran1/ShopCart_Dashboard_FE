import { Separator } from "@/ui/separator";
import Title from "@/ui/title";
import ProductCard from "../../public/ProductCard";
import NoProductAvailable from "../../public/NoProductAvailable";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import PageLoading from "@/components/common/loading/PageLoading";

interface RelatedProductsProps {
  relatedProducts: any[];
  isFetching: boolean;
  onRefresh: () => Promise<void>;
}

export default function RelatedProducts({ 
  relatedProducts, 
  isFetching, 
  onRefresh 
}: RelatedProductsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      <Title>{t("product.related_title")}</Title>
      <p className="text-muted-foreground">
        {t("product.related_desc")}
      </p>
      
      <Separator className="my-4" />

      <div className="mt-4 min-h-[300px]">
        {isFetching ? (
          <div className="min-h-[400px] flex items-center justify-center">
          <PageLoading height={200} text={t("category.loading")} />
        </div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        ) : (
          <NoProductAvailable 
            onRefresh={onRefresh} 
            onViewAll={() => navigate("/shop")} 
          />
        )}
      </div>
    </div>
  );
}