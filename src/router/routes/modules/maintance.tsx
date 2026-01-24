import { Suspense, lazy } from "react";
import { Outlet } from "react-router";

import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";

import type { AppRouteObject } from "#/router";

const MaintenceSystemPage = lazy(
  () => import("@/pages/admin/maintenance/index")
);
const CreatedNewMaintenance = lazy(
  () => import("@/pages/admin/maintenance/created-new-maintenance")
);

const maintenance: AppRouteObject = {
  order: 2,
  path: "maintenance",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "siderbar-labels.maintenance",
    icon: (
      <Icon
      icon="solar:shield-bold-duotone"
      className="ant-menu-item-icon"
      size={24}
    />
    ),
    key: "/admin/maintenance",
  },
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LineLoading />}>
          <MaintenceSystemPage />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.maintenance",
        key: "/admin/maintenance",
      },
    },
    {
      path: "created-new-maintenance",
      element: (
        <Suspense fallback={<LineLoading />}>
          <CreatedNewMaintenance />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.created-new-maintenance",
        key: "/admin/maintenance/created-new-maintenance",
        hideMenu: true,
      },
    },
  ],
};

export default maintenance;
