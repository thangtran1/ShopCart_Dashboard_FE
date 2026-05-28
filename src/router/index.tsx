import { Navigate, type RouteObject, createBrowserRouter, RouterProvider } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import DashboardLayout from "@/layouts/dashboard";
import UserLayout from "@/layouts/user/user-layout";
import ProtectedRoute from "./components/protected-route";
import MaintenanceGuard from "./components/maintenance-guard";
import { LoginProvider } from "@/pages/admin/auth/login/providers/login-provider";
import LoginPage from "@/pages/admin/auth";
import ResetPassword from "@/pages/admin/auth/reset-passworđ/resetPassword";
import FirstLoginChangePassword from "@/pages/admin/auth/first-login";
import PageError from "@/pages/admin/sys/error/PageError";
import Page404 from "@/pages/admin/sys/error/Page404";
import GoogleSuccess from "@/pages/admin/auth/login/pages/google-success";
import GoogleError from "@/pages/admin/auth/login/pages/google-error";
import GitHubSuccess from "@/pages/admin/auth/login/pages/github-success";
import GitHubError from "@/pages/admin/auth/login/pages/github-error";
import UserHomePage from "@/pages/user";
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
import { usePermissionRoutes } from "@/router/hooks";
import { ERROR_ROUTE } from "@/router/routes/error-routes";
import type { AppRouteObject } from "#/router";

const { VITE_APP_ADMIN: HOMEPAGE, VITE_API_URL_MAINTENANCE: MAIN_APP } = import.meta.env;

// 1. CỤM AUTH & PUBLIC (Login, Reset Pass, Social)
const AUTH_ROUTES: AppRouteObject[] = [
  { path: "/login", element: <ErrorBoundary FallbackComponent={PageError}><LoginPage /></ErrorBoundary> },
  { path: "/reset-password", element: <ErrorBoundary FallbackComponent={PageError}><LoginProvider><ResetPassword /></LoginProvider></ErrorBoundary> },
  { path: "/auth/google/success", element: <GoogleSuccess /> },
  { path: "/auth/google/error", element: <GoogleError /> },
  { path: "/auth/github/success", element: <GitHubSuccess /> },
  { path: "/auth/github/error", element: <GitHubError /> },
  { path: "/first-login-change-password", element: <ErrorBoundary FallbackComponent={PageError}><FirstLoginChangePassword /></ErrorBoundary> },
].map((route) => ({
  ...route,
  element: (
    <MaintenanceGuard redirectUrl={MAIN_APP}>
      {route.element}
    </MaintenanceGuard>
  ),
}));

const NO_MATCHED_ROUTE: AppRouteObject = {
  path: "*",
  element: <Navigate to="/404" replace />,
};

export default function Router() {
  const permissionRoutes = usePermissionRoutes();

  // 2. CỤM ADMIN (Trong /admin)
  const ADMIN_SECTION: AppRouteObject = {
    path: "/admin",
    element: (
      <MaintenanceGuard redirectUrl={MAIN_APP}>
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      </MaintenanceGuard>
    ),
    children: [
      { index: true, element: <Navigate to={HOMEPAGE} replace /> },
      ...permissionRoutes,
      { path: "*", element: <Page404 /> },
    ],
  };

  // 3. USER PUBLIC (Không cần login)
  const USER_PUBLIC_SECTION: AppRouteObject = {
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
      { path: "contact", element: <Contact /> },
      { path: "shop", element: <Shop /> },
      { path: "wishlist", element: <WishListPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "product/:slug", element: <SingleProductPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "about", element: <AboutUs /> },
      { path: "faqs", element: <FAQs /> },
      { path: "help", element: <Help /> },
      { path: "all-news", children: [{ index: true, element: <NewsPage /> }, { path: ":slug", element: <NewSlugDetail /> }] },
      { path: "category", element: <DetailCategory />, children: [{ path: ":slug", element: <DetailCategory /> }]},
      { path: "brand", element: <DetailBrand />, children: [{ path: ":slug", element: <DetailBrand /> }]},
    ],
  };

  // 4. USER PRIVATE (Phải login mới hiện Layout)
  const USER_PRIVATE_SECTION: AppRouteObject = {
    element: (
      <ProtectedRoute>
        <MaintenanceGuard redirectUrl={MAIN_APP}>
          <ErrorBoundary FallbackComponent={PageError}><UserLayout /></ErrorBoundary>
        </MaintenanceGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: "infor-account", element: <InforAccount /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "success", element: <SuccessPage /> },
    ],
  };

  // 5. TỔNG HỢP ROUTER
  const routes = [
    ...AUTH_ROUTES,
    ADMIN_SECTION,
    USER_PUBLIC_SECTION,
    USER_PRIVATE_SECTION,
    ERROR_ROUTE,
    NO_MATCHED_ROUTE,
  ] as RouteObject[];

  return <RouterProvider router={createBrowserRouter(routes)} />;
  // thêm dấu # createHashRouter vd http://localhost:/#/3000/

}
