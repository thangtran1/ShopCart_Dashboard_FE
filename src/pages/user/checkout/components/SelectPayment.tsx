"use client";

import { useState } from "react";
import { Modal, Button, Typography } from "antd";
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

interface SelectPaymentProps {
  method: string | number | null;
  onChange: (value: any) => void;
}

export default function SelectPayment({ method, onChange }: SelectPaymentProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<any>(method);

  const paymentMethods = [
    {
      id: 1,
      title: t("checkout.payment.methods.store"),
      description: t("checkout.payment.methods.store_desc"),
      icon: "https://cdn2.cellphones.com.vn/x400,webp,q100/media/payment-logo/COS.png",
    },
    {
      id: 2,
      title: t("checkout.payment.methods.qr"),
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
      description: t("checkout.payment.methods.momo_desc"),
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/momo_vi.png",
    },
    {
      id: 5,
      title: t("checkout.payment.methods.visa"),
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/onepay.png",
    },
    {
      id: 6,
      title: "Kredivo",
      description: t("checkout.payment.methods.kredivo_desc"),
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/kredivo.png",
    },
    {
      id: 7,
      title: t("checkout.payment.methods.cod"),
      description: t("checkout.payment.methods.cod_desc"),
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
  ];

  const handleConfirm = () => {
    onChange(tempSelected);
    setIsModalOpen(false);
  };

  const selectedPayment = paymentMethods.find((m) => m.id === method);

  return (
    <div className="space-y-4">
      <Title level={4}>{t("checkout.payment.title")}</Title>

      <div
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <CreditCardOutlined className="text-2xl" />
          <div className="flex flex-col gap-1">
            <span className="text-primary font-semibold text-base">
              {selectedPayment ? selectedPayment.title : t("checkout.payment.placeholder")}
            </span>
            <span className="text-muted-foreground text-xs">
              {t("checkout.payment.discount_hint")}
            </span>
          </div>
        </div>
        <RightOutlined />
      </div>

      <Modal
        centered
        title={<div className="w-full text-center text-lg font-semibold">{t("checkout.payment.modal_title")}</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button 
            key="submit" 
            type="primary" 
            block 
            size="large" 
            disabled={!tempSelected} 
            onClick={handleConfirm}
            className="rounded-lg"
          >
            {t("checkout.payment.confirm")}
          </Button>,
        ]}
      >
        <div className="max-h-[400px] overflow-y-auto space-y-2 py-4 custom-scrollbar">
          {paymentMethods.map((item) => (
            <div
              key={item.id}
              onClick={() => setTempSelected(item.id)}
              className={`relative flex items-center p-3 rounded-lg cursor-pointer transition-all border
                ${tempSelected === item.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              <div className="mr-4 w-12 h-8 flex-shrink-0">
                <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{item.title}</div>
                {item.description && <div className="text-muted-foreground text-[11px] italic">{item.description}</div>}
              </div>
              {tempSelected === item.id && <CheckCircleOutlined className="text-primary text-lg" />}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}