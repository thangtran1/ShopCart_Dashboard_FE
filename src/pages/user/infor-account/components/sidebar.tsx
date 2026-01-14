"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Modal } from "antd";
import { getSidebarTabs, getTabsConfig, TabKey } from "./config/tabs.config"; // Import thêm getTabsConfig
import { toast } from "sonner";
import userApi from "@/api/services/userApi";
import { useUserActions } from "@/store/userStore";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clearUserInfoAndToken } = useUserActions();
  
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = useMemo(() => getSidebarTabs(t), [t]);
  const fullTabsConfig = useMemo(() => getTabsConfig(t), [t]);

  const handleLogout = async () => {
    try {
      const res = await userApi.logout();
      if (res.data?.success) {
        clearUserInfoAndToken();
        toast.success(t("auth.login.logoutSuccess"));
        navigate("/login", { replace: true });
      } else {
        toast.error(res.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Tìm sidebarKey dựa trên t đã được cập nhật
  const sidebarActiveKey = useMemo(() => {
    return fullTabsConfig.find((tab) => tab.key === activeTab)?.sidebarKey ?? activeTab;
  }, [activeTab, fullTabsConfig]);

  return (
    <>
      <aside className="flex-shrink-0 border-x border-border bg-card">
        <div
          className={`h-full flex flex-col transition-all duration-300 ${
            collapsed ? "md:w-14" : "md:w-64"
          }`}
        >
          <div className="hidden md:flex justify-end px-2 py-2">
            <Button
              type="text"
              size="small"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              className="hover:bg-muted"
            />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {sidebarItems.map((item, index) => {
              const isActive = sidebarActiveKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    if (item.key === "logout") {
                      setLogoutModalOpen(true);
                      return;
                    }
                    const targetTab = fullTabsConfig.find((tab) => tab.sidebarKey === item.key) ?? item;
                    setActiveTab(targetTab.key as TabKey);
                  }}
                  className={`
                    group w-full flex items-center cursor-pointer
                    ${collapsed ? "justify-center px-2" : "px-4"}
                    gap-3 py-3 relative transition-all
                    ${isActive 
                      ? "bg-primary text-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                    ${index > 0 ? "border-t border-border/50" : ""}
                  `}
                >
                  <span className={`text-lg ${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="hidden md:inline text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <div className="absolute right-0 w-1 h-6 bg-primary-foreground rounded-l-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto border-t border-border bg-muted/30">
            <div className={`py-4 text-center font-bold text-primary/60 text-xs
               ${collapsed ? "block" : "block md:hidden"}`}>
              V2.4
            </div>

            {!collapsed && (
              <div className="hidden md:block p-4 space-y-2 animate-in fade-in duration-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {t("about.sidebar.server_status")}
                  </span>
                </div>
                <p className="text-primary font-bold text-sm tracking-tight">
                  © SHOP_CART TVT
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
      <Modal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        centered
        closable={false}
        footer={null}
        width={300}
        className="!text-center"
      >
        <h3 className="text-lg font-semibold mb-1"> {t("about.sidebar.logout_modal.title")}</h3>
        <p className="text-sm text-muted-foreground mb-3">
        {t("about.sidebar.logout_modal.confirm")}
        </p>

        <div className="flex justify-center gap-2">
          <Button
            type="default"
            onClick={() => {
              setLogoutModalOpen(false);
              handleLogout();
            }}
            className="flex-1 !rounded-lg"

          >
            {t("about.sidebar.logout_modal.btn_logout")}
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              setLogoutModalOpen(false);
            }}
            className="flex-1 !rounded-lg"

          >
              {t("about.sidebar.logout_modal.btn_stay")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
     
   