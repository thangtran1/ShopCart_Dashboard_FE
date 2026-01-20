import { Navigate, useLocation, Outlet } from "react-router";
import { useUserToken } from "@/store/userStore";

export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { accessToken } = useUserToken();
  const location = useLocation();
  
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}