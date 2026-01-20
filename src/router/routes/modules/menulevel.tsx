import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/common/loading";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router";
import type { AppRouteObject } from "#/router";
import MenuLevel from "@/pages/admin/menu-level/menu-level-1a";
import MenuLevel2a from "@/pages/admin/menu-level/menu-level-1b/menu-level-2a";
import MenuLevel3a from "@/pages/admin/menu-level/menu-level-1b/menu-level-2b/menu-level-3a";

const menulevel: AppRouteObject = {
  order: 5,
  path: "menu_level",
  element: (
    <Suspense fallback={<LineLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: "siderbar-labels.menulevel.index",
    icon: (
      <Icon
        icon="local:ic-menulevel"
        className="ant-menu-item-icon"
        size="24"
      />
    ),
    key: "/menu_level",
  },
  children: [
    {
      path: "menu_level_1a",
      element: <MenuLevel />,
      meta: {
        label: "siderbar-labels.menulevel.1a",
        key: "/admin/menu_level/menu_level_1a",
      },
    },
    {
      path: "menu_level_1b",
      meta: {
        label: "siderbar-labels.menulevel.1b.index",
        key: "/admin/menu_level/menu_level_1b",
      },
      children: [
        {
          index: true,
          element: <Navigate to="menu_level_2a" replace />,
        },
        {
          path: "menu_level_2a",
          element: <MenuLevel2a />,
          meta: {
            label: "siderbar-labels.menulevel.1b.2a",
            key: "/admin/menu_level/menu_level_1b/menu_level_2a",
          },
        },
        {
          path: "menu_level_2b",
          meta: {
            label: "siderbar-labels.menulevel.1b.2b.index",
            key: "/admin/menu_level/menu_level_1b/menu_level_2b",
          },
          children: [
            {
              index: true,
              element: <Navigate to="menu_level_3a" replace />,
            },
            {
              path: "menu_level_3a",
              element: <MenuLevel3a />,
              meta: {
                label: "siderbar-labels.menulevel.1b.2b.3a",
                key: "/admin/menu_level/menu_level_1b/menu_level_2b/menu_level_3a",
              },
            },
          ],
        },
      ],
    },
  ],
};

export default menulevel;
