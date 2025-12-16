import { useState } from "react";
import { Modal, Button, Space, Typography, Card, Statistic } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  CreditCardOutlined,
  DownloadOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { Shield, Truck } from "lucide-react";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Separator } from "@/ui/separator";
const { Title, Text } = Typography;
const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 5;
const paymentMethods = [
  {
    id: 1,
    title: "Thanh toán tại cửa hàng",
    description: "CellphoneS giữ sản phẩm 24h.",
    icon: "https://cdn2.cellphones.com.vn/x400,webp,q100/media/payment-logo/COS.png",
  },
  {
    id: 2,
    title: "Chuyển khoản ngân hàng qua mã QR",
    icon: "https://cdn2.cellphones.com.vn/x400,webp,q100/media/wysiwyg/QRCode.png",
  },
  {
    id: 3,
    title: "VNPAY",
    icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/vnpay.png",
  },
  {
    id: 4,
    title: "MoMo",
    description: "Giảm 2% tối đa 200k",
    icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/momo_vi.png",
  },
  {
    id: 5,
    title: "Qua thẻ Visa/Master/JCB/Napas",
    icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/onepay.png",
  },
  {
    id: 6,
    title: "Kredivo",
    description: "Giảm 7% tối đa 1.000.000đ",
    icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/kredivo.png",
  },
  {
    id: 7,
    title: "Thanh toán khi nhận hàng",
    description: "Thanh toán trực tiếp khi nhận hàng (COD)",
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
];

export default function SelectPayment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<number | null>(null);
  const handleCopy = (text: any) => {
    navigator.clipboard.writeText(text);
    // Bạn có thể thêm message.success('Đã sao chép') của antd ở đây
  };
  const handleConfirm = () => {
    setPaymentMethod(selectedMethod);
    setIsModalOpen(false);
  };

  const selectedPayment = paymentMethods.find((m) => m.id === paymentMethod);

  return (
    <div className="space-y-4">
      <Title level={4}>Phương Thức Thanh Toán</Title>

      {/* Summary */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <CreditCardOutlined className="text-2xl" />
          <div className="flex flex-col gap-1">
            <span className="text-error/70 font-semibold text-base">
              {selectedPayment
                ? selectedPayment.title
                : "Chọn phương thức thanh toán"}
            </span>
            <span className="text-muted-foreground text-xs">
              Giảm thêm tới 1.000.000đ
            </span>
          </div>
        </div>
        <RightOutlined />
      </div>

      {/* Modal chọn phương thức */}
      <Modal
        centered
        title={
          <div className="w-full text-center text-lg font-semibold">
            Chọn phương thức thanh toán
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            block
            size="large"
            disabled={!selectedMethod}
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <Title level={5}>KHẢ DỤNG</Title>

        <Space direction="vertical" size={8} className="w-full">
          <div className="max-h-120 overflow-y-auto space-y-2 relative">
            {paymentMethods.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMethod(item.id)}
                className={`relative flex items-center p-2 rounded-lg cursor-pointer transition-all
                  ${
                    selectedMethod === item.id
                      ? "border border-error/40"
                      : "border border-border"
                  }
                `}
              >
                {/* Icon hiển thị ảnh */}
                <div className="mr-4 rounded-lg flex-shrink-0">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-20 h-14 object-contain"
                  />
                </div>

                <div className="flex-1">
                  <div className="font-semibold">{item.title}</div>
                  {item.description && (
                    <div className="text-muted-foreground text-xs mt-1">
                      {item.description}
                    </div>
                  )}
                </div>

                {/* Tick icon khi chọn */}
                {selectedMethod === item.id && (
                  <div className="absolute top-1 right-1 text-error text-lg font-bold">
                    <CheckCircleOutlined />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Space>
      </Modal>
    </div>
  );
}
