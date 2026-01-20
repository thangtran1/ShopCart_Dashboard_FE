import { Suspense, lazy } from "react";
import { Navigate, Outlet } from "react-router";

import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";

import type { AppRouteObject } from "#/router";
import ProfilePage from "@/pages/admin/dashboard/profile";

const HomePage = lazy(() => import("@/pages/admin/dashboard/workbench"));
const Analysis = lazy(() => import("@/pages/admin/dashboard/analysis"));

const dashboard: AppRouteObject = {
  order: 1,
  path: "dashboard",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "siderbar-labels.dashboard",
    icon: (
      <Icon icon="local:ic-analysis" className="ant-menu-item-icon" size="24" />
    ),
    key: "/dashboard",
  },
  children: [
    {
      index: true,
      element: <Navigate to="workbench" replace />,
    },
    {
      path: "workbench",
      element: <HomePage />,
      meta: {
        label: "siderbar-labels.workbench",
        key: "/admin/dashboard/workbench",
      },
    },
    {
      path: "analysis",
      element: <Analysis />,
      meta: {
        label: "siderbar-labels.analysis",
        key: "/admin/dashboard/analysis",
      },
    },
    {
      path: "profile",
      element: <ProfilePage />,
      meta: {
        label: "siderbar-labels.profile",
        key: "/admin/dashboard/profile",
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
