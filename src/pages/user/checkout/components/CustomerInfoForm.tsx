"use client";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const CustomerInfoForm = ({ value, onChange }: any) => {
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <Title level={4} className="mb-0">
        {t("customer_info.title")}
      </Title>
      
      <div className="space-y-4 border border-border rounded-lg p-4 bg-card shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              {t("customer_info.first_name")} *
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={value.firstName}
              onChange={handleInputChange}
              placeholder={t("customer_info.first_name_placeholder")}
              className="focus-visible:ring-primary"
              required
            />
            <p className="text-[11px] text-muted-foreground italic">
              {t("customer_info.first_name_hint")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              {t("customer_info.last_name")} *
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={value.lastName}
              onChange={handleInputChange}
              placeholder={t("customer_info.last_name_placeholder")}
              className="focus-visible:ring-primary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1 text-sm font-medium">
              {t("profile_drawer.form.labels.email")} *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={value.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className="focus-visible:ring-primary"
              required
            />
            <p className="text-[11px] text-muted-foreground italic">
              {t("customer_info.email_hint")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1 text-sm font-medium">
              {t("profile_drawer.form.labels.phone")} *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={value.phone}
              onChange={handleInputChange}
              placeholder="0123 456 789"
              className="focus-visible:ring-primary"
              required
            />
            <p className="text-[11px] text-muted-foreground italic">
              {t("customer_info.phone_hint")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};