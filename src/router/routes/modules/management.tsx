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
const CatalogManagement = lazy(
  () => import("@/pages/admin/management/catalog/index")
);
const CouponsManagement = lazy(
  () => import("@/pages/admin/management/coupons/index")
);
const CustomerSurveyManagement = lazy(
  () => import("@/pages/admin/management/customer-survey/index")
);
const NewsManagement = lazy(
  () => import("@/pages/admin/management/news/index")
);
const FeedbackManagement = lazy(
  () => import("@/pages/admin/management/feedback/index")
);
// nottification
const NotificationManagement = lazy(
  () => import("@/pages/admin/management/notifications/index")
);
const NewNotification = lazy(
  () => import("@/pages/admin/management/notifications/components/new-notification")
);
const NotificationDetail = lazy(
  () => import("@/pages/admin/management/notifications/components/[id]")
);
const OrdersManagement = lazy(
  () => import("@/pages/admin/management/orders/index")
);
const ProductsManagement = lazy(
  () => import("@/pages/admin/management/products/index")
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
    key: "/admin/management",
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
    {
      path: "catalog",
      element: (
        <Suspense fallback={<LineLoading />}>
          <CatalogManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.catalog-management",
        key: "/admin/management/catalog",
      },
    },
    {
      path: "coupons",
      element: (
        <Suspense fallback={<LineLoading />}>
          <CouponsManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.coupons-management",
        key: "/admin/management/coupons",
      },
    },
    {
      path: "customer-survey",
      element: (
        <Suspense fallback={<LineLoading />}>
          <CustomerSurveyManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.customer-survey",
        key: "/admin/management/customer-survey",
      },
    },
    {
      path: "news",
      element: (
        <Suspense fallback={<LineLoading />}>
          <NewsManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.news-manager",
        key: "/admin/management/news",
      },
    },
    {
      path: "feedback",
      element: (
        <Suspense fallback={<LineLoading />}>
          <FeedbackManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.feedback-title",
        key: "/admin/management/feedback",
      },
    },
    // notification
    {
      path: "notifications",
      element: (
        <Suspense fallback={<LineLoading />}>
          <NotificationManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.notification-title",
        key: "/admin/management/notifications",
      },
    },
    {
      path: "notifications/new-notification",
      element: (
        <Suspense fallback={<LineLoading />}>
          <NewNotification />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.new-notification",
        key: "/admin/management/notifications/new-notification",
        hideMenu: true,
      },
    },
    {
      path: "notifications/:id",
      element: (
        <Suspense fallback={<LineLoading />}>
          <NotificationDetail />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.notification-detail",
        key: "/admin/management/notifications/:id",
        hideMenu: true,
      },
    },
    {
      path: "orders-manager",
      element: (
        <Suspense fallback={<LineLoading />}>
          <OrdersManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.orders-manager",
        key: "/admin/management/orders-manager",
      },
    },
    {
      path: "products",
      element: (
        <Suspense fallback={<LineLoading />}>
          <ProductsManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.products-manager",
        key: "/admin/management/products",
      },
    },
  ],
};

export default management;
