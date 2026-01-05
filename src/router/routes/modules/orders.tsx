import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

const OrdersManagement = lazy(
  () => import("@/pages/admin/orders/index")
);

const coupons: AppRouteObject = {
  order: 4,
  path: "orders-manager",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "Quản lý đơn hàng",
    icon: (
      <Icon
        icon="solar:clipboard-bold-duotone"
        className="ant-menu-item-icon"
        size={24}
      />
    ),
    key: "/orders-manager",
  },
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LineLoading />}>
          <OrdersManagement />
        </Suspense>
      ),
      meta: {
        label: "Đơn hàng",
        key: "/orders-manager",
      },
    },
  ],
};

export default coupons;
