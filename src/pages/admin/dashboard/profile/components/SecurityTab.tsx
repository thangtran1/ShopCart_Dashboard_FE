import { Button, Form, Input } from "antd";
import { toast } from "sonner";
import {
  AdminChangePasswordReq,
  adminChangePassword,
} from "@/api/services/profileApi";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FullPageLoading } from "@/components/common/loading";
interface SecurityTabProps {}

export default function SecurityTab({}: SecurityTabProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);

  const { mutateAsync: changePassword, isPending } = useMutation({
    mutationFn: (data: AdminChangePasswordReq) => adminChangePassword(data),
    onSuccess: () => {
      form.resetFields();
      setIsChanged(false);
      toast.success(t("profile.change-password-success"));
    },
    onError: (error: Error) => {
      console.error("Change password failed:", error);
    },
  });

  const handleSubmit = async (values: AdminChangePasswordReq) => {
    await changePassword(values);
  };

  const handleFieldsChange = (allFields: any[]) => {
    const hasError = allFields.some((f) => (f.errors?.length ?? 0) > 0);
    const values = form.getFieldsValue();
    const allFilled = Object.values(values).every(
      (v) => v && v.toString().trim() !== ""
    );
    setIsChanged(!hasError && allFilled);
  };

  return (
    <div>
      {isPending && <FullPageLoading message={t("profile.isChangePass")} />}
      <h3 className="text-lg font-semibold mb-4">
        {t("profile.change-password")}
      </h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFieldsChange={handleFieldsChange}
      >
        <Form.Item
          name="currentPassword"
          label={t("profile.current-password")}
          rules={[
            { required: true, message: t("profile.current-password-error") },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={t("profile.new-password")}
          rules={[
            { required: true, message: t("profile.new-password-error") },
            { min: 6, message: t("profile.new-password-error") },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t("profile.confirm-password")}
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: t("profile.confirm-password-error") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t("profile.confirm-password-error"))
                );
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isPending}
            disabled={!isChanged}
          >
            {t("profile.change-password")}
          </Button>
        </div>
      </Form>
    </div>
  );
}
