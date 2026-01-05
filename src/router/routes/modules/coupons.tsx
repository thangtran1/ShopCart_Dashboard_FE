import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

const CouponsManagement = lazy(
  () => import("@/pages/admin/coupons/index")
);

const coupons: AppRouteObject = {
  order: 3,
  path: "coupons",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "Quản lý giảm giá",
    icon: (
      <Icon
        icon="solar:ticket-bold-duotone"
        className="ant-menu-item-icon"
        size={24}
      />
    ),
    key: "/coupons",
  },
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LineLoading />}>
          <CouponsManagement />
        </Suspense>
      ),
      meta: {
        label: "Mã giảm giá",
        key: "/coupons",
      },
    },
  ],
};

export default coupons;
