"use client";

import { EditOutlined, KeyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

interface PasswordSectionProps {
  onChange: () => void;
}

export default function PasswordSection({ onChange }: PasswordSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border p-5 shadow-sm bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-primary/20">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 shrink-0">
          <KeyOutlined className="text-xl text-primary" />
        </div>
        
        <div>
          <h2 className="text-lg font-bold tracking-tight">{t("password.title")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("password.subtitle")}
          </p>
        </div>
      </div>

      <Button
        type="primary"
        ghost
        icon={<EditOutlined />}
        onClick={onChange}
        className="font-bold rounded-lg h-10 w-full sm:w-auto"
      >
        {t("password.btn_change")}
      </Button>
    </div>
  );
}