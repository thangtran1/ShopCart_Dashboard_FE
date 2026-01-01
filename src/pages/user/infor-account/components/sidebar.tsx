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
      <aside className="flex-shrink-0">
        <div
          className={`h-full transition-all duration-300 w-12 ${collapsed ? "md:w-14" : "md:w-64"}`}
        >
          {/* TOGGLE – DESKTOP */}
          <div className="hidden md:flex justify-end px-2 py-2">
            <Button
              type="text"
              size="small"
              onClick={() => setCollapsed(!collapsed)}
              icon={
                collapsed ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )
              }
            />
          </div>

          {/* Sidebar Items */}
          {sidebarItems.map((item, index) => {
            const isActive = sidebarActiveKey === item.key;
            const isCollapsed = collapsed;

            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.key === "logout") {
                    setLogoutModalOpen(true); // mở modal
                    return; // không set tab active
                  }

                  const targetTab =
                    tabsConfig.find((t) => t.sidebarKey === item.key) ?? item;
                  setActiveTab(targetTab.key as TabKey);
                }}
                className={`
        group w-full flex items-center cursor-pointer
        ${isCollapsed ? "justify-center px-2" : "px-4"}
        gap-3 py-3 relative
        transition-colors border-r
        hover:bg-primary/90 hover:text-foreground
        ${isActive ? "bg-primary/80 text-foreground" : "text-foreground"}
        ${index > 0 ? "border-t border-border" : ""}
      `}
              >
                {/* ICON */}
                <span className="text-lg">{item.icon}</span>

                {/* LABEL */}
                {!isCollapsed && (
                  <span className="hidden md:inline text-sm truncate">
                    {item.label}
                  </span>
                )}

                {/* TOOLTIP khi collapsed */}
                {isCollapsed && (
                  <span
                    className="
            absolute left-full ml-2 px-2 py-1
            text-foreground text-xs rounded
            opacity-0 group-hover:opacity-100
            transition-opacity
            whitespace-nowrap pointer-events-none
          "
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
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
