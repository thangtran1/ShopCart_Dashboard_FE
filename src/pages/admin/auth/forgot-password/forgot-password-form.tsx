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
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReturnButton } from "../login/providers/ReturnButton";
import {
  LoginStateEnum,
  useLoginStateContext,
} from "../login/providers/login-provider";
import { Radio } from "antd";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import userService from "@/api/services/userApi";
import { toast } from "sonner";
import VerifyOTP from "./verifyOTP";
import { FullPageLoading } from "@/components/common/loading";
import { REGEX_EMAIL } from "@/utils/use-always";
function ForgotPasswordForm() {
  const { t } = useTranslation();
  const { loginState, backToLogin } = useLoginStateContext();
  const form = useForm();
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("link");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const forgotPasswordMutation = useMutation({
    mutationFn: userService.forgotPassword,
  });

  const onFinish = async () => {
    try {
      const res = await forgotPasswordMutation.mutateAsync({ email });
      const success = res.data?.success;

      if (!success) {
        return toast.error(
          res.data?.message || t("auth.forgot-password.errorForgetPassword")
        );
      }

      if (method === "link") {
        toast.success(t("auth.forgot-password.linkContent"));
        form.reset();
        setEmail("");
        backToLogin();
      } else {
        toast.success(t("auth.forgot-password.methodOTP"));
        setIsOtpModalOpen(true);
      }
    } catch (error) {
      throw error;
    }
  };
  if (loginState !== LoginStateEnum.RESET_PASSWORD) return null;

  return (
    <>
      {forgotPasswordMutation.isPending && (
        <FullPageLoading message={t("auth.forgot-password.sending")} />
      )}
      <div className="mb-8 text-center">
        <Icon
          icon="local:ic-reset-password"
          size="100"
          className="text-primary!"
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFinish)} className="space-y-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">
              {t("auth.forgot-password.forgetFormTitle")}
            </h1>
            <p className="text-balance text-sm text-muted-foreground">
              {t("auth.forgot-password.forgetFormSecondTitle")}
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: t("auth.forgot-password.emailRequired"),
              pattern: {
                value: REGEX_EMAIL,
                message: t("auth.forgot-password.emailInvalid"),
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("auth.forgot-password.email")}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setEmail(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method"
            render={() => (
              <FormItem>
                <FormLabel className="flex justify-center text-md">
                  {t("auth.forgot-password.selectMethod")}
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Radio.Group
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                    >
                      <Radio value="link">
                        <div className="text-[11px]">
                          {t("auth.forgot-password.resetLink")}
                        </div>
                      </Radio>
                      <Radio value="otp">
                        <div className="text-[11px]">
                          {t("auth.forgot-password.receiveOTP")}
                        </div>
                      </Radio>
                    </Radio.Group>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-xs p-2 rounded-lg text-foreground font-medium bg-muted">
            {t("auth.forgot-password.noteConfirm")}
          </div>
          <Button
            type="submit"
            className="w-full cursor-pointer text-white font-medium"
          >
            {t("auth.forgot-password.sendEmailButton")}
          </Button>
          <ReturnButton onClick={backToLogin} />
        </form>
      </Form>

      <VerifyOTP
        email={email}
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
      />
    </>
  );
}

export default ForgotPasswordForm;
