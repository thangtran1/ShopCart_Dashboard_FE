"use client"

import { Suspense, useState } from "react"
import { Tabs } from "antd"
import { getTabByKey, getTopTabs, TabKey } from "../dashboardProfile/config/tabs.config"
import { Header } from "../dashboardProfile/components/header"
import { Sidebar } from "../dashboardProfile/components/sidebar"

function PageContent() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview")

  const topTabItems = getTopTabs().map((tab) => ({
    key: tab.key,
    label: (
      <div className="flex items-center gap-2">
        {tab.icon}
        <span>{tab.label}</span>
      </div>
    ),
  }))

  const currentTab = getTabByKey(activeTab)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Tabs */}
      <div className="border-b">
        <div className="">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as TabKey)}
            items={topTabItems}
            className="top-tabs"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto py-6">
        <div className="flex gap-2">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Area - Dynamic rendering from config */}
          <div className="flex-1">{currentTab?.component}</div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardProfile() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  )
}
