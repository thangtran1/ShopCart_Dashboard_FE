import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReturnButton } from "./providers/ReturnButton";
import {
  LoginStateEnum,
  useLoginStateContext,
} from "./providers/login-provider";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { GoogleOAuthButton } from "@/components/common/google-oauth-button";
import { GitHubOAuthButton } from "@/components/common/github-oauth-button";
import { createUser, CreateUserReq } from "@/api/services/userManagementApi";
import { FullPageLoading } from "@/components/common/loading";
import { REGEX_EMAIL } from "@/utils/use-always";
const { VITE_APP_ADMIN: HOMEPAGE } = import.meta.env;

function RegisterForm() {
  const { t } = useTranslation();
  const { loginState, backToLogin } = useLoginStateContext();
  const navigate = useNavigate();
  const signUpMutation = useMutation({
    mutationFn: (data: CreateUserReq) => createUser(data),
    onSuccess: (res) => {
      if (res.data.success) {
        toast.success(t("auth.login.registerSuccess"));
        navigate(HOMEPAGE, { replace: true });
      } else {
        toast.error(res.data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onFinish = (values: CreateUserReq) => {
    const { name, email, password } = values; // chỉ gửi 3 field
    signUpMutation.mutate({ name, email, password });
  };

  if (loginState !== LoginStateEnum.REGISTER) return null;

  return (
    <>
      {signUpMutation.isPending && (
        <FullPageLoading message={t("auth.login.registering")} />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFinish)} className="space-y-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">
              {t("auth.login.signUpFormTitle")}
            </h1>
          </div>
          <FormField
            control={form.control}
            name="name"
            rules={{ required: t("auth.login.accountPlaceholder") }}
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <FormControl>
                  <Input placeholder={t("auth.login.userName")} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: t("auth.login.emaildPlaceholder"),
              pattern: {
                value: REGEX_EMAIL,
                message: t("auth.login.emailInvalid"),
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <FormControl>
                  <Input placeholder={t("auth.login.email")} {...field} />
                </FormControl>
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
                <FormMessage />
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("auth.login.password")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{
              required: t("auth.login.confirmPasswordPlaceholder"),
              validate: (value) =>
                value === form.getValues("password") || t("auth.login.diffPwd"),
            }}
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("auth.login.confirmPassword")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="text-xs p-2 rounded-lg text-foreground bg-warning/10 font-medium">
            {t("auth.login.noteConfirmRegister")}
          </div>
          <Button type="submit" className="w-full text-white cursor-pointer">
            {t("auth.login.registerButton")}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              {t("auth.login.otherSignUp")}
            </span>
          </div>
          <div className="flex justify-around text-2xl">
            <GitHubOAuthButton mode="register" />
            <GoogleOAuthButton mode="register" />
          </div>
          <div className="mb-2 text-xs text-gray">
            <span>{t("auth.login.registerAndAgree")}</span>
          </div>
          <ReturnButton onClick={backToLogin} />
        </form>
      </Form>
    </>
  );
}

export default RegisterForm;
