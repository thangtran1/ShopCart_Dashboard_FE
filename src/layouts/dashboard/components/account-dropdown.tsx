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
import { NavLink, replace } from "react-router";
import { toast } from "sonner";
import userApi from "@/api/services/userApi";

export default function AccountDropdown() {
  const { profile } = useUserProfile();
  const { clearUserInfoAndToken } = useUserActions();
  const { t } = useTranslation();
  const logout = async () => {
    try {
      const response = await userApi.logout();
      if (response.data?.success) {
        clearUserInfoAndToken();
        toast.success(t("auth.login.logoutSuccess"));
        replace("/login");
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      console.log(error, 'error')
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <img
            className="h-6 w-6 rounded-full"
            src={
              profile?.avatar
                ? `${import.meta.env.VITE_API_URL}${profile.avatar}`
                : DefaultAvatar
            }
            alt=""
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex items-center gap-2 p-2">
          <img
            className="h-10 w-10 rounded-full"
            src={
              profile?.avatar
                ? `${import.meta.env.VITE_API_URL}${profile.avatar}`
                : DefaultAvatar
            }
            alt=""
          />
          <div className="flex flex-col items-start">
            <div className="text-text-primary text-sm font-medium">
              {profile?.name || "Loading..."}
            </div>
            <div className="text-text-secondary text-xs">
              {profile?.email || "Loading..."}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <NavLink to="/dashboard/profile">{t("auth.login.profile")}</NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-bold text-warning" onClick={logout}>
          {t("auth.login.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
