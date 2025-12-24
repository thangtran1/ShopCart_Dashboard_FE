"use client"

import { Suspense, useState } from "react"
import { Tabs } from "antd"
import { getTabByKey, getTopTabs, TabKey } from "./components/config/tabs.config"
import { Header } from "./components/header"
import { Sidebar } from "./components/sidebar"

function PageContent() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview")

  const topTabItems = getTopTabs().map((tab) => ({
    key: tab.key,
    label: (
      <div className="flex items-center">
        {tab.icon}
        <span>{tab.label}</span>
      </div>
    ),
  }))

  const currentTab = getTabByKey(activeTab)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="border-t mt-4">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
          items={topTabItems}
        />
      </div>

      <div className="mx-auto py-6">
        <div className="flex gap-4">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1 transition-all duration-300">
            {currentTab?.component}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InforAccount() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  )
}
