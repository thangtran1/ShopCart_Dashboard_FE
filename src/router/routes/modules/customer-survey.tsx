import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

const CustomerSurveyManagement = lazy(
  () => import("@/pages/admin/customer-survey/index")
);

const customerSurvey: AppRouteObject = {
  order: 3,
  path: "customer-survey",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "Quản lý khảo sát khách hàng",
    icon: (
      <Icon
        icon="solar:ticket-bold-duotone"
        className="ant-menu-item-icon"
        size={24}
      />
    ),
    key: "/customer-survey",
  },
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LineLoading />}>
          <CustomerSurveyManagement />
        </Suspense>
      ),
      meta: {
        label: "Quản lý Câu hỏi",
        key: "/admin/customer-survey",
      },
    }
  ],
};

export default customerSurvey;
