"use client";

import { useState } from "react";
import { Tabs } from "antd";
import OrdersComponent from "@/components/user/OrdersComponent";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/ui/table";
import Title from "@/ui/title";
import { useUserToken } from "@/store/userStore";
import { useOrder } from "@/hooks/useOrder";
import { ShoppingBag } from "lucide-react";
import { OrderStatus } from "@/types/enum";
import PageLoading from "@/components/common/loading/PageLoading";
import { EmptyState } from "@/components/common/EmptyState";
import { useRouter } from "@/router/hooks";
import { useTranslation } from "react-i18next";

const OrdersPage = ({ hideTitle }: { hideTitle?: boolean }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("all");
  const userToken = useUserToken();

  const { orders, loading } = useOrder(currentTab);

  const STATUS_TABS = [
    { label: t("orders.status_all"), key: "all" },
    { label: t("orders.status_pending"), key: OrderStatus.PENDING },
    { label: t("orders.status_processing"), key: OrderStatus.PROCESSING },
    { label: t("orders.status_shipped"), key: OrderStatus.SHIPPED },
    { label: t("orders.status_delivered"), key: OrderStatus.DELIVERED },
    { label: t("orders.status_cancelled"), key: OrderStatus.CANCELLED },
  ];

  return (
    <div className="space-y-4">
      {!hideTitle && (
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <Title className="text-2xl font-bold tracking-tight">
              {t("orders.title")}
            </Title>
            <p className="text-sm text-muted-foreground italic">
              {t("orders.sub_title")}
            </p>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-40">
        <Tabs
          activeKey={currentTab}
          onChange={(key) => setCurrentTab(key)}
          items={STATUS_TABS.map((tab) => ({
            label: (
              <span className="font-semibold uppercase text-[12px]">
                {tab.label}
              </span>
            ),
            key: tab.key,
          }))}
        />
      </div>

      <div className="w-full overflow-hidden -mt-4">
        <div className="p-0">
          {!userToken?.accessToken ? (
            <EmptyState
              title={t("orders.auth_required")}
              height="sm"
              description={t("orders.auth_required_desc")}
              actionLabel={t("orders.auth_login_btn")}
              onAction={() => router.push("/login")}
            />
          ) : loading ? (
            <div className="flex h-[450px] flex-col items-center justify-center gap-4">
              <PageLoading text={t("orders.loading_text")} />
            </div>
          ) : orders?.length > 0 ? (
            <ScrollArea className="w-full h-[400px]">
              <div className="min-w-[1000px]">
                <Table className="relative w-full border-collapse">
                  <TableHeader className="sticky top-0 z-30 bg-secondary/95 backdrop-blur-md shadow-sm">
                    <TableRow className="hover:bg-transparent border-b">
                      <TableHead className="font-bold h-12">{t("orders.table_id")}</TableHead>
                      <TableHead className="font-bold">{t("orders.table_date")}</TableHead>
                      <TableHead className="font-bold">{t("orders.table_customer")}</TableHead>
                      <TableHead className="sm:table-cell font-bold">{t("orders.table_email")}</TableHead>
                      <TableHead className="sm:table-cell font-bold">{t("orders.table_subtotal")}</TableHead>
                      <TableHead className="lg:table-cell text-center font-bold">{t("orders.table_discount")}</TableHead>
                      <TableHead className="font-bold">{t("orders.table_total")}</TableHead>
                      <TableHead className="text-center font-bold">{t("orders.table_status")}</TableHead>
                      <TableHead className="text-center font-bold">{t("orders.table_action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <OrdersComponent orders={orders} />
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <EmptyState
              title={t("orders.empty_title")}
              height="md"
              description={`${t("orders.empty_not_found")} "${STATUS_TABS.find((t) => t.key === currentTab)?.label
                }"`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;