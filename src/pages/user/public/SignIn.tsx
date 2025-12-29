import { LogOut, Shield, UserCircle, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "@/router/hooks";
import { useUserActions, useUserToken } from "@/store/userStore";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { useUserProfile } from "@/hooks/useUserProfile";
import userApi from "@/api/services/userApi";
import { useTranslation } from "react-i18next";
import Logo from "@/ui/logo";
import NoticeContent from "@/layouts/dashboard/components/notice";

const SignIn = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, refetch } = useUserProfile();
  const { accessToken } = useUserToken();
  const { clearUserInfoAndToken } = useUserActions();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
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
    <div className="flex items-center">
      {!accessToken ? (
        <Link
          to="/login"
          className="px-5 py-1.5 bg-foreground text-background rounded-full font-bold text-[11px] uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
        >
          Đăng Nhập
        </Link>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          {/* --- Trigger Button --- */}
          <div className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full bg-zinc-100/50 dark:bg-zinc-800/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all shadow-sm group">
            <div className="relative">
              {profile?.avatar ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${profile.avatar}`}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900 shadow-sm transition-transform group-hover:scale-105"
                />
              ) : (
                <UserCircle className="w-7 h-7 text-zinc-400 group-hover:text-primary transition-colors" />
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
            </div>
            <span className="hidden md:block font-bold text-[11px] text-zinc-700 dark:text-zinc-200 uppercase tracking-tight">
              {profile?.name ? profile.name.split(" ").pop() : "Hồ sơ"}
            </span>
          </div>

          <div
            className={`absolute right-0 mt-0 w-[320px] origin-top-right transition-all duration-300 ease-out z-50 ${dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
          >
            <div className="bg-background/95 backdrop-blur-xl rounded-[24px] border border-border shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="p-4 flex items-center gap-3 bg-muted/30">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-border">
                  {profile?.avatar ? (
                    <img src={`${import.meta.env.VITE_API_URL}${profile.avatar}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center"><UserCircle className="text-zinc-400" size={20} /></div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-bold text-sm truncate">{profile?.name || "Người dùng"}</h4>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                    {profile?.role === "admin" ? "Quản trị viên" : "Tài khoản cá nhân"}
                  </span>
                </div>
              </div>

              <div className="px-2 pb-2 grid grid-cols-2 gap-2 px-3">
                {profile?.role === "admin" && (
                  <button
                    onClick={() => router.push("/dashboard/workbench")}
                    className="flex flex-col border border-border items-center justify-center gap-1.5 py-3 rounded-2xl bg-muted/50 hover:bg-amber-500 hover:text-white transition-all group cursor-pointer"
                  >
                    <Shield size={16} className="text-amber-500 group-hover:text-white" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Quản trị</span>
                  </button>
                )}
                <button
                  onClick={() => router.push("/infor-account")}
                  className={`flex border border-border  flex-col items-center justify-center gap-1.5 py-2 rounded-2xl bg-muted/50 hover:bg-primary hover:text-white transition-all group cursor-pointer ${profile?.role !== 'admin' ? 'col-span-2 flex-row py-2.5' : ''}`}
                >
                  {profile?.role === 'admin' ? <Settings size={16} /> : <Logo iconClassName="w-5 h-5 group-hover:brightness-200" hideText />}
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {profile?.role === 'admin' ? "Cài đặt" : "Truy cập Tmember"}
                  </span>
                </button>
              </div>

              <div className="border-t border-border">
                <div className="max-h-[400px] overflow-hidden">
                  <NoticeContent />
                </div>
              </div>

              <div className="p-2 bg-muted/20 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full cursor-pointer flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-all font-bold text-[10px] uppercase tracking-[0.1em]"
                >
                  <LogOut size={14} />
                  {t("auth.login.logout")}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;