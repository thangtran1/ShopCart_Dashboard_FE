"use client";
import { headerData } from "@/constants/data";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { Tabs } from "antd";

const HeaderMenu = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const items = headerData?.map((item) => ({
    key: item.href,
    label: (
      <Link
        to={item.href}
        className={`text-base whitespace-nowrap !text-foreground hover:!text-primary transition-colors relative group px-1 ${
          isActive(item.href) && "!text-primary"
        }`}
      >
        {t(item.titleKey)}
      </Link>
    ),
  }));

  return (
    <div className="hidden md:flex flex-1 min-w-0  px-4 justify-center overflow-hidden">
      <Tabs
        activeKey={pathname}
        items={items}
        centered
        tabPosition="top" // gạch chân mặc định của Antd để dùng span của bạn
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} className="before:!border-none" />
        )}
        className="header-navigation-tabs w-full"
      />

      <style>{`
        .header-navigation-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        .header-navigation-tabs .ant-tabs-tab {
          padding: 8px 0 !important;
          margin: 0 8px !important;
        }
      `}</style>
    </div>
  );
};

export default HeaderMenu;
