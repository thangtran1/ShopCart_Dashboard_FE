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
import { motion } from "framer-motion";

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
      <aside className="flex-shrink-0 sticky top-20">
        <div
          className={`border border-border rounded-2xl flex flex-col transition-all duration-300 shadow-sm overflow-hidden ${
            collapsed ? "w-14" : "w-14 md:w-64"
          }`}
        >
          <div className="hidden md:flex justify-end p-2">
            <Button
              type="text"
              size="small"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              className="hover:bg-muted text-foreground"
            />
          </div>

          <nav className="flex-1 flex flex-col p-1.5 gap-1">
            {sidebarItems.map((item) => {
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
                    relative group flex items-center h-11 rounded-xl transition-all
                    justify-center ${!collapsed ? "md:justify-start md:px-3" : "md:justify-center"}
                    ${isActive ? "text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className={`relative z-10 text-xl flex-none ${isActive ? "scale-110" : ""}`}>
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="hidden md:block ml-3 text-foreground text-sm truncate relative z-10">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border/50 text-center">
             <span className="text-[10px] text-primary font-black">V2.4</span>
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
     
   