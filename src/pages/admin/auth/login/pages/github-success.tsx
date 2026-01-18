import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useUserActions } from "@/store/userStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { FullPageLoading } from "@/components/common/loading";
import { useLoginStateContext } from "../providers/login-provider";
const { VITE_APP_ADMIN: HOMEPAGE } = import.meta.env;

export default function GitHubSuccess() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { setUserToken, setUserInfo } = useUserActions();
  const { backToLogin } = useLoginStateContext();
  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (token && refreshToken) {
      const timer = setTimeout(() => {
        try {
          setUserToken({ accessToken: token, refreshToken });

          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserInfo({
            id: payload.sub,
            email: payload.email,
            username: searchParams.get("username") || payload.email,
            avatar: undefined,
            role: payload.role,
          });

          toast.success(t("auth.login.githubLoginSuccess"));

          const target = payload.role === "user" ? "/" : (HOMEPAGE || "/admin");
          window.location.href = target;
        } catch (error) {
          backToLogin();
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      backToLogin();
    }
  }, []);

  return <FullPageLoading message={t("auth.login.githubLoginProcessing")} />;
}
