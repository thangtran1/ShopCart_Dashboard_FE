import { Button, Modal } from "antd";
import { Switch } from "@/ui/switch";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { useTranslation } from "react-i18next";
import {
  BannerConfig,
  BannerSettings,
  CreateBannerRequest,
} from "@/api/services/bannerApi";

export default function EditCreateModal({
  editingBanner,
  isModalOpen,
  resetForm,
  handleUpdateBanner,
  handleCreate,
  loading,
  formData,
  settings,
  setFormData,
}: {
  editingBanner: BannerConfig | null;
  isModalOpen: boolean;
  resetForm: () => void;
  handleUpdateBanner: () => void;
  handleCreate: () => void;
  loading: boolean;
  formData: CreateBannerRequest;
  setFormData: (data: CreateBannerRequest) => void;
  settings: BannerSettings | null;
}) {
  const { t } = useTranslation();

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-bold border-b border-border pb-2">
          {editingBanner
            ? t("management.banner.edit-banner")
            : t("management.banner.create-banner")}
        </div>
      }
      open={isModalOpen}
      onCancel={resetForm}
      centered
      width={800}
      style={{ maxWidth: '90vw' }}
      footer={[
        <div key="footer" className="flex flex-col-reverse sm:flex-row justify-end gap-2 pb-2">
          <Button
            color="danger" variant="solid"
            size="large"
            onClick={resetForm}
            className="w-full sm:w-auto"
          >
            {t("management.banner.cancel")}
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={editingBanner ? handleUpdateBanner : handleCreate}
            loading={loading}
            disabled={!formData.content.trim()}
          >
            {editingBanner
              ? t("management.banner.update-banner")
              : t("management.banner.create-banner")}
          </Button>
        </div>
      ]}
    >
      <div className="max-h-[75vh] overflow-y-auto py-2 custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">{t("management.banner.banner-content")}</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t("management.banner.banner-order")}</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t("management.banner.banner-status")}</Label>
                <div className="flex items-center gap-3 p-2.5 bg-muted rounded-lg border border-border">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <span className="text-sm font-medium">
                    {formData.isActive ? t("management.banner.active-banner") : t("management.banner.paused-banner")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">{t("management.banner.preview-banner")}</Label>
              <div
                className="rounded-lg p-6 border-2 border-dashed border-gray-300 min-h-[100px] flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: settings?.backgroundColor || "#1890ff",
                  color: settings?.textColor || "#ffffff",
                }}
              >
                <div className="whitespace-nowrap animate-marquee text-sm font-bold uppercase">
                  {formData.content || "PREVIEW CONTENT"}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                {t("management.banner.banner-info")}
              </h4>
              <ul className="text-xs md:text-sm text-blue-800 space-y-2">
                <li>• {t("management.banner.banner-color-description")}</li>
                <li>• Spacing: {settings?.bannerSpacing || 30}px | Speed: {settings?.scrollSpeed || 60}px/s</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
}