"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Modal } from "antd";
import { getSidebarTabs, TabKey, tabsConfig } from "./config/tabs.config";
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
  const sidebarItems = getSidebarTabs();
  const { clearUserInfoAndToken } = useUserActions();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()
  const { t } = useTranslation();
  const handleLogout = async () => {
    try {
      const res = await userApi.logout();
      if (res.data?.success) {
        clearUserInfoAndToken();
        toast.success(t("auth.login.logoutSuccess"));
        navigate("/login", { replace: true });
      } else toast.error(res.data?.message);
    } catch (error) {
      console.log(error);
    }
  };
  // 🔹 Tính key của tab Sidebar đang active
  const sidebarActiveKey =
    tabsConfig.find((t) => t.key === activeTab)?.sidebarKey ?? activeTab;

  return (
    <>
      <aside className="flex-shrink-0 border-x border-border">
        <div
          className={`h-full flex flex-col transition-all duration-300 ${collapsed ? "md:w-14" : "md:w-64"
            }`}
        >
          <div className="hidden md:flex justify-end px-2 pb-2">
            <Button
              type="text"
              size="small"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            />
          </div>

          <div className="flex-shrink-0">
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
                    const targetTab = tabsConfig.find((t) => t.sidebarKey === item.key) ?? item;
                    setActiveTab(targetTab.key as TabKey);
                  }}
                  className={`
              group w-full flex items-center cursor-pointer
              ${collapsed ? "justify-center px-2" : "px-4"}
              gap-3 py-3 relative transition-colors
              ${isActive ? "bg-primary/80 text-foreground" : "text-foreground"}
              ${index > 0 ? "border-t border-border" : ""}
            `}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span className="hidden md:inline text-sm truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>

          <div className="mt-auto border-t border-primary/20">
            <div className={`py-4 text-center font-bold text-primary animate-in fade-in 
               ${collapsed ? "block" : "block md:hidden"}`}>
              V2.4
            </div>

            {!collapsed && (
              <div className="hidden md:block p-4 space-y-1 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">Server: Online</span>
                </div>
                <p className="text-primary font-extrabold text-lg md:text-base">
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
        <h3 className="text-lg font-semibold mb-1">Đăng xuất</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Bạn có chắc chắn muốn đăng xuất?
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
            Đăng xuất
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              setLogoutModalOpen(false);
            }}
            className="flex-1 !rounded-lg"

          >
            Ở lại trang
          </Button>
        </div>
      </Modal>
    </>
  );
}
