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
import { useTranslation } from "react-i18next";
import { useUserInfo } from "@/store/userStore";

const { Title } = Typography;

const CheckoutPage = () => {
  const { t } = useTranslation();
  const userInfo = useUserInfo()

  const { items, totalAmount, loading: cartLoading, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);


  useEffect(() => {
    if (userInfo) {
      setCustomerInfo({
        fullName: userInfo.username || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
      });
    }
  }, [userInfo]);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [shippingDetails, setShippingDetails] = useState<any>(null);

  useEffect(() => {
    if (!cartLoading && items.length === 0 && !isOrdering) {
      navigate.push("/cart");
    }
  }, [items.length, cartLoading, navigate, isOrdering]); 

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
    if (!shippingDetails?.isValid || !customerInfo.phone || !customerInfo.fullName) {
      toast.error(t("checkout.messages.missing_info"));
      return;
    }
    if (!paymentMethod) {
      toast.error(t("checkout.messages.select_payment_method"));
      return;
    }
  
    setLoading(true);
    try {
      const detail = shippingDetails.address || "";
      const ward = shippingDetails.wardName || "";
      const district = shippingDetails.districtName || "";
      const addressParts = [detail];
      if (ward && !detail.toLowerCase().includes(ward.toLowerCase())) {
        addressParts.push(ward);
      }
      if (district && !detail.toLowerCase().includes(district.toLowerCase())) {
        addressParts.push(district);
      }
  
      const orderData = {
        shippingAddress: {
          fullName: customerInfo.fullName,
          phone: customerInfo.phone,
          address: addressParts.filter(Boolean).join(", "),
          city: shippingDetails.provinceName,
          notes: shippingDetails.notes,
        },
        paymentMethod: paymentMethod,
        couponCode: selectedCoupon?.code || "",
      };
      const result = await placeOrder(orderData);
      if (result) {
        setIsOrdering(true); 

        const orderNum = result.order?.orderNumber || result.order?._id;

        await clearCart(); 

        if (paymentMethod === "MOMO" && result.paymentUrl) {
          toast.info(t("checkout.messages.redirecting_to_momo"));
          window.location.href = result.paymentUrl;
        } else {
          toast.success(t("checkout.messages.order_success"));
          navigate.push(`/success?orderNumber=${orderNum}&payment=${paymentMethod}`);
        }

        await clearCart();
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Order failed");
      console.error(error);
    } finally {
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
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            {t("checkout.loading_title")}
          </h3>
          <p className="text-slate-400 text-sm italic animate-pulse">
            {t("checkout.loading_desc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <Title level={2} className="my-8">
        {t("checkout.title")}
      </Title>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-8">
          <CustomerInfoForm
            value={customerInfo}
            onChange={setCustomerInfo}
          />

          <ShippingAddressForm onChange={handleShippingChange} />

          <SelectPayment
            method={paymentMethod}
            onChange={setPaymentMethod}
          />
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