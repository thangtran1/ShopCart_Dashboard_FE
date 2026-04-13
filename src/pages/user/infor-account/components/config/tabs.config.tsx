import type { ReactNode } from "react"
import {
  HomeOutlined,
  SearchOutlined,
  MailOutlined,
  SafetyOutlined,
  LogoutOutlined,
  TagOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  ShoppingOutlined,
  LockOutlined,
} from "@ant-design/icons"
import { OverviewContent } from "../tab-content/overview-content"
import { DiscountContent } from "../tab-content/discount-content"
import { HistoryContent } from "../tab-content/history-content"
import { ActivityContent, SupportContent, TermsContent, WarrantyContent } from "../tab-content/other-content"
import InforContent from "../tab-content/infor-content"
import { LoginSettingsContent } from "../tab-content/login-settings-content"
import { TFunction } from "i18next"; 

export type TabKey =
  | "overview" | "member" | "discount" | "history" | "activity"
  | "address" | "infor" | "student" | "linked" | "warranty"
  | "preferences" | "store" | "policy" | "support" | "terms" | "logout" | "login-settings"

export interface TabConfig {
  key: TabKey
  label: string
  icon: ReactNode
  component: ReactNode
  showInTopTabs?: boolean
  showInSidebar?: boolean
  sidebarKey?: TabKey;
}

export const getTabsConfig = (t: TFunction): TabConfig[] => [
  {
    key: "overview",
    label: t("about.sidebar.tabs.overview"),
    icon: <HomeOutlined />,
    component: <OverviewContent />,
    showInSidebar: true,
  },
  {
    key: "discount",
    label: t("about.sidebar.tabs.discount"),
    icon: <TagOutlined />,
    component: <DiscountContent />,
    showInTopTabs: true,
  },
  {
    key: "history",
    label: t("about.sidebar.tabs.history"),
    icon: <ShoppingOutlined />,
    component: <HistoryContent />,
    showInTopTabs: true,
    showInSidebar: true,
  },
  {
    key: "activity",
    label: t("about.sidebar.tabs.activity"),
    icon: <HistoryOutlined />,
    component: <ActivityContent />,
    showInTopTabs: false,
    showInSidebar: true,
  },
  {
    key: "address",
    label: t("about.sidebar.tabs.address"),
    icon: <EnvironmentOutlined />,
    component: <InforContent />,
    showInTopTabs: true,
    sidebarKey: "infor"
  },
  {
    key: "infor",
    label: t("about.sidebar.tabs.infor"),
    icon: <InfoCircleOutlined />,
    component: <InforContent />,
    showInSidebar: true,
  },
  {
    key: "linked",
    label: t("about.sidebar.tabs.linked"),
    icon: <LinkOutlined />,
    component: <InforContent />,
    showInTopTabs: true,
    sidebarKey: "infor"
  },
  {
    key: "login-settings",
    label: t("login_settings.tab_title"),
    icon: <LockOutlined />,
    component: <LoginSettingsContent />,
    showInTopTabs: true,
    showInSidebar: true,
  },
  {
    key: "warranty",
    label: t("about.sidebar.tabs.warranty"),
    icon: <SearchOutlined />,
    component: <WarrantyContent />,
    showInSidebar: true,
  },
  {
    key: "support",
    label: t("about.sidebar.tabs.support"),
    icon: <MailOutlined />,
    component: <SupportContent />,
    showInSidebar: true,
  },
  {
    key: "terms",
    label: t("about.sidebar.tabs.terms"),
    icon: <SafetyOutlined />,
    component: <TermsContent />,
    showInSidebar: true,
  },
  {
    key: "logout",
    label: t("about.sidebar.tabs.logout"),
    icon: <LogoutOutlined />,
    component: <></>,
    showInSidebar: true,
  },
]

export const getTopTabs = (t: TFunction) => getTabsConfig(t).filter((tab) => tab.showInTopTabs)
export const getSidebarTabs = (t: TFunction) => getTabsConfig(t).filter((tab) => tab.showInSidebar)
export const getTabByKey = (key: TabKey, t: TFunction) => getTabsConfig(t).find((tab) => tab.key === key)