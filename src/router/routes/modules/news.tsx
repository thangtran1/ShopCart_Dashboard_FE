import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

const NewsManagement = lazy(
  () => import("@/pages/admin/news/index")
);

const news: AppRouteObject = {
  order: 3,
  path: "news",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "Quản lý tin tức",
    icon: (
      <Icon
        icon="solar:ticket-bold-duotone"
        className="ant-menu-item-icon"
        size={24}
      />
    ),
    key: "/news",
  },
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LineLoading />}>
          <NewsManagement />
        </Suspense>
      ),
      meta: {
        label: "Tin tức",
        key: "/admin/news",
      },
    },
  ],
};

export default news;
