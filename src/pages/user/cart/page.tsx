"use client";

import PriceFormatter from "@/components/user/PriceFormatter";
import QuantityButtons from "@/components/user/QuantityButtons";
import Title from "@/ui/title";
import { Separator } from "@/ui/separator";
import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
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

  const handleResetCart = async () => {
    try {
      await clearCart();
      toast.success("Đã làm trống giỏ hàng!");
    } catch (error) {
      toast.error("Không thể reset giỏ hàng");
    }
  };

  const handleCheckout = () => {
    navigate.push("/checkout");
  };

  const handleRemoveCartProduct = async (id: string) => {
    try {
      await removeItem(id);
      toast.success("Đã xóa sản phẩm khỏi giỏ!");
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  const subTotal = totalAmount;
  const discount = 0; // logic tính discount ...
  const finalTotal = subTotal - discount;

  if (!userToken?.accessToken) return <NoAccess />;

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingOutlined className="text-3xl text-primary" />
      </div>
    );
  }

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="pb-6">
      <div className="flex items-center gap-2 pb-3">
        <Title>Shopping Cart</Title>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg">
          <div className="border rounded-md">
            {items.map((item: any) => {
              const { product, quantity } = item;

              return (
                <div
                  key={product?._id}
                  className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                >
                  <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                    <div className="border border-success/20 p-4 rounded-2xl">
                      <img
                        src={product.image}
                        alt={product?.name}
                        className="w-32 h-28 object-cover rounded-lg hover:scale-105 transition"
                      />
                    </div>

                    <div className="h-full flex flex-1 flex-col justify-between py-1">
                      <div className="flex flex-col gap-0.5 md:gap-1.5">
                        <h2 className="text-base font-semibold line-clamp-1">
                          {product?.name}
                        </h2>
                        <p className="text-sm capitalize">
                          Variant: <span className="font-semibold">{product?.type}</span>
                        </p>
                        <p className="text-sm capitalize">
                          Status: <span className="font-semibold">{product?.status}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <ProductSideMenu
                          product={product}
                          className="relative top-0 right-0"
                        />

                        <Popconfirm
                          title="Xóa sản phẩm"
                          description="Bạn có chắc muốn xóa sản phẩm này?"
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => handleRemoveCartProduct(product._id)}
                        >
                          <Tooltip title="Delete product">
                            <Button
                              icon={<DeleteOutlined />}
                              danger
                              size="small"
                            />
                          </Tooltip>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-between h-24 md:h-44 p-0.5 md:p-1">
                    <PriceFormatter
                      amount={product?.price * quantity}
                      className="font-bold text-primary text-2xl"
                    />
                    <div className="flex justify-end w-full">
                      <QuantityButtons className="flex justify-end" product={product} />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end">
              <Popconfirm
                title="Reset giỏ hàng"
                description="Bạn có chắc muốn xóa toàn bộ sản phẩm?"
                onConfirm={handleResetCart}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button className="m-5 font-semibold" type="primary" danger>
                  Reset Cart
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="md:inline-block w-full p-4 rounded-lg border sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>SubTotal</span>
                <PriceFormatter amount={subTotal} />
              </div>
              <div className="flex items-center justify-between text-green-600">
                <span>Discount</span>
                <PriceFormatter amount={discount} />
              </div>
              <Separator />
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Total</span>
                <PriceFormatter
                  amount={finalTotal}
                  className="text-lg font-bold text-primary"
                />
              </div>

              <Button
                type="primary"
                size="large"
                block
                className="h-12 font-bold uppercase tracking-wider"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;