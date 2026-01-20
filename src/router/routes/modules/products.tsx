import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

const ProductsManagement = lazy(
  () => import("@/pages/admin/products/index")
);

const products: AppRouteObject = {
  order: 3,
  path: "products",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "siderbar-labels.product-management",
    icon: (
      <Icon
        icon="solar:box-bold-duotone"
        className="ant-menu-item-icon"
        size="24"
      />
    ),
    key: "/products",
  },
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LineLoading />}>
          <ProductsManagement />
        </Suspense>
      ),
      meta: {
        label: "products.product",
        key: "/admin/products",
      },
    },
  ],
};

export default products;
