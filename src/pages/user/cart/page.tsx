"use client";

import PriceFormatter from "@/components/user/PriceFormatter";
import QuantityButtons from "@/components/user/QuantityButtons";
import Title from "@/ui/title";
import { Separator } from "@/ui/separator";
import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@/router/hooks/use-router";
import ProductSideMenu from "../public/ProductSideMenu";
import useStore from "@/store/store";
import { useUserToken } from "@/store/userStore";
import NoAccess from "@/components/user/NoAccess";
import EmptyCart from "@/components/user/EmptyCart";

const CartPage = () => {
  const userToken = useUserToken();
  const navigate = useRouter();
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());

  const handleResetCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your cart?"
    );
    if (confirmed) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  const handleCheckout = () => {
    navigate.push("/checkout");
  };

  const handleRemoveCartProduct = (id: string) => {
    deleteCartProduct(id);
    toast.success("Product deleted successfully!");
  };

  return (
    <div className="pb-6">
      {!userToken?.accessToken ? (
        <NoAccess />
      ) : groupedItems?.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="flex items-center gap-2 pb-3">
            <Title>Shopping Cart</Title>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-lg">
              <div className="border rounded-md">
                {groupedItems?.map(({ product }: { product: any }) => {
                  const itemCount = getItemCount(product?._id);

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
                              Variant:{" "}
                              <span className="font-semibold">
                                {product?.type}
                              </span>
                            </p>
                            <p className="text-sm capitalize">
                              Status:{" "}
                              <span className="font-semibold">
                                {product?.status}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Tooltip title="Add to Favorite">
                              <ProductSideMenu
                                product={product}
                                className="relative top-0 right-0"
                              />
                            </Tooltip>

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
                          amount={(product?.price as number) * itemCount}
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
                  <Button
                    onClick={handleResetCart}
                    className="m-5 font-semibold"
                    type="primary"
                    danger
                  >
                    Reset Cart
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="md:inline-block w-full p-4 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>SubTotal</span>
                    <PriceFormatter amount={getSubTotalPrice()} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <PriceFormatter
                      amount={getSubTotalPrice() - getTotalPrice()}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-semibold text-lg">
                    <span>Total</span>
                    <PriceFormatter
                      amount={getTotalPrice()}
                      className="text-lg font-bold"
                    />
                  </div>

                  <Button
                    color="primary" variant="solid"
                    size="large"
                    disabled={loading}
                    onClick={handleCheckout}
                  >
                    {loading ? "Please wait..." : "Proceed to Checkout"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
