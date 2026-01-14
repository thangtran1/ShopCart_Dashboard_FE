"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import Contact from "@/pages/user/contact";
import TermsPage from "@/pages/user/public/terms";
import ActivityLogs from "@/pages/admin/management/user/[id]/tabs/activity-log";
import {
  ActivityLog,
  detailActivityLogForUser,
} from "@/api/services/activity-logApi";
import { useUserInfo } from "@/store/userStore";
import { useOrder } from "@/hooks/useOrder";
import dayjs from "dayjs";
import { Search, Clock, Calendar, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/ui/badge";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { useTranslation } from "react-i18next";

export function WarrantyContent() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, loading } = useOrder("delivered");

  const dateFormat = i18n.language === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY";

  const allWarrantyItems = useMemo(() => {
    if (!orders) return [];
    const items: any[] = [];
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        items.push({
          ...item,
          orderNumber: order.orderNumber,
          deliveredAt: order.updatedAt,
        });
      });
    });
    return items;
  }, [orders]);

  const filteredItems = useMemo(() => {
    const now = dayjs();
    let result = allWarrantyItems;

    if (activeTab === "active") {
      result = result.filter(item => item.warrantyExpireDate && dayjs(item.warrantyExpireDate).isAfter(now));
    } else if (activeTab === "expired") {
      result = result.filter(item => !item.warrantyExpireDate || dayjs(item.warrantyExpireDate).isBefore(now));
    }

    if (searchQuery) {
      result = result.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return result;
  }, [allWarrantyItems, activeTab, searchQuery]);

  const handleClick = () => {
    toast.info(t("common.updating"));
  };

  return (
    <div className="text-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none opacity-20 bg-emerald-500/20" />

      <div className="relative z-10 space-y-6 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
              <Zap size={14} fill="currentColor" />
              {t("warranty.badge")}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {t("warranty.title")} <span className="text-emerald-500">{t("warranty.title_highlight")}</span>
            </h1>
            <p className="text-muted-foreground text-sm">{t("warranty.subtitle")}</p>
          </div>

          <div className="w-full md:w-80">
            <Input
              size="large"
              prefix={<Search size={18} className="text-slate-500 mr-2" />}
              placeholder={t("warranty.search_placeholder")}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex p-1 backdrop-blur-md rounded-2xl border border-border w-fit bg-muted/30">
          {[
            { key: "all", label: t("warranty.tabs.all") },
            { key: "active", label: t("warranty.tabs.active") },
            { key: "expired", label: t("warranty.tabs.expired") },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex cursor-pointer items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key
                ? "shadow-lg bg-background text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 relative z-10"
          >
            {filteredItems.map((item, index) => {
              const now = dayjs();
              const expireDate = item.warrantyExpireDate ? dayjs(item.warrantyExpireDate) : null;
              const isExpired = !expireDate || now.isAfter(expireDate);
              const daysLeft = expireDate ? expireDate.diff(now, 'day') : 0;

              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="border border-border rounded-3xl p-4 flex flex-col justify-between group transition-all duration-300 bg-card hover:shadow-xl hover:shadow-emerald-500/5"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isExpired ? 'text-muted-foreground border-border bg-muted/50' : 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                        }`}>
                        {isExpired ? t("warranty.card.expired") : t("warranty.card.active")}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] text-muted-foreground font-mono">ID: {item.orderNumber?.slice(-8)}</p>
                      <h3 className="font-bold text-base line-clamp-2 group-hover:text-emerald-500 transition-colors h-12">
                        {item.name}
                      </h3>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-dashed">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Calendar size={14} /> {t("warranty.card.purchase_date")}</span>
                        <span className="text-foreground font-medium">{dayjs(item.deliveredAt).format(dateFormat)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Clock size={14} /> {t("warranty.card.expiry_date")}</span>
                        <span className={`font-bold ${isExpired ? 'text-destructive' : 'text-emerald-500'}`}>
                          {expireDate ? expireDate.format(dateFormat) : t("warranty.card.not_updated")}
                        </span>
                      </div>

                      {!isExpired && (
                        <div className="mt-2">
                           <Badge variant={'success'} className="w-full justify-center py-1">
                             {t("warranty.card.days_left", { count: daysLeft })}
                           </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button block size="middle" type={isExpired ? "default" : "primary"} className={!isExpired ? "bg-emerald-500 hover:bg-emerald-600 border-none" : ""} onClick={handleClick}>
                      {isExpired ? t("warranty.card.btn_contact") : t("warranty.card.btn_request")}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      {filteredItems.length === 0 && !loading && (
        <EmptyState
          height="sm"
          title={t("warranty.empty.title")}
          description={t("warranty.empty.description")}
          actionLabel={t("warranty.empty.action")}
          onAction={() => {
            setActiveTab("all");
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
}

export function SupportContent() {
  return <Contact />;
}

export function TermsContent() {
  return <TermsPage />;
}

export function ActivityContent() {
  const { t } = useTranslation();
  const user = useUserInfo();
  const userId = user?.id;
  if (!userId) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all hover:scale-105 shrink-0">
            <HistoryOutlined className="text-2xl text-blue-600" />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-0.5">
              {t("activity.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("activity.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-2 sm:p-4">
        <ActivityLogs
          fetchLogsApi={() =>
            detailActivityLogForUser(userId) as Promise<{
              data: { success: boolean; message: string; data: ActivityLog[] };
            }>
          }
        />
      </div>
    </div>
  );
}