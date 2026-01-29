import { useState, useEffect } from "react";
import { Button } from "antd";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useBanner } from "@/hooks/useBanner";
import type { UpdateBannerSettingsRequest } from "@/api/services/bannerApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { FullPageLoading } from "@/components/common/loading";

export default function BannerSettings() {
  const { t } = useTranslation();
  const { settings, settingsLoading, updateSettings, resetSettings } =
    useBanner();

  // Global settings form data - màu sắc, tốc độ, khoảng cách
  const [settingsForm, setSettingsForm] = useState<UpdateBannerSettingsRequest>(
    {
      backgroundColor: "#1890ff",
      textColor: "#ffffff",
      scrollSpeed: 60,
      bannerSpacing: 30,
    }
  );

  // Sync settings form with fetched settings
  useEffect(() => {
    if (settings) {
      setSettingsForm({
        backgroundColor: settings.backgroundColor,
        textColor: settings.textColor,
        scrollSpeed: settings.scrollSpeed,
        bannerSpacing: settings.bannerSpacing,
      });
    }
  }, [settings]);

  const handleUpdateSettings = async () => {
    const success = await updateSettings(settingsForm);
    if (success) {
      toast.success(t("management.banner.update-settings-success"));
    }
  };

  const handleResetSettings = async () => {
    const success = await resetSettings();
    if (success) {
      toast.success(t("management.banner.reset-settings-success"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {settingsLoading ? (
          <FullPageLoading message={t("management.banner.loading-settings")} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground">
                  {t("management.banner.background-color")}
                </Label>
                <div className="flex gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer relative overflow-hidden"
                    style={{
                      backgroundColor: settingsForm.backgroundColor,
                    }}
                  >
                    <input
                      type="color"
                      value={settingsForm.backgroundColor}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <Input
                    value={settingsForm.backgroundColor}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#1890ff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground">
                  {t("management.banner.text-color")}
                </Label>
                <div className="flex gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer relative overflow-hidden"
                    style={{ backgroundColor: settingsForm.textColor }}
                  >
                    <input
                      type="color"
                      value={settingsForm.textColor}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          textColor: e.target.value,
                        })
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <Input
                    value={settingsForm.textColor}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        textColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground">
                  {t("management.banner.scroll-speed")}
                </Label>
                <Input
                  type="number"
                  min="10"
                  max="200"
                  value={settingsForm.scrollSpeed}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      scrollSpeed: parseInt(e.target.value) || 60,
                    })
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Từ 10-200 px/s</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground">
                  {t("management.banner.banner-spacing")}
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={settingsForm.bannerSpacing}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      bannerSpacing: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Từ 0-100 px</p>
              </div>
            </div>

            <div className="my-8">
              <Label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                {t("management.banner.preview-color")}
              </Label>
              <div
                className="rounded-lg p-6 border-2 border-dashed border-border overflow-hidden"
                style={{
                  backgroundColor: settingsForm.backgroundColor,
                  color: settingsForm.textColor,
                }}
              >
                <div className="whitespace-nowrap animate-marquee text-lg font-medium text-center">
                  {t("management.banner.preview-color-description")} •{" "}
                  {t("management.banner.scroll-speed")}:{" "}
                  {settingsForm.scrollSpeed}px/s • Khoảng cách:{" "}
                  {settingsForm.bannerSpacing}px
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                {t("management.banner.settings-info")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {t("management.banner.background-color")}:
                    </span>
                    <span className="font-mono">
                      {settingsForm.backgroundColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {t("management.banner.text-color")}:
                    </span>
                    <span className="font-mono">{settingsForm.textColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {t("management.banner.scroll-speed")}:
                    </span>
                    <span>{settingsForm.scrollSpeed} px/s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {t("management.banner.banner-spacing")}:
                    </span>
                    <span>{settingsForm.bannerSpacing} px</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end py-4">
              <Button
                danger
                size="large"
                onClick={handleResetSettings}
                loading={settingsLoading}
              >
                {t("management.banner.reset-settings")}
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleUpdateSettings}
                loading={settingsLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("management.banner.save-settings")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
