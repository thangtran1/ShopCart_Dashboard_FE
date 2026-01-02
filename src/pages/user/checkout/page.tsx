"use client";

import { useEffect, useState } from "react";
import PriceFormatter from "@/components/user/PriceFormatter";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Separator } from "@/ui/separator";
import { Textarea } from "@/ui/textarea";
import { CreditCard, Truck, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "@/router/hooks";
import { } from "antd";

import { Typography, Select } from "antd";
import SelectPayment from "./components/SelectPayment";
import { useLocation } from "@/hooks/useLocation";
import { useCart } from "@/hooks/useCart";
import { useOrder } from "@/hooks/useOrder";
const { Title } = Typography;
const { Option } = Select;

const CheckoutPage = () => {
  const navigate = useRouter();
  const { items, totalAmount, clearCart, loading: cartLoading } = useCart();
  const { placeOrder } = useOrder();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "", // Phường/Xã
    state: "", // Tỉnh/Thành
    zipCode: "",
    notes: "",
    district: "", // Quận/Huyện (mới thêm)
  });

  // Thông tin thẻ tín dụng
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const { provinces, districts, wards } = useLocation(
    formData.state,
    formData.district
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Nếu đổi Tỉnh -> Reset Huyện và Xã
      if (name === "state") {
        newData.district = "";
        newData.city = "";
      }
      // Nếu đổi Huyện -> Reset Xã
      if (name === "district") {
        newData.city = "";
      }

      return newData;
    });
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number: thêm khoảng trắng sau mỗi 4 số
    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, "").replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardData((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }

    // Format expiry date: MM/YY
    if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      const formatted =
        cleaned.length > 2
          ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
          : cleaned;
      setCardData((prev) => ({ ...prev, expiryDate: formatted }));
      return;
    }

    // CVV: chỉ cho phép 3-4 số
    if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setCardData((prev) => ({ ...prev, cvv: cleaned }));
      return;
    }

    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate thông tin thẻ
  const validateCardData = () => {
    const { cardNumber, cardName, expiryDate, cvv } = cardData;

    // Số thẻ phải có 16 số
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Số thẻ phải có 16 chữ số!");
      return false;
    }

    // Tên chủ thẻ không được trống
    if (!cardName.trim()) {
      toast.error("Vui lòng nhập tên chủ thẻ!");
      return false;
    }

    // Ngày hết hạn phải đúng format MM/YY và chưa hết hạn
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      toast.error("Ngày hết hạn không hợp lệ!");
      return false;
    }

    const [month, year] = expiryDate.split("/").map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) {
      toast.error("Tháng không hợp lệ!");
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      toast.error("Thẻ đã hết hạn!");
      return false;
    }

    // CVV phải có 3-4 số
    if (cvv.length < 3) {
      toast.error("CVV phải có ít nhất 3 chữ số!");
      return false;
    }

    return true;
  };

  const getLocationNames = () => {
    const provinceName = provinces.find(p => p.province_id === formData.state)?.province_name || "";
    const districtName = districts.find(d => d.district_id === formData.district)?.district_name || "";
    const wardName = wards.find(w => w.ward_id === formData.city)?.ward_name || "";
    return { provinceName, districtName, wardName };
  };

  const handlePlaceOrder = async () => {
    const { firstName, lastName, phone, address, state, district, city, notes } = formData;

    if (!firstName || !lastName || !phone || !address || !state || !district || !city || !notes) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    const { provinceName, districtName, wardName } = getLocationNames();


    const orderData = {
      shippingAddress: {
        fullName: `${firstName} ${lastName}`,
        phone: phone,
        address: `${address}, ${wardName}, ${districtName}, ${provinceName}`,
        city: provinceName,
        notes: notes
      },
      paymentMethod: paymentMethod.toUpperCase(),
    };

    try {
      const result = await placeOrder(orderData);

      if (result) {
        toast.success("Đặt hàng thành công!");
        await clearCart();
        navigate.push(`/success?orderNumber=${result._id}`);
      }
    } catch (error: any) {
      toast.error("Lỗi đặt hàng, vui lòng thử lại!");
    }
  };
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate.push("/cart");
    }
  }, [items, cartLoading, navigate]);
  if (cartLoading) return <div className="p-20 text-center">Đang tải giỏ hàng...</div>;
  if (items.length === 0) return null;

  return (
    <div className="min-h-screen pb-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2}>Thanh Toán</Title>
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Order Summary - Mobile First */}
          <div className="lg:col-span-1 lg:order-2 w-full">
            <div className="lg:sticky lg:top-4">
              <Title level={4}>Tóm Tắt Đơn Hàng</Title>

              <div className="space-y-4 border border-border rounded-lg p-4">
                <div className="space-y-2">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 p-2 border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-medium">
                          {product.name}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Số lượng: {quantity}
                        </p>
                      </div>
                      <PriceFormatter
                        amount={product.price * quantity}
                        className="text-sm md:text-base font-semibold"
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    comming soom ...
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Giảm giá:</span>
                    comming soom ...
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <PriceFormatter amount={totalAmount} className="text-lg font-bold" />
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="text-success">Thanh toán bảo mật</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="text-primary">Giao hàng nhanh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Title level={4}>Thông Tin Khách Hàng</Title>
              <div className="space-y-4 border border-border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ của bạn"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Nhập tên của bạn"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0123456789"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <Title level={4}>Địa Chỉ Giao Hàng</Title>
              <div className="space-y-4 border border-border rounded-lg p-4">
                {/* Số nhà, đường */}
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường"
                    required
                  />
                </div>

                {/* Tỉnh/Thành, Quận/Huyện, Phường/Xã */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Tỉnh/Thành *</Label>
                    <Select
                      id="state"
                      value={formData.state || undefined}
                      onChange={(value) => handleSelectChange("state", value)}
                      placeholder="Chọn Tỉnh/Thành"
                      className="w-full"
                      showSearch // Thêm dòng này
                      optionFilterProp="children" // Hỗ trợ tìm kiếm theo tên
                    >
                      {provinces.map((p) => (
                        <Option key={p.province_id} value={p.province_id}>
                          {p.province_name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* District / Quận */}
                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện *</Label>
                    <Select
                      id="district"
                      value={formData.district || undefined}
                      onChange={(value) =>
                        handleSelectChange("district", value)
                      }
                      placeholder="Chọn Quận/Huyện"
                      className="w-full"
                      disabled={!provinces.length || !formData.state}
                    >
                      {districts.map((d) => (
                        <Option key={d.district_id} value={d.district_id}>
                          {d.district_name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Ward / Phường */}
                  <div className="space-y-2">
                    <Label htmlFor="city">Phường/Xã *</Label>
                    <Select
                      id="city"
                      value={formData.city || undefined}
                      onChange={(value) => handleSelectChange("city", value)}
                      placeholder="Chọn Phường/Xã"
                      className="w-full"
                      disabled={!districts.length || !formData.district}
                    >
                      {wards.map((w) => (
                        // Khuyên dùng ward_id để đồng bộ, nếu backend cần name thì map lại lúc submit
                        <Option key={w.ward_id} value={w.ward_id}>
                          {w.ward_name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Zip code */}
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Mã bưu điện *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="100000"
                    required
                  />
                </div>

                {/* Ghi chú */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ghi chú thêm cho đơn hàng..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <SelectPayment />
            <div>
              <Title level={4}>Phương Thức Thanh Toán</Title>

              <div className="space-y-4 border border-border rounded-lg p-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div
                    className={`flex items-center space-x-2 p-4 border rounded-lg transition-colors ${paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : ""
                      }`}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <CreditCard className="w-5 h-5" />
                      Thẻ tín dụng/ghi nợ
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 p-4 border rounded-lg transition-colors ${paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : ""
                      }`}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <Label
                      htmlFor="cod"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <Truck className="w-5 h-5" />
                      Thanh toán khi nhận hàng (COD)
                    </Label>
                  </div>
                </RadioGroup>

                {/* Form nhập thông tin thẻ */}
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-border rounded-lg p-4 space-y-4 bg-muted/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        Thông tin thẻ được mã hóa an toàn
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Số thẻ *</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Tên chủ thẻ *</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardInputChange}
                        placeholder="NGUYEN VAN A"
                        className="uppercase"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="password"
                          value={cardData.cvv}
                          onChange={handleCardInputChange}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Thông tin COD */}
                {paymentMethod === "cod" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-border rounded-lg p-4 bg-muted/30"
                  >
                    <div className="flex items-center gap-2 text-amber-600">
                      <Truck className="w-5 h-5" />
                      <span className="font-medium">
                        Thanh toán khi nhận hàng
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng. Vui
                      lòng chuẩn bị đúng số tiền để thuận tiện cho việc giao
                      hàng.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Place Order Button */}
            <div>
              <div className="pt-2 border border-border rounded-lg p-4">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full h-12 text-lg font-semibold bg-primary transition-all duration-300"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {paymentMethod === "card"
                        ? "Đang thanh toán..."
                        : "Đang xử lý..."}
                    </div>
                  ) : (
                    <div className="flex text-foreground cursor-pointer items-center gap-2">
                      Thanh toán
                    </div>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Bằng cách đặt hàng, bạn đồng ý với điều khoản và chính sách
                  của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
