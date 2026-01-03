"use client";

import useStore from "@/store/store";
import { useState } from "react";
import {
  DeleteOutlined,
  LoadingOutlined,
  HeartOutlined
} from "@ant-design/icons";
import { Button, Popconfirm, Badge } from "antd";
import { Link, useNavigate } from "react-router";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/types";
import { toast } from "sonner";
import Title from "@/ui/title";


const WishListProducts = () => {
  const navigate = useNavigate();
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleRemoveProduct = (id: string) => {
    setIsProcessing(id);
    removeFromFavorite(id);
    toast.success("Đã xóa khỏi danh sách yêu thích");
    setIsProcessing(null);
  };

  const handleResetWishlist = () => {
    setIsProcessing("clear");
    resetFavorite();
    toast.success("Đã làm trống danh sách yêu thích");
    setIsProcessing(null);
  };

  if (favoriteProduct.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <HeartOutlined className="text-5xl text-rose-400 opacity-50" />
        <p className="text-muted-foreground font-medium">Danh sách yêu thích của bạn đang trống</p>
        <Button type="primary" onClick={() => navigate("/shop")}>Khám phá ngay</Button>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-4">
          <Badge
            count={favoriteProduct.length}
            showZero
            color="#f43f5e"
            offset={[-2, 2]}
          >
            <div className="p-3 bg-rose-50 rounded-xl transition-colors hover:bg-rose-100">
              <HeartOutlined className="text-2xl text-rose-500" />
            </div>
          </Badge>

          <div>
            <Title className="text-2xl font-bold tracking-tight mb-0.5">
              Danh sách yêu thích
            </Title>
            <p className="text-sm text-muted-foreground">
              Xem lại các sản phẩm bạn đã quan tâm và thêm chúng vào giỏ hàng để mua sắm
            </p>
          </div>
        </div>
        <Popconfirm
          title="Làm trống danh sách"
          description="Bạn có chắc chắn muốn xóa tất cả sản phẩm yêu thích?"
          onConfirm={handleResetWishlist}
          okText="Đồng ý"
          cancelText="Hủy"
          okButtonProps={{
            danger: true,
            loading: isProcessing === "clear",
          }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            className="font-bold"
          >
            Xóa toàn bộ yêu thích
          </Button>
        </Popconfirm>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border shadow-sm overflow-hidden bg-white">
            {favoriteProduct.map((product: Product) => {
              const isItemLoading = isProcessing === product._id;

              return (
                <div
                  key={product?._id}
                  className={`relative border-b p-4 md:p-5 last:border-b-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${isItemLoading ? "opacity-50 pointer-events-none" : "hover:bg-muted/30"
                    }`}
                >
                  <div className="relative border rounded-xl overflow-hidden shrink-0 shadow-sm mx-auto sm:mx-0">
                    <img
                      src={product.image}
                      alt={product?.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover hover:scale-110 transition duration-500"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-tight hover:text-primary transition-colors cursor-pointer">
                        {product?.name}
                      </h2>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Danh mục:{" "}
                          <span className="text-foreground font-medium uppercase">
                            {product?.category?.name || "Đang cập nhật"}
                          </span>
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground italic">
                          Tình trạng:{" "}
                          <span className="text-emerald-500 font-medium italic">
                            Còn hàng
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-auto">
                      {/* NÚT THÊM VÀO GIỎ */}
                      <AddToCartButton
                        product={product}
                        className="rounded-lg font-bold shadow-sm"
                      />

                      <div className="h-4 w-[1px] bg-border hidden sm:block" />

                      {/* NÚT XÓA */}
                      <Popconfirm
                        title="Xóa khỏi yêu thích?"
                        onConfirm={() => handleRemoveProduct(product._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={isItemLoading ? <LoadingOutlined /> : <DeleteOutlined />}
                          className="text-xs sm:text-sm font-medium"
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-dashed sm:min-w-[160px]">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        Giá hiện tại
                      </span>
                      <PriceFormatter
                        amount={product?.price}
                        className="font-black text-primary text-xl sm:text-2xl"
                      />
                    </div>

                    <Link to={`/product/${product.slug}`} className="hidden md:block">
                      <Button size="small" type="link" className="text-xs italic">Xem chi tiết</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishListProducts;