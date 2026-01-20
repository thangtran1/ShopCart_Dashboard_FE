import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

// Lazy load components
const MultiLanguage = lazy(
  () => import("@/pages/admin/components/multi-language")
);
const Chart = lazy(() => import("@/pages/admin/components/chart"));

const components: AppRouteObject = {
  order: 3,
  path: "components",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "siderbar-labels.components",
    icon: (
      <Icon
        icon="solar:widget-5-bold-duotone"
        className="ant-menu-item-icon"
        size="24"
      />
    ),
    key: "/components",
  },
  children: [
    {
      path: "i18n",
      element: (
        <Suspense fallback={<LineLoading />}>
          <MultiLanguage />
        </Suspense>
      ),
      meta: { label: "siderbar-labels.i18n", key: "/admin/components/i18n" },
    },
    {
      path: "chart",
      element: (
        <Suspense fallback={<LineLoading />}>
          <Chart />
        </Suspense>
      ),
      meta: { label: "siderbar-labels.chart", key: "/admin/components/chart" },
    },
  ],
};

export default components;
