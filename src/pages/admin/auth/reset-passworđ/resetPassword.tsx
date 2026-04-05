import userService from "@/api/services/userApi";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import PlaceholderImg from "@/assets/images/background/placeholder.svg";
import { Icon } from "@/components/icon";
import Logo from "@/ui/logo";
import LocalePicker from "@/components/common/locale-picker";
import SettingButton from "@/layouts/dashboard/components/setting-button";
import { FullPageLoading } from "@/components/common/loading";

import { useForm } from "react-hook-form";
import { Button } from "@/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: userService.resetPassword,
    onSuccess: (res) => {
      if (res.data?.success) {
        toast.success(t("auth.reset-password.pasChangeSuccess"));
        navigate("/login", { replace: true });
      } else {
        toast.error(
          res.data?.message || t("auth.reset-password.failChangePas")
        );
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || t("auth.reset-password.failChangePas"));
    },
  });

  const handleResetPassword = (values: any) => {
    if (!token) {
      toast.error(t("auth.reset-password.invalidToken"));
      return;
    }
    const { newPassword } = values;
    resetPasswordMutation.mutate({ token, newPassword });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error(t("auth.reset-password.notToken"));
      navigate("/dash");
    }
  }, [location, navigate]);

  return (
    <>
      {resetPasswordMutation.isPending && (
        <FullPageLoading message={t("auth.reset-password.sending")} />
      )}
      <div className="relative grid min-h-svh lg:grid-cols-2 bg-background">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <div className="flex items-center gap-2 font-medium cursor-pointer">
              <Logo />
              <span>TVT Admin</span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full p-4 rounded-lg max-w-sm">
              <div className="text-center mb-4 space-y-1">
                <div className="flex justify-center items-center mb-3">
                  <Icon
                    icon="local:ic-reset-password"
                    size="100"
                    className="text-primary!"
                  />
                </div>
                <h1 className="text-2xl font-bold">
                  {t("auth.reset-password.passwordNewTitle")}
                </h1>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleResetPassword)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="newPassword"
                    rules={{
                      required: t("auth.reset-password.invalidPassword"),
                      minLength: {
                        value: 6,
                        message: t("auth.reset-password.invalidPassword"),
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.reset-password.newPas")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder={t("auth.reset-password.newPas")}
                              {...field}
                            />
                            <div
                              className="absolute right-0 top-0 h-full flex items-center px-3 cursor-pointer text-muted-foreground hover:text-foreground"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              <Icon icon={showNewPassword ? "lucide:eye-off" : "lucide:eye"} size={16} />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{
                      required: t("auth.reset-password.notConfirmPassword"),
                      validate: (value) =>
                        value === form.getValues("newPassword") ||
                        t("auth.reset-password.notConfirmPassword"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("auth.reset-password.confirmPassword")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder={t("auth.reset-password.confirmPassword")}
                              {...field}
                            />
                            <div
                              className="absolute right-0 top-0 h-full flex items-center px-3 cursor-pointer text-muted-foreground hover:text-foreground"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              <Icon icon={showConfirmPassword ? "lucide:eye-off" : "lucide:eye"} size={16} />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-xs p-2 mb-2 rounded-lg text-foreground font-medium bg-muted mt-2">
                    {t("auth.reset-password.resetPasswordDescription")}
                  </div>

                  <Button
                    type="submit"
                    className="w-full mb-2 cursor-pointer text-white font-medium"
                  >
                    {t("auth.reset-password.confirm")}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        <div className="relative hidden bg-background-paper lg:block">
          <img
            src={PlaceholderImg}
            alt="placeholder img"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
          />
        </div>
        <div className="absolute right-2 top-0 flex flex-row">
          <LocalePicker />
          <SettingButton />
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
