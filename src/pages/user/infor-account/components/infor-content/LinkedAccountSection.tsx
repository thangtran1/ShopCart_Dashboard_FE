"use client";

import { useState, useMemo } from "react";
import { Button, Modal } from "antd";
import { DisconnectOutlined, LinkOutlined } from "@ant-design/icons";
import { Badge } from "@/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface LinkedAccount {
  key: string;
  name: string;
  icon: string;
  linked: boolean;
  description: string;
}

export default function LinkedAccountSection() {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<LinkedAccount | null>(null);

  const accounts = useMemo(() => {
    const configs = [
      {
        key: "google",
        name: "Google",
        icon: "https://www.svgrepo.com/show/475656/google-color.svg",
        description: t("linked_accounts.providers.google"),
      },
      {
        key: "github",
        name: "GitHub",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Github-desktop-logo-symbol.svg/1200px-Github-desktop-logo-symbol.svg.png",
        description: t("linked_accounts.providers.github"),
      },
      {
        key: "local",
        name: "Email/Local",
        icon: "https://cdn-icons-png.flaticon.com/512/561/561127.png",
        description: t("linked_accounts.providers.local"),
      },
    ];

    return configs.map((acc) => ({
      ...acc,
      linked: profile?.providers?.includes(acc.key) || false,
    }));
  }, [profile, t]);

  const handleUnlinkClick = (account: LinkedAccount) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleConfirmUnlink = () => {
    setIsModalOpen(false);
    toast.success(t("linked_accounts.actions.toast_success"));
    setSelectedAccount(null);
    // TODO: gọi API hủy liên kết ở đây
  };

  const handleLinkAccount = async (account: LinkedAccount) => {
    setLoadingKey(account.key);
    if (account.key === "google") {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }
    if (account.key === "github") {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
    }
  };

  return (
    <div className="rounded-2xl border border-border p-5 shadow-sm bg-card space-y-4">
      <h2 className="text-xl font-bold tracking-tight">{t("linked_accounts.title")}</h2>

      <div className="divide-y divide-border">
        {accounts.map((item) => (
          <div
            key={item.key}
            className="flex flex-col sm:flex-row sm:items-center justify-between transition gap-4 py-4 first:pt-0 last:pb-0"
          >
            {/* Left */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="border border-border rounded-xl p-2.5 bg-background shrink-0 shadow-sm">
                <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain" />
              </div>
              <div className="flex flex-col min-w-0 mr-2">
                <span className="font-bold text-foreground tracking-tight">{item.name}</span>
                <span className="text-xs text-muted-foreground line-clamp-1 italic">
                  {item.description}
                </span>
              </div>

              {item.linked ? (
                <Badge variant="success" className="shrink-0 text-[10px] uppercase font-black">
                  {t("linked_accounts.status.linked")}
                </Badge>
              ) : (
                <Badge variant="error" className="shrink-0 text-[10px] uppercase font-black">
                  {t("linked_accounts.status.not_linked")}
                </Badge>
              )}
            </div>

            {/* Right action */}
            <div className="shrink-0">
              {item.linked ? (
                <Button
                  type="text"
                  danger
                  size="middle"
                  icon={<DisconnectOutlined />}
                  onClick={() => handleUnlinkClick(item)}
                  className="font-bold hover:bg-destructive/10"
                >
                  {t("linked_accounts.actions.unlink")}
                </Button>
              ) : (
                <Button
                  type="primary"
                  ghost
                  size="middle"
                  icon={<LinkOutlined />}
                  onClick={() => handleLinkAccount(item)}
                  loading={loadingKey === item.key}
                  className="font-bold rounded-lg"
                >
                  {t("linked_accounts.actions.link")}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        centered
        closable={false}
        footer={null}
        width={350}
        className="modal-custom"
      >
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <DisconnectOutlined className="text-2xl text-destructive" />
          </div>
          <h3 className="text-lg font-bold">{t("linked_accounts.modal.title")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("linked_accounts.modal.description", { name: selectedAccount?.name })}
          </p>

          <div className="flex flex-col gap-2 pt-4">
             <Button
              type="primary"
              danger
              onClick={handleConfirmUnlink}
              className="w-full h-10 font-bold rounded-xl shadow-lg shadow-red-500/20"
            >
              {t("linked_accounts.actions.unlink")}
            </Button>
            <Button
              type="text"
              onClick={() => setIsModalOpen(false)}
              className="w-full h-10 font-bold text-muted-foreground"
            >
              {t("linked_accounts.actions.stay")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}