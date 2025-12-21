import Title from "@/ui/title";
import { Link } from "react-router";
import SeeMore from "@/ui/see-more";
import { Category, categoryService } from "@/api/services/category";
import { useEffect, useState } from "react";
import { Skeleton } from "@/ui/skeleton";

const CategoryProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await categoryService.getActive();

      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError(true);
        setCategories([]);
      }
    } catch {
      setError(true);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Skeleton placeholder
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse p-4 border rounded-xl flex items-center gap-4"
        >
          <Skeleton.Image className="w-20 h-20" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 bg-muted rounded"></div>
            <div className="h-3 w-1/2 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Hiển thị danh mục
  const renderCategories = () => (
    <div className="grid grid-cols-1 border border-border rounded-xl shadow-sm p-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {categories.map((category) => (
        <Link
          key={category._id}
          to={`/category/${category.slug}`}
          className="
            group flex items-center gap-4 p-4 rounded-xl border border-border
            hover:shadow-md hover:border-primary/30 transition-all duration-300
            bg-white
          "
        >
          {category.image && (
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border border-border p-1 bg-gray-50">
              <img
                src={category.image || "/images/products/product_1.png"}
                alt={category.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )}

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">{`(${category.productCount})`}</span>{" "}
              Sản phẩm có sẵn
            </p>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Title className="text-2xl font-semibold">Danh mục phổ biến</Title>
        <SeeMore to="/category">Xem thêm</SeeMore>
      </div>

      {loading || error ? (
        renderSkeleton()
      ) : categories.length === 0 ? (
        <div className="p-6 text-center border rounded-xl text-muted-foreground">
          Hiện chưa có danh mục nào để hiển thị
        </div>
      ) : (
        renderCategories()
      )}
    </div>
  );
};

export default CategoryProduct;
