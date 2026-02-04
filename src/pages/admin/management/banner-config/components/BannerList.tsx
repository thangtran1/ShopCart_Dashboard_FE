import { useState, useEffect } from "react";
import { Button, Popconfirm } from "antd";
import { Badge } from "@/ui/badge";
import { Switch } from "@/ui/switch";
import { Input } from "@/ui/input";
import { Icon } from "@/components/icon";
import { useBanner } from "@/hooks/useBanner";
import type {
  BannerConfig,
  CreateBannerRequest,
  UpdateBannerRequest,
} from "@/api/services/bannerApi";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import EditCreateModal from "./Edit-Create-Modal";
import { FullPageLoading } from "@/components/common/loading";
import { EmptyState } from "@/components/common/EmptyState";

export default function BannerList() {
  const { t } = useTranslation();
  const {
    banners,
    loading,
    settings,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBanner,
    updateBannerOrder,
  } = useBanner();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerConfig | null>(null);

  const [formData, setFormData] = useState<CreateBannerRequest>({
    content: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    const handleCreateModalEvent = () => {
      setEditingBanner(null);
      const maxOrder =
        banners.length > 0 ? Math.max(...banners.map((b) => b.order || 0)) : 0;
      setFormData({
        content: "",
        isActive: true,
        order: maxOrder + 1,
      });
      setIsModalOpen(true);
    };

    window.addEventListener("openCreateModal", handleCreateModalEvent);
    return () =>
      window.removeEventListener("openCreateModal", handleCreateModalEvent);
  }, [banners]);

  const resetForm = () => {
    setFormData({ content: "", isActive: true, order: 0 });
    setEditingBanner(null);
    setIsModalOpen(false);
  };

  const handleCreate = async () => {
    if (!formData.content.trim()) {
      toast.error(t("management.banner.banner-content-required"));
      return;
    }
    const success = await createBanner(formData);
    if (success) {
      resetForm();
      toast.success(t("management.banner.create-banner-success"));
    }
  };

  const handleUpdateBanner = async () => {
    if (!editingBanner) return;
    if (!formData.content.trim()) {
      toast.error(t("management.banner.banner-content-required"));
      return;
    }

    const bannerData: UpdateBannerRequest = {
      id: editingBanner.id,
      ...formData,
    };

    const success = await updateBanner(bannerData);
    if (success) {
      resetForm();
      toast.success(t("management.banner.update-banner-success"));
    }
  };

  const handleEdit = (banner: BannerConfig) => {
    setEditingBanner(banner);
    setFormData({
      content: banner.content,
      isActive: banner.isActive,
      order: banner.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteBanner(id);
    if (success) {
      toast.success(t("management.banner.delete-banner-success"));
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    const success = await toggleBanner(id, isActive);
    if (success) {
      fetchBanners();
      toast.success(t("management.banner.toggle-banner-success"));
    }
  };

  const handleOrderChange = async (id: string, newOrder: number) => {
    const success = await updateBannerOrder(id, newOrder);
    if (success) {
      fetchBanners();
      toast.success(t("management.banner.update-banner-order-success"));
    }
  };

  return (
    <div className="space-y-6">
      <EditCreateModal
        settings={settings}
        resetForm={resetForm}
        handleUpdateBanner={handleUpdateBanner}
        handleCreate={handleCreate}
        loading={loading}
        formData={formData}
        setFormData={setFormData}
        editingBanner={editingBanner}
        isModalOpen={isModalOpen}
      />

      {loading ? (
        <FullPageLoading message={t("management.banner.loading-banner")} />
      ) : banners.length === 0 ? (
        <EmptyState
          height="md"
          title="Trống"
          description={t("management.banner.no-banner")}
        />
      ) : (
        <div className="max-h-[650px] overflow-y-auto space-y-4 mb-4">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="border border-border rounded-md p-4 hover:shadow-sm transition"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* LEFT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant={banner.isActive ? "default" : "secondary"}
                      className="gap-1 text-white"
                    >
                      <Icon
                        icon={
                          banner.isActive
                            ? "lucide:play-circle"
                            : "lucide:pause-circle"
                        }
                        className="w-3 h-3"
                      />
                      {banner.isActive
                        ? t("management.banner.active-banner")
                        : t("management.banner.paused-banner")}
                    </Badge>

                    <span className="text-sm text-muted-foreground font-mono">
                      #{banner.order || index + 1}
                    </span>

                    <span className="text-xs text-muted-foreground truncate">
                      ID: {banner.id}
                    </span>
                  </div>

                  <div
                    className="px-4 py-2 rounded-md text-sm mb-3 whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{
                      backgroundColor:
                        settings?.backgroundColor || "#1890ff",
                      color: settings?.textColor || "#ffffff",
                    }}
                  >
                    {banner.content}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon icon="lucide:calendar" className="w-4 h-4" />
                      {t("management.banner.create-banner")}:{" "}
                      {new Date(
                        banner.createdAt || ""
                      ).toLocaleDateString("vi-VN")}
                    </span>

                    {banner.updatedAt && (
                      <span className="flex items-center gap-1">
                        <Icon icon="lucide:edit" className="w-4 h-4" />
                        {t("management.banner.update-banner")}:{" "}
                        {new Date(banner.updatedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="lg:w-[260px] w-full shrink-0">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>{t("management.banner.banner-order")}</span>
                      <Input
                        type="number"
                        min="0"
                        value={banner.order || 0}
                        onChange={(e) =>
                          handleOrderChange(
                            banner.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 h-8 text-center"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>
                        {banner.isActive
                          ? t("management.banner.active-banner")
                          : t("management.banner.paused-banner")}
                      </span>
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={(checked) =>
                          handleToggle(banner.id, checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 pt-3">
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(banner)}
                    >
                      {t("management.banner.update-banner")}
                    </Button>

                    <Popconfirm
                      title={t("management.banner.delete-banner")}
                      description={t(
                        "management.banner.delete-banner-description"
                      )}
                      onConfirm={() => handleDelete(banner.id)}
                      okText={t("management.banner.delete-banner")}
                      cancelText={t("management.banner.cancel")}
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger size="small" icon={<DeleteOutlined />}>
                        {t("management.banner.delete-banner")}
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
