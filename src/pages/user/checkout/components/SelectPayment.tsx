"use client";

import { useState } from "react";
import { Modal, Button, Space, Typography } from "antd"; // Đảm bảo dùng Title từ antd cho đồng bộ
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

// 1. Thêm định nghĩa Interface ở đây
interface SelectPaymentProps {
  method: string | number | null;
  onChange: (value: any) => void;
}

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

export default function SelectPayment({ method, onChange }: SelectPaymentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State tạm thời để người dùng "chọn" trong modal trước khi nhấn "Xác nhận"
  const [tempSelected, setTempSelected] = useState<any>(method);

  const handleConfirm = () => {
    onChange(tempSelected); // Gửi giá trị về trang cha
    setIsModalOpen(false);
  };

  const selectedPayment = paymentMethods.find((m) => m.id === method);

  return (
    <div className="space-y-4">
      <Title level={4}>Phương Thức Thanh Toán</Title>

      <div
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <CreditCardOutlined className="text-2xl" />
          <div className="flex flex-col gap-1">
            <span className="text-primary font-semibold text-base">
              {selectedPayment ? selectedPayment.title : "Chọn phương thức thanh toán"}
            </span>
            <span className="text-muted-foreground text-xs">Giảm thêm tới 1.000.000đ</span>
          </div>
        </div>
        <RightOutlined />
      </div>

      <Modal
        centered
        title={<div className="w-full text-center text-lg font-semibold">Chọn phương thức thanh toán</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="submit" type="primary" block size="large" disabled={!tempSelected} onClick={handleConfirm}>
            Xác nhận
          </Button>,
        ]}
      >
        <div className="max-h-[400px] overflow-y-auto space-y-2 py-4">
          {paymentMethods.map((item) => (
            <div
              key={item.id}
              onClick={() => setTempSelected(item.id)}
              className={`relative flex items-center p-3 rounded-lg cursor-pointer transition-all border
                ${tempSelected === item.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              <div className="mr-4 w-16 h-10 flex-shrink-0">
                <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{item.title}</div>
                {item.description && <div className="text-muted-foreground text-[11px]">{item.description}</div>}
              </div>
              {tempSelected === item.id && <CheckCircleOutlined className="text-primary text-lg" />}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}