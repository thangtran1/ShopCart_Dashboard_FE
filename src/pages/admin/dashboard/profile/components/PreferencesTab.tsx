import { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { toast } from "sonner";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import {
  UpdateSystemSettingsReq,
  updateSystemSettings,
  SystemSettings,
  clearSystemCache,
} from "@/api/services/profileApi";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { FullPageLoading } from "@/components/common/loading/full-page-loading";

const { Option } = Select;
const { TextArea } = Input;

interface PreferencesTabProps {
  setSystemSettings: (settings: SystemSettings) => void;
  systemSettings?: SystemSettings | null;
}

export default function PreferencesTab({
  setSystemSettings,
  systemSettings,
}: PreferencesTabProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { refreshSettings } = useSystemSettings();
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (!systemSettings) return;
    form.setFieldsValue({
      defaultLanguage: systemSettings.defaultLanguage,
      systemName: systemSettings.systemName,
      systemDescription: systemSettings.systemDescription,
    });
    setIsChanged(false);
  }, [systemSettings]);

  const handleValuesChange = () => {
    if (!systemSettings) return;
    const current = form.getFieldsValue();
    const changed =
      current.defaultLanguage !== systemSettings.defaultLanguage ||
      current.systemName !== systemSettings.systemName ||
      current.systemDescription !== systemSettings.systemDescription;
    setIsChanged(changed);
  };

  const { mutateAsync: updateSettings, isPending } = useMutation({
    mutationFn: (values: UpdateSystemSettingsReq) =>
      updateSystemSettings(values),
    onSuccess: async (updatedSettings) => {
      setSystemSettings(updatedSettings);
      await refreshSettings();
      toast.success(t("profile.update-system-settings-success"));
      setIsChanged(false);
    },
    onError: (error: Error) => {
      console.error("Update system settings failed:", error);
    },
  });

  const { mutateAsync: performClearCache, isPending: isClearing } = useMutation({
    mutationFn: () => clearSystemCache(),
    onSuccess: (data) => {
      if (data.success) {
         toast.success(data.message || "Cache cleared successfully");
      } else {
         toast.error(data.message || "Failed to clear cache");
      }
    },
    onError: (error: Error) => {
      console.error("Clear cache failed:", error);
    },
  });

  const handleSubmit = async (values: UpdateSystemSettingsReq) => {
    await updateSettings(values);
  };

  return (
    <div>
      {isPending && <FullPageLoading message={t("profile.loading")} />}
      <h3 className="text-lg font-semibold mb-4">{t("profile.preferences")}</h3>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
      >
        <Form.Item name="defaultLanguage" label={t("profile.default-language")}>
          <Select size="large">
            <Option value="vi">{t("profile.vi")}</Option>
            <Option value="en">{t("profile.en")}</Option>
          </Select>
        </Form.Item>

        <Form.Item name="systemName" label={t("profile.system-name")}>
          <Input
            size="large"
            placeholder={t("profile.system-name-placeholder")}
          />
        </Form.Item>

        <Form.Item
          name="systemDescription"
          label={t("profile.system-description")}
        >
          <TextArea
            rows={3}
            placeholder={t("profile.system-description-placeholder")}
          />
        </Form.Item>
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isPending}
            disabled={!isChanged}
          >
            {t("profile.save-settings")}
          </Button>
        </div>
      </Form>

      <div className="mt-10 border-t pt-6 border-border">
        <h4 className="text-md font-semibold mb-2 text-warning">Tối ưu hiệu suất Server (Bộ nhớ đệm Dữ liệu)</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Xóa toàn bộ Cache trên hệ thống sẽ kích hoạt đồng bộ (Sync) dữ liệu từ phiên bản mới nhất trên Database lên bộ nhớ RAM. Dùng khi bạn thấy dữ liệu bị treo.
        </p>
        <Button 
          loading={isClearing} 
          danger 
          onClick={() => performClearCache()} 
          size="large"
          className="font-semibold shadow-sm border-error text-error hover:bg-error/10"
        >
          Làm sạch & Đồng bộ Cache Hệ thống
        </Button>
      </div>
    </div>
  );
}
