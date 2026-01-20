"use client";
import { useUserActions } from "@/store/userStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/ui/button";
import DefaultAvatar from "@/assets/images/background/default_avt.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import userApi from "@/api/services/userApi";
import { LayoutDashboard, LogOut, User, Home, ChevronRight } from "lucide-react";

export default function AccountDropdown() {
  const { profile } = useUserProfile();
  const { clearUserInfoAndToken } = useUserActions();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await userApi.logout();
      if (response.data?.success) {
        clearUserInfoAndToken();
        toast.success(t("auth.login.logoutSuccess"));
        navigate("/login");
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const avatarUrl = profile?.avatar
    ? `${import.meta.env.VITE_API_URL}${profile.avatar}`
    : DefaultAvatar;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative cursor-pointer rounded-full border border-border p-0.5 transition-all duration-300"
        >
          <img
            className="h-6 w-6 rounded-full object-cover shadow-sm"
            src={avatarUrl}
            alt="User Avatar"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-64 mt-2 p-2 border border-border backdrop-blur-xl shadow-2xl rounded-2xl" 
        align="end"
      >
        <div className="flex items-center gap-3 mb-2 rounded-xl">
          <img
            className="h-8 w-8 rounded-full object-cover border border-primary/40"
            src={avatarUrl}
            alt="Admin Profile"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-foreground truncate">
              {profile?.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {profile?.email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="space-y-1 mt-1">
          <DropdownMenuItem asChild className="rounded-lg cursor-pointer group py-2">
            <NavLink to="/" className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                <span className="font-medium text-sm">{t("auth.login.home") || "Trang chủ"}</span>
              </div>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-all" />
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-lg cursor-pointer group py-2">
            <NavLink to="/admin/dashboard/profile" className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                <span className="font-medium text-sm">{t("auth.login.profile")}</span>
              </div>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-all" />
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-lg cursor-pointer group py-2">
            <NavLink to="/admin/dashboard/workbench" className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                <span className="font-medium text-sm">Dashboard</span>
              </div>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-all" />
            </NavLink>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={logout}
          className="mt-1 rounded-lg focus:bg-red-50 focus:text-red-600 text-red-500 font-semibold cursor-pointer py-2 group"
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="text-sm">{t("auth.login.logout")}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}