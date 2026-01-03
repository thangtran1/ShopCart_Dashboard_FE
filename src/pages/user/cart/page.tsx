"use client";

import { useState } from "react";
import PriceFormatter from "@/components/user/PriceFormatter";
import QuantityButtons from "@/components/user/QuantityButtons";
import Title from "@/ui/title";
import { Separator } from "@/ui/separator";
import { Button, Popconfirm, Badge } from "antd";
import {
  DeleteOutlined,
  LoadingOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { useRouter } from "@/router/hooks/use-router";
import ProductSideMenu from "../public/ProductSideMenu";
import { useUserToken } from "@/store/userStore";
import NoAccess from "@/components/user/NoAccess";
import EmptyCart from "@/components/user/EmptyCart";
import { useCart } from "@/hooks/useCart";

const CartPage = () => {
  const userToken = useUserToken();
  const navigate = useRouter();
  const { items, loading, totalAmount, removeItem, clearCart } = useCart();

  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleResetCart = async () => {
    setIsProcessing("clear");
    try {
      await clearCart();
      toast.success("Giỏ hàng đã được làm trống!");
    } catch (error) {
      toast.error("Không thể reset giỏ hàng");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRemoveCartProduct = async (id: string) => {
    setIsProcessing(id);
    try {
      await removeItem(id);
      toast.success("Đã xóa sản phẩm!");
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm");
    } finally {
      setIsProcessing(null);
    }
  };
  const handleCheckout = () => {
    navigate.push("/checkout");
  };

  const subTotal = totalAmount;
  const shippingFee = 0;
  const finalTotal = subTotal + shippingFee;

  if (!userToken?.accessToken) return <NoAccess />;

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <LoadingOutlined className="text-4xl text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">
          Đang tải giỏ hàng của bạn...
        </p>
      </div>
    );
  }

  if (items.length === 0) return <EmptyCart />;

  return (
    <div>
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-4">
          <Badge
            count={items.length}
            showZero
            color="#1677ff"
            offset={[-2, 2]}
          >
            <div className="p-3 bg-primary/10 rounded-xl transition-colors hover:bg-primary/20">
              <ShoppingCartOutlined className="text-2xl text-primary" />
            </div>
          </Badge>

          <div>
            <Title className="text-2xl font-bold tracking-tight mb-0.5">
              Giỏ hàng của bạn
            </Title>
            <p className="text-sm text-muted-foreground">
              Xem lại các sản phẩm đã chọn và tiến hành thanh toán đơn hàng của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border shadow-sm overflow-hidden">
            {items.map((item: any) => {
              const { product, quantity } = item;
              const isItemLoading = isProcessing === product._id;

              return (
                <div
                  key={product?._id}
                  className={`relative border-b p-4 md:p-5 last:border-b-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${isItemLoading
                    ? "opacity-50 pointer-events-none"
                    : "hover:bg-muted/50"
                    }`}
                >
                  <div className="relative border rounded-xl overflow-hidden shrink-0 shadow-sm mx-auto sm:mx-0">
                    <img
                      src={product.image}
                      alt={product?.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-tight">
                        {product?.name}
                      </h2>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Loại:{" "}
                          <span className="text-foreground font-medium uppercase">
                            {product?.type}
                          </span>
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground italic">
                          Kho:{" "}
                          <span className="text-success font-medium italic">
                            Còn hàng
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-auto">
                      <div className="bg-slate-100/80 dark:bg-primary/20 p-1 rounded-lg scale-90 sm:scale-100 origin-left">
                        <QuantityButtons product={product} />
                      </div>

                      <Separator
                        orientation="vertical"
                        className="h-4 hidden sm:block"
                      />

                      <Popconfirm
                        title="Xóa khỏi giỏ hàng?"
                        onConfirm={() => handleRemoveCartProduct(product._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={
                            isItemLoading ? (
                              <LoadingOutlined />
                            ) : (
                              <DeleteOutlined />
                            )
                          }
                          className="text-xs sm:text-sm"
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-dashed sm:min-w-[140px]">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        Thành tiền
                      </span>
                      <PriceFormatter
                        amount={product?.price * quantity}
                        className="font-black text-primary text-xl sm:text-2xl"
                      />
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        (<PriceFormatter amount={product?.price} />)
                      </span>
                    </div>

                    <div className="hidden md:block">
                      <ProductSideMenu product={product} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center p-2 rounded-lg border border-border">
            <Button
              type="link"
              onClick={() => navigate.push("/")}
              icon={<ArrowRightOutlined className="rotate-180" />}
            >
              Tiếp tục mua sắm
            </Button>

            <Popconfirm
              title="Làm trống giỏ hàng"
              description="Bạn có chắc chắn muốn xóa tất cả sản phẩm không?"
              onConfirm={handleResetCart}
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
                className="font-medium"
              >
                Xóa toàn bộ giỏ hàng
              </Button>
            </Popconfirm>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl border shadow-sm sticky top-24 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCartOutlined /> Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground whitespace-nowrap text-sm">
                  Tạm tính:
                </span>
                <PriceFormatter
                  amount={subTotal}
                  className="text-foreground font-medium text-right"
                />
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  Phí vận chuyển:
                </span>
                <span className="text-success font-medium italic text-sm">
                  Miễn phí
                </span>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-1">
                <span className="font-bold text-sm uppercase">Tổng tiền</span>
                <PriceFormatter
                  amount={finalTotal}
                  className="text-2xl sm:text-3xl font-black text-primary leading-none"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic text-right mt-1">
                (Đã bao gồm VAT)
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              block
              className="h-14 font-bold text-lg rounded-xl shadow-lg shadow-blue-100 uppercase tracking-widest hover:scale-[1.02] transition"
              onClick={handleCheckout}
            >
              Tiến hành đặt hàng
            </Button>
            <div className="flex items-center justify-center gap-4 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="master" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;