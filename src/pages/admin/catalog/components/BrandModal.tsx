import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icon";
import { Label } from "@/ui/label";
import { Button, Input, Select, InputNumber, Switch, Tabs } from "antd";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Textarea } from "@/ui/textarea";
import { type Brand, type CreateBrandDto } from "@/api/services/brands";
import { BrandStatus } from "@/types/enum";
import { toast } from "sonner";
import { StarFilled, GlobalOutlined } from "@ant-design/icons";
import { Badge } from "@/ui/badge";

const { Option } = Select;

interface BrandModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateBrandDto) => void;
  brand?: Brand | null;
}

export default function BrandModal({ open, onClose, onSave, brand }: BrandModalProps) {
  const [formData, setFormData] = useState<CreateBrandDto>({
    name: "",
    slug: "",
    description: "",
    logo: "",
    website: "",
    status: BrandStatus.ACTIVE,
    sortOrder: 0,
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        slug: brand.slug || "",
        description: brand.description || "",
        logo: brand.logo || "",
        website: brand.website || "",
        status: brand.status || BrandStatus.ACTIVE,
        sortOrder: brand.sortOrder || 0,
        isFeatured: brand.isFeatured || false,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        logo: "",
        website: "",
        status: BrandStatus.ACTIVE,
        sortOrder: 0,
        isFeatured: false,
      });
    }
    setActiveTab("basic");
  }, [brand, open]);

  const handleInputChange = (field: keyof CreateBrandDto, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from name
    if (field === "name" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên thương hiệu");
      return;
    }

    setLoading(true);

    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "basic",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="solar:document-bold-duotone" className="w-4 h-4" />
          Thông tin cơ bản
        </span>
      ),
    },
    {
      key: "media",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="solar:gallery-bold-duotone" className="w-4 h-4" />
          Logo & Website
        </span>
      ),
    },
    {
      key: "settings",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="solar:settings-bold-duotone" className="w-4 h-4" />
          Cài đặt
        </span>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-2xl text-foreground">
            {brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="brand-modal-tabs"
          />

          <div className="flex-1 overflow-y-auto px-1 py-4">
            <AnimatePresence mode="wait">
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Name & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-1">
                        Tên thương hiệu <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        size="large"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nhập tên thương hiệu"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Slug (URL)</Label>
                      <Input
                        size="large"
                        value={formData.slug}
                        onChange={(e) => handleInputChange("slug", e.target.value)}
                        placeholder="duong-dan-thuong-hieu"
                        className="w-full"
                        prefix={<span className="text-muted-foreground">/brand/</span>}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Mô tả</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Nhập mô tả cho thương hiệu"
                      rows={4}
                    />
                  </div>

                  {/* SEO Preview */}
                  <div className="p-4 bg-muted/50 border border-border rounded-xl space-y-2">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      Xem trước SEO
                    </h4>
                    <div className="space-y-1">
                      <div className="text-amber-600 dark:text-amber-400 text-lg font-medium truncate">
                        {formData.name || "Tên thương hiệu"}
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 text-sm">
                        {`${import.meta.env.VITE_API_URL}/brand/${formData.slug || "duong-dan"}`}
                      </div>
                      <div className="text-muted-foreground text-sm line-clamp-2">
                        {formData.description || "Mô tả thương hiệu sẽ hiển thị ở đây..."}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Media Tab */}
              {activeTab === "media" && (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Logo URL */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Logo thương hiệu</Label>
                    <Input
                      size="large"
                      value={formData.logo}
                      onChange={(e) => handleInputChange("logo", e.target.value)}
                      placeholder="https://example.com/logo.jpg"
                      className="w-full"
                      prefix={<Icon icon="solar:link-bold" className="w-4 h-4 text-muted-foreground" />}
                    />
                  </div>

                  {/* Logo Preview */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Xem trước logo</Label>
                    <div className="max-h-60 rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted/50 flex items-center justify-center">

                      {formData.logo ? (
                        <img
                          src={formData.logo}
                          alt="Logo Preview"
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-center text-foreground py-4">
                          <p className="text-sm text-foreground">Chưa có logo</p>
                          <p className="text-xs mt-1 text-muted-foreground">Nhập URL logo ở trên để xem trước</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Website</Label>
                    <Input
                      size="large"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://example.com"
                      className="w-full"
                      prefix={<GlobalOutlined className="text-muted-foreground" />}
                    />
                    {formData.website && (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Truy cập website
                      </a>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-amber-50 border border-border dark:bg-amber-900/20 rounded-xl">
                    <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 flex items-center gap-2 mb-2">
                      <Icon icon="solar:info-circle-bold" className="w-4 h-4" />
                      Gợi ý
                    </h4>
                    <ul className="text-xs text-amber-600 dark:text-amber-400 space-y-1">
                      <li>• Logo nên có nền trong suốt (PNG)</li>
                      <li>• Kích thước khuyến nghị: 400x200 pixels</li>
                      <li>• Website phải bắt đầu bằng https://</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Trạng thái</Label>
                      <Select
                        size="large"
                        value={formData.status}
                        onChange={(value) => handleInputChange("status", value)}
                        className="w-full"
                      >
                        <Option value={BrandStatus.ACTIVE}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Hoạt động
                          </div>
                        </Option>
                        <Option value={BrandStatus.INACTIVE}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            Không hoạt động
                          </div>
                        </Option>
                      </Select>
                    </div>

                    {/* Sort Order */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Thứ tự hiển thị</Label>
                      <InputNumber
                        size="large"
                        value={formData.sortOrder}
                        onChange={(value) => handleInputChange("sortOrder", value || 0)}
                        placeholder="0"
                        className="w-full"
                        min={0}
                      />
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-border dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                          <StarFilled className="text-amber-500" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-foreground">Thương hiệu nổi bật</Label>
                          <p className="text-xs text-foreground mt-0.5">
                            Hiển thị thương hiệu trong danh sách nổi bật
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.isFeatured}
                        onChange={(checked) => handleInputChange("isFeatured", checked)}
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-muted/50 border border-border rounded-xl space-y-3">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      Thông tin thêm:
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-foreground">Trạng thái:</span>
                        <span className="ml-2 font-medium">
                          {formData.status === BrandStatus.ACTIVE ? <Badge variant="success">Hiển thị</Badge> : <Badge variant="error">Ẩn</Badge>}
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground">Thứ tự:</span>
                        <span className="ml-2 font-medium text-foreground">#{formData.sortOrder || 0}</span>
                      </div>
                      <div>
                        <span className="text-foreground">Nổi bật:</span>
                        <span className="ml-2 font-medium text-foreground">{formData.isFeatured ? <Badge variant="success">Có</Badge> : <Badge variant="error">Không</Badge>}</span>
                      </div>
                    </div>
                    <p className="text-xs text-foreground">
                      Thương hiệu có thứ tự nhỏ hơn sẽ hiển thị trước.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border mt-auto justify-end">
            <Button size="large" danger onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              {loading ? "Đang lưu..." : brand ? "Cập nhật" : "Tạo thương hiệu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
