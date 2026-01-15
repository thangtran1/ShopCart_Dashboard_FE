"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { useAddressActions } from "@/hooks/useAddresses";
import { useUserProfile } from "@/hooks/useUserProfile";
import OrdersPage from "@/pages/user/orders/page";
import ProductCard from "@/pages/user/public/ProductCard";
import useStore from "@/store/store";
import SeeMore from "@/ui/see-more";
import Title from "@/ui/title";
import { HeartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function OverviewContent() {
  const { t } = useTranslation();
  const { favoriteProduct } = useStore();
  const { profile } = useUserProfile();
  const { addresses, isFetching } = useAddressActions();

  const reminders = [];

  const missingFields = [];
  if (!profile?.dateOfBirth) {
    missingFields.push(t("overview.reminders.fields.dob"));
  }

  if (missingFields.length > 0) {
    reminders.push({
      key: "user-info",
      icon: "ℹ️",
      message: t("overview.reminders.missing_fields", { fields: missingFields.join(", ") }),
      btnText: t("overview.reminders.update_now"),
      link: "/profile",
      colorClass: "bg-blue-50 border-blue-200 text-blue-600",
    });
  }

  // Check phone
  if (!profile?.phone) {
    reminders.push({
      key: "phone-info",
      icon: "ℹ️",
      message: t("overview.reminders.missing_phone"),
      btnText: t("overview.reminders.update_now"),
      link: "/profile",
      colorClass: "bg-blue-50 border-blue-200 text-blue-600",
    });
  }

  // Check địa chỉ
  if (!isFetching && addresses?.length === 0) {
    reminders.push({
      key: "address-info",
      icon: "📍",
      message: t("overview.reminders.no_address"),
      btnText: t("overview.reminders.add_now"),
      link: "/profile",
      colorClass: "bg-amber-50 border-amber-200 text-amber-600",
    });
  }

  return (
    <div>
      <div className="space-y-3">
        {reminders.map((item) => (
          <div
            key={item.key}
            className={`${item.colorClass} border mb-4 rounded-lg p-4 flex items-center justify-between shadow-sm`}
          >
            <div className="flex items-center gap-3">
              <div className="text-lg">{item.icon}</div>
              <span className="text-sm font-medium">
                {item.message}
              </span>
            </div>
            <button
              onClick={() => toast.warning("Feature under development 🛠️")}
              className="text-inherit cursor-pointer text-sm font-bold hover:underline flex items-center gap-1 whitespace-nowrap ml-4"
            >
              {item.btnText}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-start gap-2">
              <Badge showZero color="#1677ff" offset={[-2, 2]}>
                <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all hover:bg-primary/10">
                  <ShoppingOutlined className="text-2xl text-primary" />
                </div>
              </Badge>

              <div>
                <Title className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
                  {t("overview.orders.title")}
                </Title>
                <p className="text-sm text-muted-foreground max-w-[500px]">
                  {t("overview.orders.description")}
                </p>
              </div>
            </div>
          </div>
          <OrdersPage hideTitle />
        </div>
      </div>
      <div className="w-full mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge
              count={favoriteProduct.length}
              showZero
              color="#f43f5e"
              offset={[-2, 2]}
            >
              <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all hover:scale-105">
                <HeartOutlined className="text-2xl text-rose-500" />
              </div>
            </Badge>

            <div>
              <Title className="text-xl sm:text-2xl font-bold tracking-tight mb-0.5">
                {t("overview.wishlist.title")}
              </Title>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {t("overview.wishlist.description")}
              </p>
            </div>
          </div>

          {favoriteProduct && favoriteProduct.length > 3 && (
            <SeeMore to="/wishlist">
              {t("overview.wishlist.see_all", { count: favoriteProduct.length })}
            </SeeMore>
          )}
        </div>

        <div className="pt-4">
          {favoriteProduct.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteProduct.slice(0, 3).map((item: any) => (
                <div
                  key={item._id}
                  className="transition-transform hover:-translate-y-1"
                >
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              height="sm"
              title={t("overview.wishlist.empty_title")}
              description={t("overview.wishlist.empty_description")}
            />
          )}
        </div>
      </div>
    </div>
  );
}