import { Suspense, lazy } from "react";
import { Outlet } from "react-router";

import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";

import type { AppRouteObject } from "#/router";
import BannerConfigPage from "@/pages/admin/management/banner-config";
import ManagerChatUser from "@/pages/admin/management/chat-user/manager-chat-user";
import DatabaseManagement from "@/pages/admin/management/database";

// Lazy load components
const ManagementUserPage = lazy(() => import("@/pages/admin/management/user"));
const CreatedNewUserPage = lazy(
  () => import("@/pages/admin/management/user/created-new-user")
);
const UserDetailPage = lazy(() => import("@/pages/admin/management/user/[id]"));
const AuthSessionManagement = lazy(
  () => import("@/pages/admin/management/auth-session")
);
const management: AppRouteObject = {
  order: 2,
  path: "management",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "siderbar-labels.management",
    icon: (
      <Icon
        icon="local:ic-management"
        className="ant-menu-item-icon"
        size="24"
      />
    ),
    key: "/management",
  },
  children: [
    {
      path: "user",
      element: (
        <Suspense fallback={<LineLoading />}>
          <ManagementUserPage />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.management-user",
        key: "/admin/management/user",
      },
    },
    {
      path: "auth-session",
      element: (
        <Suspense fallback={<LineLoading />}>
          <AuthSessionManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.auth-session",
        key: "/admin/management/auth-session",
      },
    },

    {
      path: "user/created-new-user",
      element: (
        <Suspense fallback={<LineLoading />}>
          <CreatedNewUserPage />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.created-new-user",
        key: "/admin/management/user/created-new-user",
        hideMenu: true,
      },
    },
    {
      path: "user/:userId",
      element: (
        <Suspense fallback={<LineLoading />}>
          <UserDetailPage />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.user-detail",
        key: "/admin/management/user/:userId",
        hideMenu: true,
      },
    },
    {
      path: "banner-config",
      element: (
        <Suspense fallback={<LineLoading />}>
          <BannerConfigPage />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.manager-banner",
        key: "/admin/management/banner-config",
      },
    },
    {
      path: "chat-user",
      element: (
        <Suspense fallback={<LineLoading />}>
          <ManagerChatUser />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.manager-chat-user",
        key: "/admin/management/chat-user",
      },
    },
    {
      path: "database",
      element: (
        <Suspense fallback={<LineLoading />}>
          <DatabaseManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.database",
        key: "/admin/management/database",
      },
    },
  ],
};

export default management;
