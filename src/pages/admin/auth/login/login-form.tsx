import type { SignInReq } from "@/api/services/userApi";
import { GoogleOAuthButton } from "@/components/common/google-oauth-button";
import { GitHubOAuthButton } from "@/components/common/github-oauth-button";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  LoginStateEnum,
  useLoginStateContext,
} from "./providers/login-provider";
import { FullPageLoading } from "@/components/common/loading";
import { useUserActions, useUserInfo, useUserToken } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { Navigate } from "react-router";
import userService from "@/api/services/userApi";
import { REGEX_EMAIL } from "@/utils/use-always";
import { toast } from "sonner";
const { VITE_APP_ADMIN: HOMEPAGE } = import.meta.env;

export function LoginForm() {
  const { t } = useTranslation();
  const token = useUserToken();
  const userInfo = useUserInfo();
  const [remember, setRemember] = useState(true);
  const { setUserToken, setUserInfo } = useUserActions();
  const { loginState, setLoginState } = useLoginStateContext();

  const form = useForm<SignInReq>({
    defaultValues: {
      email: "thangtrandz04@gmail.com",
      password: "123123",
    },
  });

  const signInMutation = useMutation({
    mutationFn: userService.login,
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data;
      setUserToken({ accessToken, refreshToken });
      setUserInfo(user);
      toast.success(t("auth.login.signInSuccess"));
    },
  });

  if (token.accessToken) {
    if (userInfo.loginCount === 1) {
      return <Navigate to="/ho-so" replace />;
    }
    if (userInfo.role === "user") return <Navigate to="/" replace />;
    return <Navigate to={HOMEPAGE} replace />;
  }

  if (loginState !== LoginStateEnum.LOGIN) return null;

  const handleFinish = (values: SignInReq) => {
    signInMutation.mutate(values);
  };

  return (
    <>
      {signInMutation.isPending && (
        <FullPageLoading message={t("auth.login.loggingIn")} />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFinish)} className="space-y-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">
              {t("auth.login.signInFormTitle")}
            </h1>
            <p className="text-balance text-sm text-muted-foreground">
              {t("auth.login.signInFormDescription")}
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: t("auth.login.accountPlaceholder"),
              pattern: {
                value: REGEX_EMAIL,
                message: t("auth.login.emailInvalid"),
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.login.userName")}</FormLabel>
                <FormControl>
                  <Input placeholder="admin/test" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{
              required: t("auth.login.passwordPlaceholder"),
              minLength: {
                value: 6,
                message: t("auth.login.passwordMinLength"),
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.login.password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("auth.login.password")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                id="remember"
                checked={remember}
                onCheckedChange={(checked) =>
                  setRemember(checked === "indeterminate" ? false : checked)
                }
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("auth.login.rememberMe")}
              </label>
            </div>
            <Button
              variant="link"
              className="cursor-pointer"
              onClick={() => setLoginState(LoginStateEnum.RESET_PASSWORD)}
              size="sm"
            >
              {t("auth.login.forgetPassword")}
            </Button>
          </div>

          <Button type="submit" className="w-full cursor-pointer">
            {t("auth.login.loginButton")}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              {t("auth.login.otherSignIn")}
            </span>
          </div>
          <div className="flex justify-around text-2xl">
            <GitHubOAuthButton mode="login" />
            <GoogleOAuthButton mode="login" />
          </div>

          <div className="text-center text-sm">
            {t("auth.login.noAccount")}
            <Button
              variant="link"
              className="px-1 cursor-pointer underline"
              onClick={() => setLoginState(LoginStateEnum.REGISTER)}
            >
              {t("auth.login.signUpFormTitle")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default LoginForm;
