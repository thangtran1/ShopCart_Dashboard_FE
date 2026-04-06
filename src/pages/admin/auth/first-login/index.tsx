import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Icon } from "@/components/icon";
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
import Logo from "@/ui/logo";
import LocalePicker from "@/components/common/locale-picker";
import SettingButton from "@/layouts/dashboard/components/setting-button";
import { FullPageLoading } from "@/components/common/loading";
import PlaceholderImg from "@/assets/images/background/placeholder.svg";

import apiClient from "@/api/apiClient";
import { API_URL } from "@/router/routes/api.route";
import { useUserActions, useUserInfo } from "@/store/userStore";

const { VITE_APP_ADMIN: HOMEPAGE } = import.meta.env;

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const FirstLoginChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const { setUserInfo } = useUserActions();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.patch({ url: API_URL.PROFILE.ChangePassword, data }),
    onSuccess: () => {
      toast.success(t("auth.first-login.changeSuccess"));
      // Update loginCount in store so user won't be redirected here again
      setUserInfo({ ...userInfo, loginCount: 2 } as any);
      // Redirect based on role
      if (userInfo.role === "user") {
        navigate("/", { replace: true });
      } else {
        navigate(HOMEPAGE || "/dash", { replace: true });
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || t("auth.first-login.changeFailed")
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <>
      {changePasswordMutation.isPending && (
        <FullPageLoading message={t("auth.first-login.changing")} />
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
              <div className="text-center mb-6 space-y-2">
                <div className="flex justify-center items-center mb-3">
                  <Icon
                    icon="local:ic-reset-password"
                    size="100"
                    className="text-primary!"
                  />
                </div>
                <h1 className="text-2xl font-bold">
                  {t("auth.first-login.title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("auth.first-login.description")}
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    rules={{
                      required: t("auth.first-login.currentPasswordRequired"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("auth.first-login.currentPassword")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder={t(
                                "auth.first-login.currentPasswordPlaceholder"
                              )}
                              {...field}
                            />
                            <div
                              className="absolute right-0 top-0 h-full flex items-center px-3 cursor-pointer text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                            >
                              <Icon
                                icon={
                                  showCurrentPassword
                                    ? "lucide:eye-off"
                                    : "lucide:eye"
                                }
                                size={16}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    rules={{
                      required: t("auth.first-login.newPasswordRequired"),
                      minLength: {
                        value: 6,
                        message: t("auth.first-login.passwordMinLength"),
                      },
                      validate: (value) =>
                        value !== form.getValues("currentPassword") ||
                        t("auth.first-login.samePassword"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("auth.first-login.newPassword")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder={t(
                                "auth.first-login.newPasswordPlaceholder"
                              )}
                              {...field}
                            />
                            <div
                              className="absolute right-0 top-0 h-full flex items-center px-3 cursor-pointer text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              <Icon
                                icon={
                                  showNewPassword
                                    ? "lucide:eye-off"
                                    : "lucide:eye"
                                }
                                size={16}
                              />
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
                      required: t("auth.first-login.confirmPasswordRequired"),
                      validate: (value) =>
                        value === form.getValues("newPassword") ||
                        t("auth.first-login.passwordMismatch"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("auth.first-login.confirmPassword")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder={t(
                                "auth.first-login.confirmPasswordPlaceholder"
                              )}
                              {...field}
                            />
                            <div
                              className="absolute right-0 top-0 h-full flex items-center px-3 cursor-pointer text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              <Icon
                                icon={
                                  showConfirmPassword
                                    ? "lucide:eye-off"
                                    : "lucide:eye"
                                }
                                size={16}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-xs p-2 rounded-lg text-foreground font-medium bg-muted">
                    {t("auth.first-login.note")}
                  </div>

                  <Button
                    type="submit"
                    className="w-full cursor-pointer text-white font-medium"
                  >
                    {t("auth.first-login.submitButton")}
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

export default FirstLoginChangePassword;
