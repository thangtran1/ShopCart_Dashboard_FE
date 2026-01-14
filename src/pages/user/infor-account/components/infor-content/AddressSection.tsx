"use client";

import { useState } from "react";
import { Address } from "@/api/services/addressesApi";
import {
  PlusOutlined,
  HomeOutlined,
  BankOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Skeleton } from "antd";
import { Badge } from "@/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { useTranslation } from "react-i18next";

interface AddressSectionProps {
  addresses: Address[];
  isFetching: boolean;
  onAdd: () => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function AddressSection({
  addresses,
  isFetching,
  onAdd,
  onEdit,
  onDelete,
}: AddressSectionProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayAddresses = isExpanded ? addresses : addresses.slice(0, 4);
  const hasMoreThanFour = addresses.length > 4;

  if (isFetching) {
    return (
      <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border bg-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{t("addresses.title")}</h2>
          <p className="text-muted-foreground text-sm">
            {t("addresses.subtitle")}
          </p>
        </div>

        <Button
          type="primary"
          danger
          shape="round"
          size="middle"
          icon={<PlusOutlined />}
          className="w-full sm:w-auto shadow-md shadow-red-100 hover:scale-105 transition-transform border-none flex items-center justify-center font-bold"
          onClick={onAdd}
        >
          {t("addresses.add_btn")}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          height="md"
          title={t("addresses.empty.title")}
          description={t("addresses.empty.description")}
          actionLabel={t("addresses.empty.action")}
          onAction={onAdd}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayAddresses.map((item) => (
              <div
                key={item._id}
                className="group relative p-4 border border-border rounded-2xl hover:border-primary/30 transition-all duration-300 bg-background/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {item.is_default && (
                      <Badge variant={"info"}>{t("addresses.types.default")}</Badge>
                    )}
                    {item.type === 1 ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-[11px] font-bold border border-orange-100 dark:border-orange-900/50">
                        <HomeOutlined className="text-[10px]" /> {t("addresses.types.home")}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold border border-indigo-100 dark:border-indigo-900/50">
                        <BankOutlined className="text-[10px]" /> {t("addresses.types.office")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground transition-colors uppercase tracking-tight line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-3 text-muted-foreground text-sm font-semibold">
                    <span className="text-foreground shrink-0">
                      {item.member_id.name}
                    </span>
                    <span className="w-1.5 h-1.5 bg-border rounded-full" />
                    <span className="flex items-center gap-1 font-mono">
                      {item.member_id.phone}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-6 line-clamp-2 min-h-[48px]">
                    {item.full_address}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex justify-end items-center gap-3">
                  <Popconfirm
                    title={t("addresses.actions.confirm_delete")}
                    description={t("addresses.actions.confirm_desc")}
                    onConfirm={() => onDelete(item._id)}
                    okText={t("addresses.actions.ok_delete")}
                    cancelText={t("addresses.actions.cancel")}
                    okButtonProps={{ danger: true, className: "rounded-lg" }}
                  >
                    <Button
                      type="text"
                      size="small"
                      className="!text-destructive hover:!bg-destructive/10 transition-colors font-medium"
                    >
                      {t("addresses.actions.delete")}
                    </Button>
                  </Popconfirm>
                  <div className="w-[1px] h-4 bg-border" />
                  <Button
                    type="text"
                    size="small"
                    className="text-primary hover:text-primary/80 font-bold"
                    onClick={() => onEdit(item)}
                  >
                    {t("addresses.actions.update")}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {hasMoreThanFour && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-3 px-8 py-2.5 cursor-pointer border border-border hover:border-primary/40 rounded-full transition-all duration-300 bg-background"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                  {isExpanded
                    ? t("addresses.view_less")
                    : t("addresses.view_more", { count: addresses.length - 4 })}
                </span>

                <div
                  className={`flex items-center justify-center transition-all duration-500 group-hover:translate-y-0.5 ${isExpanded ? "rotate-180" : ""}`}
                >
                  <DownOutlined className="text-[10px] text-muted-foreground group-hover:text-primary" />
                </div>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}