"use client";

import { useSearchParams } from "react-router";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Check, Package, CreditCard, Truck, Wallet } from "lucide-react";

const SuccessPageContent = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const paymentMethod = searchParams.get("payment") || "cod";

  const getPaymentInfo = () => {
    if (paymentMethod === "card") {
      return {
        icon: <CreditCard className="w-5 h-5 text-blue-500" />,
        label: "Thẻ tín dụng/ghi nợ",
        status: "Đã thanh toán",
        statusColor: "text-green-500",
        message: "Thanh toán đã được xác nhận. Đơn hàng sẽ được xử lý ngay."
      };
    }
    return {
      icon: <Truck className="w-5 h-5 text-amber-500" />,
      label: "Thanh toán khi nhận hàng (COD)",
      status: "Chờ thanh toán",
      statusColor: "text-amber-500",
      message: "Vui lòng chuẩn bị tiền mặt khi nhận hàng."
    };
  };

  const paymentInfo = getPaymentInfo();

  return (
    <div className="pb-5 flex items-center justify-center text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card/60 backdrop-blur-xl rounded-3xl shadow-2xl p-4 max-w-2xl w-full text-center border border-border relative overflow-hidden"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-green-400 to-green-600"></div>

        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
          className="relative mb-2"
        >
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <Check className="w-10 h-10 text-white" />
          </div>

          {/* Confetti effects */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-4 w-8 h-8 bg-yellow-500 rounded-full blur-sm opacity-80"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute -bottom-2 -left-3 w-6 h-6 bg-pink-500 rounded-full blur-sm opacity-80"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent"
        >
          🎉 Đặt Hàng Thành Công!
        </motion.h1>

        {/* Order Details Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 mb-6"
        >
          <div className="bg-muted rounded-2xl p-3 text-left border border-border shadow-inner">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-500" />
              Chi Tiết Đơn Hàng
            </h3>

            <p className="opacity-90 mb-1">
              Cảm ơn bạn đã mua hàng! Chúng tôi đang xử lý đơn hàng của bạn và sẽ giao sớm nhất có thể.
            </p>
            <p className="opacity-80 mb-2">
              Email xác nhận đơn hàng sẽ sớm được gửi đến bạn.
            </p>

            {/* Order Number Badge */}
            <div className="border rounded-xl p-3 border-green-600 bg-green-600/10 shadow-sm mb-3">
              <p className="text-sm opacity-80">Mã đơn hàng:</p>
              <p className="text-2xl font-bold text-green-500 tracking-wide">
                #{orderNumber}
              </p>
            </div>

            {/* Payment Method Info */}
            <div className={`border rounded-xl p-3 shadow-sm ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-500/10' : 'border-amber-500 bg-amber-500/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 opacity-70" />
                  <span className="text-sm opacity-80">Phương thức thanh toán:</span>
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

          {/* Timeline */}
          <div className="bg-muted rounded-2xl p-3 border border-border shadow-inner">
            <h3 className="font-semibold mb-2 text-center">Quy Trình Xử Lý</h3>

            <div className="flex items-center justify-between text-sm">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                  ✓
                </div>
                <span className="mt-2 text-green-500 font-medium">Đặt hàng</span>
              </div>

              <div className="flex-1 h-[2px] bg-green-500/50 mx-2"></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                  2
                </div>
                <span className="mt-2 text-yellow-500 font-medium">Xử lý</span>
              </div>

              <div className="flex-1 h-[2px] bg-foreground/40 mx-2"></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow">
                  3
                </div>
                <span className="mt-2 text-foreground font-medium">Giao hàng</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-6 border-t border-border"
        >
          <p className="text-sm">
            Cần hỗ trợ? Liên hệ{" "}
            <a href="mailto:thangtrandz04@gmail.com" className="text-blue-500 hover:underline">
              thangtrandz04@gmail.com
            </a>{" "}
            • Hotline{" "}
            <a href="tel:+84389215396" className="text-blue-500 hover:underline">
              038 921 5396
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
