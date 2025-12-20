"use client";

import Title from "@/ui/title";
import { useParams } from "react-router";
import BrandPage from "@/pages/user/brand/page";
import { useEffect, useState } from "react";
import { BrandStatus,  ProductStatus } from "@/types/enum";
import { productService } from "@/api/services/product";
import { brandService } from "@/api/services/brands";

const DetailCategory = () => {
  const { slug } = useParams();
  const [brand, setBrand] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchBrand = async () => {
      const response = await brandService.getAllBrands(1, 10, { status: BrandStatus.ACTIVE });
      if (response.success && response.data) setBrand(response.data.data);
      else setBrand([]);
    };
    fetchBrand();
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await productService.getAllProducts(1, 10, { status: ProductStatus.ACTIVE });
      if (response.success && response.data) setProducts(response.data.data);
      else setProducts([]);
    };
    fetchProducts();
  }, [brand]);
  const currentSlug = slug || "all";
  const currentCategory = brand[0]; // vì brand là array 1 phần tử

  const categoryName =
    currentSlug === "all" ? "Tất cả sản phẩm" : currentCategory?.name || slug;

  return (
    <div>
      <Title className="text-lg mb-5 uppercase tracking-wide">
        Sản phẩm theo thương hiệu:{" "}
        <span className="font-bold text-primary capitalize tracking-wide">
          {categoryName}
        </span>
      </Title>

      <BrandPage brands={brand} products={products} slug={currentSlug} />
    </div>
  );
};

export default DetailCategory;
