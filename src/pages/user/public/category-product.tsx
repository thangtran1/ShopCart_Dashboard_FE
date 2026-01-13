import { Link } from "react-router";
import SeeMore from "@/ui/see-more";
import { Category, categoryService } from "@/api/services/category";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";

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

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
      ))}
    </div>
  );

  const renderCategories = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {categories.slice(0, 8).map((category) => (
        <Link
          key={category._id}
          to={`/category/${category.slug}`}
          className="group relative flex items-center justify-between p-4 bg-white dark:bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div className="z-10 space-y-1">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {category.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {category.productCount} sản phẩm
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">
              Xem ngay →
            </p>
          </div>

          <div className="relative w-20 h-20 flex-shrink-0">
            <div className="absolute inset-0 bg-primary/5 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />

            <img
              src={category.image || "/images/products/product_1.png"}
              alt={category.name}
              className="relative z-10 w-full h-full object-contain drop-shadow-md transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6"
            />
          </div>

          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        </Link>
      ))}
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighttight">
            Danh mục {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Sản phẩm
            </span>
          </h2>
        </div>
        <SeeMore to="/category">
          Xem tất cả
        </SeeMore>
      </div>

      <div>
        {loading || error ? (
          renderSkeleton()
        ) : categories.length === 0 ? (
          <EmptyState height="sm" title="Trống" description="Hiện chưa có danh mục nào" />
        ) : (
          renderCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryProduct;