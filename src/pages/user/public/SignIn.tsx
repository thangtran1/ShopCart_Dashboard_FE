import { LogOut, Shield, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "@/router/hooks";
import { useUserActions, useUserToken } from "@/store/userStore";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { useUserProfile } from "@/hooks/useUserProfile";
import userApi from "@/api/services/userApi";
import { useTranslation } from "react-i18next";
import { Button } from "antd";

const SignIn = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, refetch } = useUserProfile();
  const { accessToken } = useUserToken();
  const { clearUserInfoAndToken } = useUserActions();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  // Refresh profile when avatar or info updated
  useEffect(() => {
    const refresh = () => refetch();
    window.addEventListener("avatarUpdated", refresh);
    window.addEventListener("profileUpdated", refresh);

    return () => {
      window.removeEventListener("avatarUpdated", refresh);
      window.removeEventListener("profileUpdated", refresh);
    };
  }, [refetch]);

  const handleLogout = async () => {
    try {
      const res = await userApi.logout();
      if (res.data?.success) {
        clearUserInfoAndToken();
        toast.success(t("auth.login.logoutSuccess"));
        navigate("/login", { replace: true });
      } else toast.error(res.data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="md:flex items-center gap-1">
      {!accessToken ? (
        <Link
          to="/login"
          className="flex items-center gap-1 cursor-pointer !text-foreground hover:!text-primary"
        >
          <span className="font-semibold">Đăng Nhập</span>
        </Link>
      ) : (
        <div
          className="relative group"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div className="flex items-center gap-1 cursor-pointer rounded-md transition">
            {profile?.avatar ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${profile.avatar}`}
                className="w-6 h-6 rounded-full object-cover border border-border"
              />
            ) : (
              <UserCircle className="w-5 h-5 !text-foreground hover:!text-primary" />
            )}

            <span className="hidden md:block font-medium text-sm !text-foreground hover:!text-primary">
              {profile?.name || "Hồ sơ"}
            </span>
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 w-56 bg-muted rounded-xl border border-border shadow-xl z-50 animate-fade-in">
              {/* Top avatar + name */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                {profile?.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${profile.avatar}`}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-gray-500" />
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {profile?.name || "Hồ sơ"}
                  </span>
                  <span className="text-xs">Tài khoản cá nhân</span>
                </div>
              </div>

              {/* Admin */}
              {profile?.role === "admin" && (
                <Button
                  onClick={() => router.push("/dashboard/workbench")}
                  className="w-full !border-none !flex !justify-between items-center px-4"
                >
                  <span>Trang Quản Trị</span>
                  <Shield className="w-4 h-4" />
                </Button>
              )}

              {/* Hồ sơ */}
              <Button
                onClick={() => router.push("/ho-so")}
                className="w-full !border-none !flex !justify-between items-center px-4"
              >
                <span>Hồ sơ</span>
                <UserCircle className="w-4 h-4 !text-foreground hover:!text-primary" />
              </Button>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                className="w-full !border-none !flex !justify-between items-center px-4"
              >
                <span>Đăng xuất</span>
                <LogOut className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default SignIn;
