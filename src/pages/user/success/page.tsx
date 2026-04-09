"use client";

import { useSearchParams } from "react-router";
import { Suspense, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Package, CreditCard, Truck, Wallet, Loader2, QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useOrder } from "@/hooks/useOrder";
import { toast } from "sonner";

const SuccessPageContent = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { confirmMomoPayment, isConfirming } = useOrder();
  const hasConfirmed = useRef(false);
  const orderNumber = searchParams.get("orderNumber") || searchParams.get("orderId");
  const resultCode = searchParams.get("resultCode");
  const isMomo = searchParams.has("partnerCode") || !!resultCode;
  const paymentMethod = isMomo ? "momo" : (searchParams.get("payment") || "cod");

  useEffect(() => {
    const triggerConfirm = async () => {
      if (paymentMethod === "momo" && resultCode === "0" && orderNumber && !hasConfirmed.current) {
        hasConfirmed.current = true;
        try {
          await confirmMomoPayment({ orderNumber, resultCode });
          toast.success(t("success_page.payment.confirm_success") || "Payment confirmed!");
        } catch (error) {
          console.error("Confirmation Error:", error);
        }
      }
    };

    triggerConfirm();
  }, [paymentMethod, resultCode, orderNumber, confirmMomoPayment, t]);

  const paymentInfo = useMemo(() => {
    if (paymentMethod === "momo") {
      const isSuccess = resultCode === "0";
      return {
        icon: <Wallet className={`w-5 h-5 ${isSuccess ? 'text-pink-500' : 'text-red-500'}`} />,
        label: "MoMo Wallet",
        status: isSuccess ? t("success_page.payment.card_status") : "Payment Failed",
        statusColor: isSuccess ? "text-green-500" : "text-red-500",
        message: isSuccess
          ? "Thank you for your payment via MoMo."
          : "Transaction failed or was canceled. Please check your MoMo app."
      };
    }

    if (paymentMethod === "BANK_TRANSFER") {
      return {
        icon: <QrCode className="w-5 h-5 text-blue-500" />,
        label: "Chuyển khoản Ngân hàng",
        status: "Chờ thanh toán",
        statusColor: "text-blue-500",
        message: "Vui lòng quét mã QR bên dưới bằng ứng dụng Ngân hàng để thanh toán."
      };
    }

    if (paymentMethod === "card") {
      return {
        icon: <CreditCard className="w-5 h-5 text-blue-500" />,
        label: t("success_page.payment.card"),
        status: t("success_page.payment.card_status"),
        statusColor: "text-green-500",
        message: t("success_page.payment.card_msg")
      };
    }

    return {
      icon: <Truck className="w-5 h-5 text-amber-500" />,
      label: t("success_page.payment.cod"),
      status: t("success_page.payment.cod_status"),
      statusColor: "text-amber-500",
      message: t("success_page.payment.cod_msg")
    };
  }, [paymentMethod, resultCode, t]);
  const isMomoSuccess = resultCode === "0";
  const isStep2Completed = isMomoSuccess || paymentMethod === "card";

  return (
    <div className="pb-5 flex items-center justify-center text-foreground min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-2xl w-full text-center border border-border relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-green-400 to-green-600"></div>

        {isConfirming && (
          <div className="absolute inset-0 bg-card/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-2" />
            <p className="text-sm font-medium">Verifying payment with server...</p>
          </div>
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
          className="relative mb-4"
        >
          <div className={`w-16 h-16 ${isMomoSuccess || paymentMethod !== 'momo' ? 'bg-green-600' : 'bg-red-500'} rounded-full flex items-center justify-center mx-auto shadow-xl`}>
            {isMomoSuccess || paymentMethod !== 'momo' ? <Check className="w-10 h-10 text-white" /> : <span className="text-white text-3xl font-bold">!</span>}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent"
        >
          {isMomoSuccess || paymentMethod !== 'momo' ? t("success_page.title") : "Payment Issue"}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-6"
        >
          <div className="bg-muted rounded-2xl p-4 text-left border border-border shadow-inner">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-500" />
              {t("success_page.order_details")}
            </h3>

            <p className="opacity-90 mb-1">{t("success_page.thank_you")}</p>
            <div className="border rounded-xl p-3 border-green-600 bg-green-600/10 shadow-sm my-3">
              <p className="text-sm opacity-80">{t("success_page.order_number")}</p>
              <p className="text-2xl font-bold text-green-500 tracking-wide">#{orderNumber}</p>
            </div>

            <div className={`border rounded-xl p-3 shadow-sm ${paymentInfo.statusColor.replace('text', 'border')} bg-muted/50`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 opacity-70" />
                  <span className="text-sm opacity-80">{t("success_page.payment_method")}</span>
                </div>
                <span className={`text-sm font-medium ${paymentInfo.statusColor}`}>
                  {paymentInfo.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {paymentInfo.icon}
                <span className="font-medium">{paymentInfo.label}</span>
              </div>
              <p className="text-sm opacity-70 mt-2">{paymentInfo.message}</p>
            </div>
          </div>

          {/* QR Code Section */}
          {paymentMethod === "BANK_TRANSFER" && (
            <div className="bg-white rounded-2xl p-6 border border-blue-200 mt-4 mb-6 flex flex-col items-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-400 to-indigo-600"></div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" /> Quét mã để thanh toán
              </h3>
              <p className="text-sm text-gray-500 mb-4 text-center">Vui lòng quét mã QR dưới đây bằng ứng dụng Ngân hàng của bạn</p>
              <div className="p-2 bg-white border rounded-2xl shadow-sm mb-4">
                <img
                  src="/qr-payment.jpg"
                  alt="Mã QR Thanh Toán của Admin"
                  className="w-56 h-fit object-contain rounded-xl"
                />
              </div>

              <div className="w-full bg-blue-50/50 rounded-xl p-4 border border-blue-100 text-left mb-2">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">Tổng tiền cần CK:</span>
                  <span className="text-base font-bold text-blue-700">{parseInt(searchParams.get("amount") || "0").toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Nội dung CK:</span>
                  <span className="text-sm font-mono font-bold tracking-wide bg-blue-100 text-blue-800 px-3 py-1 rounded-md">{orderNumber}</span>
                </div>
              </div>

              <div className="mt-2 w-full p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <p className="text-sm font-medium text-amber-800">
                  ⚠️ Yêu cầu bắt buộc:
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Sau khi chuyển khoản thành công, vui lòng <strong>nhắn tin cho Admin</strong> (nhấn vào biểu tượng Chat góc dưới màn hình) kèm hình ảnh CK hoặc đọc mã đơn <strong>{orderNumber}</strong> để Admin xác nhận ngay nhé!
                </p>
              </div>
            </div>
          )}

          {/* Timeline Section */}
          <div className="bg-muted rounded-2xl p-4 border border-border shadow-inner">
            <h3 className="font-semibold mb-4 text-center">{t("success_page.steps.title")}</h3>
            <div className="flex items-center justify-between text-sm px-2">
              {/* Step 1 */}
              <div className="flex flex-col items-center z-0">
                <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow">✓</div>
                <span className="mt-2 text-green-500 font-medium text-[10px] sm:text-xs">{t("success_page.steps.step_1")}</span>
              </div>

              <div className={`flex-1 h-[2px] mb-6 ${isStep2Completed ? 'bg-green-500' : 'bg-foreground/20'}`}></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow transition-colors duration-500 ${isStep2Completed ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {isStep2Completed ? "✓" : "2"}
                </div>
                <span className={`mt-2 font-medium text-[10px] sm:text-xs ${isStep2Completed ? 'text-green-500' : 'text-yellow-500'}`}>
                  {isStep2Completed ? t("success_page.payment.card_status") : t("success_page.steps.step_2")}
                </span>
              </div>

              <div className="flex-1 h-[2px] mb-6 bg-foreground/20"></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 bg-primary/40 rounded-full flex items-center justify-center text-white font-bold shadow">3</div>
                <span className="mt-2 text-foreground/60 font-medium text-[10px] sm:text-xs">{t("success_page.steps.step_3")}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-6 border-t border-border"
        >
          <p className="text-xs sm:text-sm opacity-70">
            {t("success_page.footer.help")}{" "}
            <a href="mailto:thangtrandz04@gmail.com" className="text-blue-500 hover:underline">thangtrandz04@gmail.com</a>
            {" • "}
            <a href="tel:+84389215396" className="text-blue-500 hover:underline">038 921 5396</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Success Details...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;