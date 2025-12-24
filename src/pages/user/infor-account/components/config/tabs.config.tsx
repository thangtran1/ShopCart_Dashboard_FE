import type { ReactNode } from "react"
import {
  HomeOutlined,
  SearchOutlined,
  HeartOutlined,
  UserOutlined,
  SettingOutlined,
  ShopOutlined,
  FileTextOutlined,
  MailOutlined,
  SafetyOutlined,
  LogoutOutlined,
  TagOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons"
import { OverviewContent } from "../tab-content/overview-content"
import { DiscountContent } from "../tab-content/discount-content"
import { HistoryContent } from "../tab-content/history-content"
import { PolicyContent, StoreContent, SupportContent, TermsContent, WarrantyContent } from "../tab-content/other-content"
import InforContent from "../tab-content/infor-content"

export type TabKey =
  | "overview"
  | "member"
  | "discount"
  | "history"
  | "address"
  | "infor"
  | "student"
  | "linked"
  | "warranty"
  | "preferences"
  | "store"
  | "policy"
  | "support"
  | "terms"
  | "logout"

export interface TabConfig {
  key: TabKey
  label: string
  icon: ReactNode
  component: ReactNode
  showInTopTabs?: boolean
  showInSidebar?: boolean
  sidebarKey?: TabKey;
}

export const tabsConfig: TabConfig[] = [
  {
    key: "overview",
    label: "Tổng quan",
    icon: <HomeOutlined />,
    component: <OverviewContent />,
    showInSidebar: true,
  },
  {
    key: "discount",
    label: "Mã giảm giá",
    icon: <TagOutlined />,
    component: <DiscountContent />,
    showInTopTabs: true,
  },
  {
    key: "history",
    label: "Lịch sử mua hàng",
    icon: <HistoryOutlined />,
    component: <HistoryContent />,
    showInTopTabs: true,
    showInSidebar: true,
  },
  {
    key: "address",
    label: "Số địa chỉ",
    icon: <EnvironmentOutlined />,
    component: <InforContent />,
    showInTopTabs: true,
    sidebarKey: "infor"
  },
  {
    key: "infor",
    label: "Thông tin tài khoản",
    icon: <InfoCircleOutlined />,
    component: <InforContent />,
    showInSidebar: true,
  },
  {
    key: "linked",
    label: "Liên kết tài khoản",
    icon: <LinkOutlined />,
    component: <InforContent />,
    showInTopTabs: true,
    sidebarKey: "infor"
  },
  {
    key: "warranty",
    label: "Tra cứu bảo hành",
    icon: <SearchOutlined />,
    component: <WarrantyContent />,
    showInSidebar: true,
  },
  {
    key: "store",
    label: "Tìm kiếm cửa hàng",
    icon: <ShopOutlined />,
    component: <StoreContent />,
    showInSidebar: true,
  },
  {
    key: "policy",
    label: "Chính sách bảo hành",
    icon: <FileTextOutlined />,
    component: <PolicyContent />,
    showInSidebar: true,
  },
  {
    key: "support",
    label: "Góp ý - Phản hồi - Hỗ trợ",
    icon: <MailOutlined />,
    component: <SupportContent />,
    showInSidebar: true,
  },
  {
    key: "terms",
    label: "Điều khoản sử dụng",
    icon: <SafetyOutlined />,
    component: <TermsContent />,
    showInSidebar: true,
  },
  {
    key: "logout",
    label: "Đăng xuất",
    icon: <LogoutOutlined />,
    component: <div>Đăng xuất...</div>,
    showInSidebar: true,
  },
]

export const getTopTabs = () => tabsConfig.filter((tab) => tab.showInTopTabs)
export const getSidebarTabs = () => tabsConfig.filter((tab) => tab.showInSidebar)
export const getTabByKey = (key: TabKey) => tabsConfig.find((tab) => tab.key === key)
