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
    <div className="bg-background min-h-screen flex flex-col">
      <Header />

      <div className="border-t mt-4 px-2 md:px-4">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
          items={topTabItems}
          className="user-account-tabs"
        />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto py-4 px-2 md:px-4">
        <div className="flex flex-row items-start gap-2 md:gap-2">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 min-w-0 transition-all duration-300">
            <div>
              {currentTab?.component}
            </div>
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