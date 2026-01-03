"use client";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/hooks/useCart";
import { useOrder } from "@/hooks/useOrder";
import { Typography } from "antd";
import { toast } from "sonner";
import { CustomerInfoForm } from "./components/CustomerInfoForm";
import ShippingAddressForm from "./components/ShippingAddressForm";
import SelectPayment from "./components/SelectPayment";
import OrderSummary from "./components/OrderSummary";
import { useRouter } from "@/router/hooks";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CheckoutPage = () => {
  const { items, totalAmount, loading: cartLoading, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [shippingDetails, setShippingDetails] = useState<any>(null);

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate.push("/cart");
    }
  }, [items, cartLoading, navigate]);

  const handleShippingChange = useCallback((details: any) => {
    setShippingDetails(details);
  }, []);

  const discountAmount = selectedCoupon
    ? selectedCoupon.discountType === "percentage"
      ? (totalAmount * selectedCoupon.discountValue) / 100
      : selectedCoupon.discountValue
    : 0;
  const finalTotal = totalAmount - discountAmount;

  const handlePlaceOrder = async () => {
    if (!shippingDetails?.isValid || !customerInfo.phone || !customerInfo.firstName) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng và cá nhân!");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingAddress: {
          fullName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
          phone: customerInfo.phone,
          address: `${shippingDetails.address}, ${shippingDetails.wardName}, ${shippingDetails.districtName}`,
          city: shippingDetails.provinceName,
          notes: shippingDetails.notes
        },
        paymentMethod: String(paymentMethod).toUpperCase() === "COD" ? "COD" : "ONLINE",
        couponCode: selectedCoupon?.code || "",
      };

      const result = await placeOrder(orderData);
      if (result) {
        toast.success("Đặt hàng thành công!");
        await clearCart();
        navigate.push(`/success?orderNumber=${result._id}`);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-6">
        <div className="relative flex items-center mb-2 justify-center">
          <div className="absolute w-20 h-20 border-3 border-primary/10 border-t-primary rounded-full animate-spin" />
          <ShoppingCartOutlined className="text-4xl text-primary animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Đang tải đơn hàng</h3>
          <p className="text-slate-400 text-sm italic animate-pulse">Vui lòng đợi trong giây lát...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <Title level={2} className="my-8">
        Thanh Toán
      </Title>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-8">
          <CustomerInfoForm value={customerInfo} onChange={setCustomerInfo} />

          <ShippingAddressForm onChange={handleShippingChange} />

          <SelectPayment method={paymentMethod} onChange={setPaymentMethod} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            totalAmount={totalAmount}
            discountAmount={discountAmount}
            finalTotal={finalTotal}
            selectedCoupon={selectedCoupon}
            onSelectCoupon={setSelectedCoupon}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;