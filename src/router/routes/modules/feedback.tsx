import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { AppRouteObject } from "#/router";

const FeedbackManagement = lazy(
  () => import("@/pages/admin/feedback/index")
);

const feedback: AppRouteObject = {
  order: 4,
  path: "feedback",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "siderbar-labels.feedback",
    icon: (
<Icon
  icon="solar:lightbulb-bold-duotone"
  className="ant-menu-item-icon"
  size={24}
/>
    ),
    key: "/feedback",
  },
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LineLoading />}>
          <FeedbackManagement />
        </Suspense>
      ),
      meta: {
        label: "siderbar-labels.feedback-title",
        key: "/admin/feedback",
      },
    },
  ],
};

export default feedback;
