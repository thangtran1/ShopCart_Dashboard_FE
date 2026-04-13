import { Button, Switch, Modal, Form, Input } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useUserProfile } from "@/hooks/useUserProfile";
import { updateUserProfile } from "@/api/services/profileApi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function LoginSettingsContent() {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  if (!profile) return null;

  const currentEmail = profile.email || "Chưa có Email";
  const hasUsername = Boolean(profile.username);
  const username = profile.username;
  const isEnabled = profile.isUsernameLoginEnabled || false;

  const handleToggle = async (checked: boolean) => {
    try {
      if (!hasUsername && checked) {
        toast.error(t("login_settings.err_create_first"));
        return;
      }
      await updateUserProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "",
        bio: profile.bio || "",
        username: profile.username,
        isUsernameLoginEnabled: checked,
      });
      toast.success(checked ? t("login_settings.msg_toggle_on") : t("login_settings.msg_toggle_off"));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error: any) {
      toast.error(t("login_settings.err_change_setting"));
    }
  };

  const handleCreateUsername = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateUserProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "",
        bio: profile.bio || "",
        username: values.username,
        isUsernameLoginEnabled: hasUsername ? profile.isUsernameLoginEnabled : true,
      });
      toast.success(hasUsername ? t("login_settings.success_update") : t("login_settings.success_create"));
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (!error.errorFields) {
        toast.error(t("login_settings.err_create"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full animate-fade-in space-y-6">
      <div className="rounded-2xl border p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              {t("login_settings.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("login_settings.desc")}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{t("login_settings.main_id")}</span>
            <span className="text-lg font-bold">{currentEmail}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-dashed border-border mb-2">
          <span className="text-base font-semibold text-foreground">
            {t("login_settings.login_name")}
          </span>
          {hasUsername ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-primary">{username}</span>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<EditOutlined />} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title={t("login_settings.edit")}
                  onClick={() => {
                    form.setFieldsValue({ username: profile.username });
                    setIsModalOpen(true);
                  }}
                />
              </div>
              <Switch checked={isEnabled} onChange={handleToggle} />
            </div>
          ) : (
            <Button
              type="primary"
              ghost
              className="rounded-full font-bold uppercase text-xs"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              {t("login_settings.create_new")}
            </Button>
          )}
        </div>

        <div className="rounded-xl bg-secondary/50 p-4 border border-border mt-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">{t("login_settings.note_title")}</strong> {t("login_settings.note_desc")}
          </p>
        </div>
      </div>

      <Modal
        title={hasUsername ? t("login_settings.modal_edit_title") : t("login_settings.modal_create_title")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreateUsername}
        confirmLoading={loading}
        okText={hasUsername ? t("login_settings.btn_update") : t("login_settings.btn_create")}
        cancelText={t("login_settings.btn_cancel")}
        okButtonProps={{ className: "bg-primary" }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="username"
            label={t("login_settings.input_label")}
            rules={[
              { required: true, message: t("login_settings.req_username") },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: t("login_settings.err_pattern")
              },
              { min: 4, message: t("login_settings.err_min") }
            ]}
          >
            <Input size="large" autoFocus placeholder={t("login_settings.input_placeholder")} />
          </Form.Item>
          <div className="text-xs text-muted-foreground mt-[-10px] mb-4">
            {t("login_settings.input_hint")}
          </div>
        </Form>
      </Modal>
    </div>
  );
}
