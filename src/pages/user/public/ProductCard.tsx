import { Link } from "react-router";
import { StarIcon } from "lucide-react";
import { Flame } from "lucide-react";
import PriceView from "./PriceView";
import Title from "@/ui/title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "@/components/user/AddToCartButton";
import {
  FireOutlined,
  StarFilled,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Separator } from "@/ui/separator";
import { Icon } from "@/components/icon";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="text-sm border rounded-2xl border-border group">
      <div className="overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        <div className="relative aspect-square group overflow-hidden bg-background rounded-t-2xl">
          {product?.images && (
            <Link to={`/product/${product?.slug}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
              />
            </Link>
          )}
          <ProductSideMenu product={product} />
          {product?.discount >= 20 ? (
            <>
              <Link
                to={"/?tab=deal"}
                className="absolute top-2 left-2 z-10 border border-warning/50 p-1 rounded-full group-hover:border-warning"
              >
                <Flame
                  size={18}
                  fill="#fb6c08"
                  className="text-warning group-hover:text-warning"
                />
              </Link>
              <div className="absolute top-2 left-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                -{product.discount}%
              </div>
            </>
          ) : product?.discount > 0 ? (
            <>
              <p className="absolute top-2 left-2 z-10 text-sm border border-primary/30 px-2 py-1 rounded-full group-hover:border-success text-white bg-primary ">
                Sale!
              </p>
              <div className="absolute top-2 left-[55px] bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                -{product.discount}%
              </div>
            </>
          ) : null}


          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {product.isNew && (
              <span className="bg-blue-500/90 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <ThunderboltOutlined className="text-[10px]" /> Mới
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-amber-500/90 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <StarFilled className="text-[10px]" /> Nổi bật
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-orange-500/90 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <FireOutlined className="text-[10px]" /> Bán chạy
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {product.category?.name || "Chưa phân loại"}
          </span>
          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
            {product.brand?.name || "Không có"}
          </span>
        </div>
        <Title className="text-lg line-clamp-1 mt-1 mb-3">{product.name}</Title>
        <PriceView price={product?.price} discount={product?.discount} />
        <Separator />
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`${index < 4 ? "text-success" : "text-foreground"
                  } size-4`}
                fill={index < 4 ? "#93D991" : "#ababab"}
              />
            ))}
          </div>
          <p className="text-foreground line-clamp-1  tracking-wide">
            {" "}
            |{" "}
            {product?.reviews?.length > 0
              ? product?.reviews?.length + " đánh giá"
              : "Chưa có đánh giá"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <p className="font-medium">Kho: </p>
            <p
              className={`${product?.stock === 0 ? "text-error" : "text-success font-semibold"
                }`}
            >
              {(product?.stock as number) > 0
                ? product?.stock + " sản phẩm"
                : "Hết hàng"}
            </p>
          </div>
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <Icon icon="solar:eye-bold" className="w-3.5 h-3.5" />
              {product.viewCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <Icon icon="solar:cart-check-bold" className="w-3.5 h-3.5" />
              {product.soldCount || 0}
            </span>
          </div>
        </div>
        <AddToCartButton
          product={product}
          className="w-36 mx-auto rounded-full flex items-center justify-center"
        />
      </div>
    </div>
  );
};

export default ProductCard;
