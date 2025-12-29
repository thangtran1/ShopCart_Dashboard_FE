import DashboardLayout from "@/layouts/dashboard";
import PageError from "@/pages/admin/sys/error/PageError";
import LoginPage from "@/pages/admin/auth";
import { usePermissionRoutes } from "@/router/hooks";
import { ERROR_ROUTE } from "@/router/routes/error-routes";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, type RouteObject, createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import type { AppRouteObject } from "#/router";
import ResetPassword from "@/pages/admin/auth/reset-passworđ/resetPassword";
import GoogleSuccess from "@/pages/admin/auth/login/pages/google-success";
import GoogleError from "@/pages/admin/auth/login/pages/google-error";
import GitHubSuccess from "@/pages/admin/auth/login/pages/github-success";
import GitHubError from "@/pages/admin/auth/login/pages/github-error";
import UserHomePage from "@/pages/user";
import UserLayout from "@/layouts/user/user-layout";
import ProtectedRoute from "./components/protected-route";
import MaintenanceGuard from "./components/maintenance-guard";
import { LoginProvider } from "@/pages/admin/auth/login/providers/login-provider";
import Contact from "@/pages/user/contact";
import Shop from "@/pages/user/shop";
import WishListPage from "@/pages/user/wishlist/page";
import CartPage from "@/pages/user/cart/page";
import SingleProductPage from "@/pages/user/product/[slug]/page";
import DetailCategory from "@/pages/user/category/[slug]/page";
import CheckoutPage from "@/pages/user/checkout/page";
import SuccessPage from "@/pages/user/success/page";
import OrdersPage from "@/pages/user/orders/page";
import TermsPage from "@/pages/user/public/terms";
import AboutUs from "@/pages/user/public/abouts";
import FAQs from "@/pages/user/public/faqs";
import Help from "@/pages/user/public/help";
import NewsPage from "@/pages/user/news/page";
import NewSlugDetail from "@/pages/user/news/[slug]/page";
import DetailBrand from "@/pages/user/brand/[slug]/page";
import InforAccount from "@/pages/user/infor-account";

const { VITE_APP_ADMIN: HOMEPAGE, VITE_API_URL_MAINTENANCE: MAIN_APP } =
  import.meta.env;

const PUBLIC_ROUTE: AppRouteObject = {
  path: "/login",
  element: (
    <ErrorBoundary FallbackComponent={PageError}>
      <LoginPage />
    </ErrorBoundary>
  ),
};

const NO_MATCHED_ROUTE: AppRouteObject = {
  path: "*",
  element: <Navigate to="/404" replace />,
};

export default function Router() {
  const permissionRoutes = usePermissionRoutes();

  const PROTECTED_ROUTE: AppRouteObject = {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={HOMEPAGE} replace /> },
      ...permissionRoutes,
    ],
  };
  const RESET_PASSWORD_ROUTE: AppRouteObject = {
    path: "/reset-password",
    element: (
      <ErrorBoundary FallbackComponent={PageError}>
        <LoginProvider>
          <ResetPassword />
        </LoginProvider>
      </ErrorBoundary>
    ),
  };

  const AUTH_ROUTES: AppRouteObject[] = [
    {
      path: "/auth/google/success",
      element: (
        <ErrorBoundary FallbackComponent={PageError}>
          <GoogleSuccess />
        </ErrorBoundary>
      ),
    },
    {
      path: "/auth/google/error",
      element: (
        <ErrorBoundary FallbackComponent={PageError}>
          <GoogleError />
        </ErrorBoundary>
      ),
    },
    {
      path: "/auth/github/success",
      element: (
        <ErrorBoundary FallbackComponent={PageError}>
          <GitHubSuccess />
        </ErrorBoundary>
      ),
    },
    {
      path: "/auth/github/error",
      element: (
        <ErrorBoundary FallbackComponent={PageError}>
          <GitHubError />
        </ErrorBoundary>
      ),
    },
  ];

  const APP_HOMEPAGE_USER: AppRouteObject = {
    path: "/",
    element: (
      <MaintenanceGuard redirectUrl={MAIN_APP}>
        <ErrorBoundary FallbackComponent={PageError}>
          <UserLayout />
        </ErrorBoundary>
      </MaintenanceGuard>
    ),
    children: [
      { index: true, element: <UserHomePage /> },
      {
        path: "infor-account",
        children: [{ index: true, element: <InforAccount /> }],
      },
      {
        path: "all-news",
        children: [
          { index: true, element: <NewsPage /> },
          {
            path: ":slug", // <--- bỏ dấu /
            element: <NewSlugDetail />,
          },
        ],
      },
      {
        path: "contact",
        children: [{ index: true, element: <Contact /> }],
      },
      {
        path: "shop",
        children: [{ index: true, element: <Shop /> }],
      },
      {
        path: "wishlist",
        children: [{ index: true, element: <WishListPage /> }],
      },
      {
        path: "cart",
        children: [{ index: true, element: <CartPage /> }],
      },
      {
        path: "product/:slug",
        element: <SingleProductPage />,
      },
      {
        path: "category",
        element: <DetailCategory />,
        children: [
          { path: ":slug", element: <DetailCategory /> },
        ],
      },
      {
        path: "brand",
        element: <DetailBrand />,
        children: [
          { path: ":slug", element: <DetailBrand /> },
        ],
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "success",
        element: <SuccessPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "terms",
        element: <TermsPage />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "faqs",
        element: <FAQs />,
      },
      {
        path: "help",
        element: <Help />,
      },
    ],
  };

  const routes = [
    PUBLIC_ROUTE,
    RESET_PASSWORD_ROUTE,
    ...AUTH_ROUTES,
    APP_HOMEPAGE_USER,
    PROTECTED_ROUTE,
    ERROR_ROUTE,
    NO_MATCHED_ROUTE,
  ] as RouteObject[];

  const router = createBrowserRouter(routes);
  // thêm dấu # createHashRouter vd http://localhost:/#/3000/

  return <RouterProvider router={router} />;
}
