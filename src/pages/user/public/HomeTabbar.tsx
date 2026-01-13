"use client";

import { Tabs } from "antd";
import SeeMore from "@/ui/see-more";
import { useTranslation } from "react-i18next";

interface Props {
  productType: any[];
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ productType, selectedTab, onTabSelect }: Props) => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between flex-wrap gap-5">
      <div className="flex-1 min-w-[200px]">
        <Tabs
          activeKey={selectedTab}
          onChange={(key) => onTabSelect(key)}
          items={productType.map((item) => ({
            key: item.value,
            label: <span className="font-medium text-sm">{item.title}</span>,
          }))}
          className="custom-tabs"
        />
      </div>

      <SeeMore to="/shop">{t("common.seeMore")}</SeeMore>

    </div>

  );
};

export default HomeTabbar;
