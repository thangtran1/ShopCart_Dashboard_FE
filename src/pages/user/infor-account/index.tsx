"use client";

import { Suspense, useState, useMemo } from "react";
import { Tabs } from "antd";
import { getTabByKey, getTopTabs, TabKey } from "./components/config/tabs.config";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { useTranslation } from "react-i18next";

function PageContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const topTabItems = useMemo(() => {
    return getTopTabs(t).map((tab) => ({
      key: tab.key,
      label: (
        <div className="flex items-center gap-2">
          {tab.icon}
          <span>{tab.label}</span>
        </div>
      ),
    }));
  }, [t]);

  const currentTab = useMemo(() => getTabByKey(activeTab, t), [activeTab, t]);

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <div className="border-t mt-4 px-4">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
          items={topTabItems}
          className="user-account-tabs"
        />
      </div>

      <div className="mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 transition-all duration-300 min-h-[500px]">
            {currentTab?.component}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function InforAccount() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}