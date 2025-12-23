import { TabKey } from "../config/tabs.config"

export interface SidebarProps {
  activeTab: TabKey
  setActiveTab: (tab: TabKey) => void
}
