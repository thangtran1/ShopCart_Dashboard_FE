import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

const NotificationManagement = lazy(
  () => import("@/pages/admin/notifications/index")
);
const NewNotification = lazy(
  () => import("@/pages/admin/notifications/components/new-notification")
);
const NotificationDetail = lazy(
  () => import("@/pages/admin/notifications/components/[id]")
);

const notifications: AppRouteObject = {
  order: 4,
  path: "notifications",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "siderbar-labels.notification",
    icon: (
      <Icon
        icon="solar:bell-bold-duotone"
        className="ant-menu-item-icon"
        size="24"
      />
    ),
    key: "/notifications",
  },
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LineLoading />}>
          <NotificationManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.notification-title",
        key: "/admin/notifications",
      },
    },
    {
      path: "new-notification",
      element: (
        <Suspense fallback={<LineLoading />}>
          <NewNotification />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.new-notification",
        key: "/admin/notifications/new-notification",
        hideMenu: true,
      },
    },
    {
      path: ":id",
      element: (
        <Suspense fallback={<LineLoading />}>
          <NotificationDetail />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.notification-detail",
        key: "/admin/notifications/:id",
        hideMenu: true,
      },
    },
  ],
};

export default notifications;
