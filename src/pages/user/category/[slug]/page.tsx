"use client";

import Title from "@/ui/title";
import { useParams } from "react-router";
import CategoryPage from "@/pages/user/category/page";
import { useEffect, useState } from "react";
import { categoryService } from "@/api/services/category";
import { productService } from "@/api/services/product";

const DetailCategory = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const response = await categoryService.getActive();
      if (response.success && response.data) setCategory(response.data);
      else setCategory([]);
    };
    fetchCategory();
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await productService.getActiveProducts();
      if (response.success && response.data) setProducts(response.data);
      else setProducts([]);
    };
    fetchProducts();
  }, [category]);
  const currentSlug = slug || "all";
  const currentCategory = category[0]; // vì category là array 1 phần tử

  const categoryName =
    currentSlug === "all" ? "Tất cả sản phẩm" : currentCategory?.name || slug;

  return (
    <div>
      <Title className="text-lg mb-5 uppercase tracking-wide">
        Sản phẩm theo danh mục:{" "}
        <span className="font-bold text-primary capitalize tracking-wide">
          {categoryName}
        </span>
      </Title>

      <CategoryPage categories={category} products={products} slug={currentSlug} />
    </div>
  );
};

export default DetailCategory;
