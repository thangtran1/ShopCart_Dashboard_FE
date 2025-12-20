import CategoryProduct from "./public/category-product";
import ShopByBrands from "./public/ShopByBrands";
import ProductGrid from "./public/ProductGrid";
import HomeBanner from "./public/HomeBanner";
import NewsPage from "@/components/user/NewsCard";
import SubProductCard from "./public/SubProductCart";
const UserHomePage = () => {
  return (
    <div className="flex flex-col gap-6">
      <HomeBanner />
      <ProductGrid />
      <SubProductCard />
      <CategoryProduct />
      <ShopByBrands />
      <NewsPage />
    </div>
  );
};

export default UserHomePage;
