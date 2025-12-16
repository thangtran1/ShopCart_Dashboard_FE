import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icon";
import { Label } from "@/ui/label";
import { Button, Input, Select, InputNumber, Tabs } from "antd";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Textarea } from "@/ui/textarea";
import { type Category, type CreateCategoryDto } from "@/api/services/category";
import { CategoryStatus } from "@/types/enum";
import { toast } from "sonner";
import { Badge } from "@/ui/badge";

const { Option } = Select;

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateCategoryDto) => void;
  category?: Category | null;
}

export default function CategoryModal({ open, onClose, onSave, category }: CategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: "",
    slug: "",
    description: "",
    image: "",
    status: CategoryStatus.ACTIVE,
    sortOrder: 0,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug || "",
        description: category.description || "",
        image: category.image || "",
        status: category.status || CategoryStatus.ACTIVE,
        sortOrder: category.sortOrder || 0,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: "",
        status: CategoryStatus.ACTIVE,
        sortOrder: 0,
      });
    }
    setActiveTab("basic");
  }, [category, open]);

  const handleInputChange = (field: keyof CreateCategoryDto, value: string | number) => {
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
      toast.error("Vui lòng nhập tên danh mục");
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
          Hình ảnh
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
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="category-modal-tabs"
          />

          <div className="flex-1 overflow-y-auto px-1 pb-4">
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
                        Tên danh mục <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        size="large"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nhập tên danh mục"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Slug (URL)</Label>
                      <Input
                        size="large"
                        value={formData.slug}
                        onChange={(e) => handleInputChange("slug", e.target.value)}
                        placeholder="duong-dan-danh-muc"
                        className="w-full"
                        prefix={<span className="text-muted-foreground">/category/</span>}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Mô tả</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Nhập mô tả cho danh mục"
                      rows={4}
                    />
                  </div>

                  {/* SEO Preview */}
                  <div className="p-4 bg-muted/50 border border-border rounded-xl space-y-2">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Icon icon="solar:eye-bold-duotone" className="w-4 h-4 text-blue-500" />
                      Xem trước SEO
                    </h4>
                    <div className="space-y-1">
                      <div className="text-blue-600 dark:text-blue-400 text-lg font-medium truncate">
                        {formData.name || "Tên danh mục"}
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 text-sm">
                        {`${import.meta.env.VITE_API_URL}/category/${formData.slug || "duong-dan"}`}
                      </div>
                      <div className="text-muted-foreground text-sm line-clamp-2">
                        {formData.description || "Mô tả danh mục sẽ hiển thị ở đây..."}
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
                  {/* Image URL */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Hình ảnh danh mục</Label>
                    <Input
                      size="large"
                      value={formData.image}
                      onChange={(e) => handleInputChange("image", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full"
                      prefix={<Icon icon="solar:link-bold" className="w-4 h-4 text-muted-foreground" />}
                    />
                  </div>

                  {/* Image Preview */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Xem trước</Label>
                    <div className="max-h-60 rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted/50 flex items-center justify-center">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full  auto object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Icon icon="solar:gallery-bold-duotone" className="w-16 h-16 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Chưa có hình ảnh</p>
                          <p className="text-xs mt-1">Nhập URL hình ảnh ở trên để xem trước</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-blue-50 border border-border dark:bg-blue-900/20 rounded-xl">
                    <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-2">
                      Gợi ý
                    </h4>
                    <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                      <li>• Kích thước khuyến nghị: 800x600 pixels</li>
                      <li>• Định dạng: JPG, PNG, WebP</li>
                      <li>• Dung lượng tối đa: 2MB</li>
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
                        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                      >
                        <Option value={CategoryStatus.ACTIVE}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Hoạt động
                          </div>
                        </Option>
                        <Option value={CategoryStatus.INACTIVE}>
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

                  {/* Info Box */}
                  <div className="p-4 bg-muted/50 rounded-xl border border-border space-y-3">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      Thông tin thêm:
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-foreground">Trạng thái:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {formData.status === CategoryStatus.ACTIVE ? <Badge variant="success">Hiển thị</Badge>
                            : <Badge variant="error">Ẩn</Badge>}
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground">Thứ tự:</span>
                        <span className="ml-2 font-medium text-foreground">#{formData.sortOrder || 0}</span>
                      </div>
                    </div>
                    <p className="text-xs text-foreground">
                      Danh mục có thứ tự nhỏ hơn sẽ hiển thị trước.
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
              {loading ? "Đang lưu..." : category ? "Cập nhật" : "Tạo danh mục"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
