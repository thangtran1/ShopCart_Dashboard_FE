"use client";

import {
  ShieldCheck,
  Laptop,
  Watch,
  Calendar,
  PackageCheck,
  Truck,
  Wallet,
  Headset,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ServiceFeatures() {
  const { t } = useTranslation();

  const FEATURES = [
    {
      icon: ShieldCheck,
      title: t("features.phone_warranty"),
      highlight: `18 ${t("features.months")}`,
    },
    {
      icon: Laptop,
      title: t("features.laptop_warranty"),
      highlight: `12 ${t("features.months")}`,
    },
    {
      icon: Watch,
      title: t("features.watch_warranty"),
      highlight: `5 ${t("features.years")}`,
    },
    {
      icon: Calendar,
      title: t("features.trial_title"),
      highlight: t("features.trial_highlight"),
      sub: t("features.trial_sub"),
    },
    {
      icon: PackageCheck,
      title: t("features.hold_order_title"),
      highlight: t("features.hold_order_highlight"),
    },
    {
      icon: Truck,
      title: t("features.shipping_title"),
      sub: t("features.shipping_sub"),
    },
    {
      icon: Wallet,
      title: t("features.payment_title"),
      sub: t("features.payment_sub"),
    },
    {
      icon: Headset,
      title: t("features.support_title"),
      highlight: t("features.support_highlight"),
    },
  ];

  return (
    <div className="my-6 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 lg:max-h-none lg:overflow-visible grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {FEATURES.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-success/40 p-3 hover:shadow-md transition bg-background"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-error/10 text-error">
              <Icon className="w-6 h-6" />
            </div>

            <div className="text-sm leading-snug">
              <div className="font-medium">
                {item.title}{" "}
                {item.highlight && (
                  <span className="text-error/90 font-semibold">
                    {item.highlight}
                  </span>
                )}
              </div>
              {item.sub && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {item.sub}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}