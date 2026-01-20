import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

const CatalogManagement = lazy(
  () => import("@/pages/admin/catalog/index")
);

const catalog: AppRouteObject = {
  order: 3,
  path: "catalog",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "siderbar-labels.catalog",
    icon: (
      <Icon
        icon="solar:tag-bold-duotone"
        className="ant-menu-item-icon"
        size={24}
      />
    ),
    key: "/catalog",
  },
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LineLoading />}>
          <CatalogManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.catalog-management",
        key: "/admin/catalog",
      },
    },
  ],
};

export default catalog;
