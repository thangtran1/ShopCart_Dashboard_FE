import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

const Page403 = lazy(() => import("@/pages/admin/sys/error/Page403"));
const Page404 = lazy(() => import("@/pages/admin/sys/error/Page404"));
const Page500 = lazy(() => import("@/pages/admin/sys/error/Page500"));

const errors: AppRouteObject[] = [
  {
    path: "error",
    order: 6,
    element: (
      <Suspense fallback={<LineLoading />}>
        <Outlet />
      </Suspense>
    ),
    meta: {
      label: "siderbar-labels.error.index",
      icon: (
        <Icon icon="bxs:error-alt" className="ant-menu-item-icon" size="24" />
      ),
      key: "/error",
    },
    children: [
      {
        path: "403",
        element: <Page403 />,
        meta: {
          label: "siderbar-labels.error.403",
          key: "/admin/error/403",
        },
      },
      {
        path: "404",
        element: <Page404 />,
        meta: {
          label: "siderbar-labels.error.404",
          key: "/admin/error/404",
        },
      },
      {
        path: "500",
        element: <Page500 />,
        meta: {
          label: "siderbar-labels.error.500",
          key: "/admin/error/500",
        },
      },
    ],
  },
];

export default errors;
