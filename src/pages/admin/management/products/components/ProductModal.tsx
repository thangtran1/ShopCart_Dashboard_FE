import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icon";
import { Label } from "@/ui/label";
import { Button, Input, Select, InputNumber, Switch, Tabs } from "antd";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Textarea } from "@/ui/textarea";
import { type Product, type CreateProductDto, type ProductImageDto } from "@/api/services/product";
import { type Category } from "@/api/services/category";
import { type Brand } from "@/api/services/brands";
import { ProductStatus, ProductType } from "@/types/enum";
import { PlusOutlined, DeleteOutlined, DragOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { formatPrice, parsePrice } from "@/utils/format-number";

const { Option } = Select;

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateProductDto) => void;
  product?: Product | null;
  categories: Category[];
  brands: Brand[];
}

export default function ProductModal({
  open,
  onClose,
  onSave,
  product,
  categories,
  brands,
}: ProductModalProps) {
  const productTypes = Object.values(ProductType);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    productType: "",
    slug: "",
    price: 0,
    discount: 0,
    description: "",
    shortDescription: "",
    image: "",
    images: [],
    category: "",
    brand: "",
    stock: 0,
    status: ProductStatus.ACTIVE,
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    specifications: [],
    warrantyPeriod: 0,
    sku: "",
    weight: 0,
    dimensions: undefined,
    tags: [],
    sortOrder: 0,
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [newTag, setNewTag] = useState("");
  const [newSpec, setNewSpec] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        productType: product.productType,
        slug: product.slug || "",
        price: product.price,
        discount: product.discount || 0,
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        image: product.image || "",
        images: product.images || [],
        category: product.category?._id || "",
        brand: product.brand?._id || "",
        stock: product.stock || 0,
        status: product.status || ProductStatus.ACTIVE,
        isNew: product.isNew || false,
        isFeatured: product.isFeatured || false,
        isBestSeller: product.isBestSeller || false,
        specifications: product.specifications || [],
        warrantyPeriod: product.warrantyPeriod || 0,
        sku: product.sku || "",
        weight: product.weight || 0,
        dimensions: product.dimensions,
        tags: product.tags || [],
        sortOrder: product.sortOrder || 0,
      });
    } else {
      setFormData({
        name: "",
        productType: "",
        slug: "",
        price: 0,
        discount: 0,
        description: "",
        shortDescription: "",
        image: "",
        images: [],
        category: "",
        brand: "",
        stock: 0,
        status: ProductStatus.ACTIVE,
        isNew: false,
        isFeatured: false,
        isBestSeller: false,
        specifications: [],
        warrantyPeriod: 0,
        sku: "",
        weight: 0,
        dimensions: undefined,
        tags: [],
        sortOrder: 0,
      });
    }
    setActiveTab("basic");
  }, [product, open]);

  const handleInputChange = (field: keyof CreateProductDto, value: unknown) => {
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

  const handleDimensionChange = (field: "length" | "width" | "height", value: number) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        length: field === "length" ? value : prev.dimensions?.length || 0,
        width: field === "width" ? value : prev.dimensions?.width || 0,
        height: field === "height" ? value : prev.dimensions?.height || 0,
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleAddSpec = () => {
    if (newSpec.trim() && !formData.specifications?.includes(newSpec.trim())) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...(prev.specifications || []), newSpec.trim()],
      }));
      setNewSpec("");
    }
  };

  const handleRemoveSpec = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications?.filter((s) => s !== spec) || [],
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      const newImage: ProductImageDto = {
        url: newImageUrl.trim(),
        sortOrder: (formData.images?.length || 0) + 1,
      };
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImage],
      }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!formData.productType) {
      toast.error("Vui lòng chọn loại sản phẩm");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Giá sản phẩm phải lớn hơn 0");
      return;
    }
    if (!formData.category) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }
    if (!formData.brand) {
      toast.error("Vui lòng chọn thương hiệu");
      return;
    }

    setLoading(true);

    try {
      // Clone dữ liệu và xóa _id trong dimensions
      const payload = {
        ...formData,
        dimensions: formData.dimensions
          ? {
            length: formData.dimensions.length,
            width: formData.dimensions.width,
            height: formData.dimensions.height,
          }
          : undefined,
      };

      await onSave(payload);
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
      key: "pricing",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="solar:tag-price-bold-duotone" className="w-4 h-4" />
          Giá & Kho
        </span>
      ),
    },
    {
      key: "attributes",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="solar:settings-bold-duotone" className="w-4 h-4" />
          Thuộc tính
        </span>
      ),
    },
    {
      key: "seo",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="solar:tag-bold-duotone" className="w-4 h-4" />
          Tags & SEO
        </span>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-2xl text-foreground">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="product-modal-tabs"
          />

          <div className="flex-1 overflow-y-auto pb-3">
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
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        size="large"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nhập tên sản phẩm"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Slug (URL)</Label>
                      <Input
                        size="large"
                        value={formData.slug}
                        onChange={(e) => handleInputChange("slug", e.target.value)}
                        placeholder="duong-dan-san-pham"
                        className="w-full"
                        prefix={<span className="text-muted-foreground">/products/</span>}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-1">
                      Loại sản phẩm <span className="text-red-500">*</span>
                    </Label>

                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode} // Lấy container cha của trigger để popup không bị lệch
                      size="large"
                      value={formData.productType || undefined}
                      onChange={(value) => handleInputChange("productType", value)}
                      placeholder="Chọn loại sản phẩm"
                      className="w-full"
                    >
                      {productTypes.map((type) => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Category & Brand */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-1">
                        Danh mục <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        size="large"
                        value={formData.category || undefined}
                        onChange={(value) => handleInputChange("category", value)}
                        placeholder="Chọn danh mục"
                        className="w-full"
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        options={categories.map((cat) => ({
                          value: cat._id,
                          label: cat.name,
                        }))}
                        optionRender={(option) => (
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:folder-bold-duotone" className="w-4 h-4 text-blue-500" />
                            {option.label}
                          </div>
                        )}
                        notFoundContent={
                          <div className="text-center py-4 text-muted-foreground">
                            <Icon icon="solar:folder-bold-duotone" className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Không tìm thấy danh mục</p>
                          </div>
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-1">
                        Thương hiệu <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode} // Lấy container cha của trigger để popup không bị lệch
                        size="large"
                        value={formData.brand || undefined}
                        onChange={(value) => handleInputChange("brand", value)}
                        placeholder="Chọn thương hiệu"
                        className="w-full"
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        options={brands.map((brand) => ({
                          value: brand._id,
                          label: brand.name,
                        }))}
                        optionRender={(option) => (
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:star-bold-duotone" className="w-4 h-4 text-amber-500" />
                            {option.label}
                          </div>
                        )}
                        notFoundContent={
                          <div className="text-center py-4 text-muted-foreground">
                            <Icon icon="solar:star-bold-duotone" className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Không tìm thấy thương hiệu</p>
                          </div>
                        }
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Mô tả ngắn</Label>
                    <Textarea
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                      placeholder="Mô tả ngắn gọn về sản phẩm (hiển thị trên danh sách)"
                      rows={2}
                    />
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Mô tả chi tiết</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Mô tả chi tiết sản phẩm (hỗ trợ markdown)"
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Hỗ trợ định dạng Markdown: **bold**, *italic*, # heading, - list, etc.
                    </p>
                  </div>

                  {/* Status Switches */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 border border-border rounded-xl">
                    <div className="flex items-center justify-evenly gap-2">
                      <Label className="text-sm font-medium text-foreground">Trạng thái</Label>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        size="middle"
                        value={formData.status}
                        onChange={(value) => handleInputChange("status", value)}
                        className="w-32"
                      >
                        <Option value={ProductStatus.ACTIVE}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Hoạt động
                          </div>
                        </Option>
                        <Option value={ProductStatus.INACTIVE}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            Không hoạt động
                          </div>
                        </Option>
                      </Select>
                    </div>

                    <div className="flex items-center justify-evenly">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Icon icon="solar:star-bold" className="w-4 h-4 text-amber-500" />
                        Nổi bật
                      </Label>
                      <Switch
                        checked={formData.isFeatured}
                        onChange={(checked) => handleInputChange("isFeatured", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-evenly">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Icon icon="solar:bolt-bold" className="w-4 h-4 text-blue-500" />
                        Mới
                      </Label>
                      <Switch
                        checked={formData.isNew}
                        onChange={(checked) => handleInputChange("isNew", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-evenly">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Icon icon="solar:fire-bold" className="w-4 h-4 text-orange-500" />
                        Bán chạy
                      </Label>
                      <Switch
                        checked={formData.isBestSeller}
                        onChange={(checked) => handleInputChange("isBestSeller", checked)}
                      />
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
                  {/* Main Image */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Ảnh đại diện</Label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          size="large"
                          value={formData.image}
                          onChange={(e) => handleInputChange("image", e.target.value)}
                          placeholder="URL hình ảnh chính"
                          className="w-full"
                        />
                      </div>
                      {formData.image && (
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border overflow-hidden flex-shrink-0">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Thư viện ảnh</Label>

                    {/* Add Image Input */}
                    <div className="flex gap-2">
                      <Input
                        size="large"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Nhập URL hình ảnh"
                        className="flex-1"
                        onPressEnter={handleAddImage}
                      />
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddImage}
                        size="large"
                      >
                        Thêm
                      </Button>
                    </div>

                    {/* Images Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.images?.map((img, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group aspect-square rounded-xl border-2 border-border overflow-hidden"
                        >
                          <img
                            src={img.url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              type="text"
                              icon={<DragOutlined />}
                              className="text-white hover:text-white/80"
                              size="small"
                            />
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveImage(index)}
                              className="text-white hover:text-red-400"
                              size="small"
                            />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                            #{index + 1}
                          </div>
                        </motion.div>
                      ))}

                      {/* Add Image Placeholder */}
                      <div
                        className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors"
                        onClick={() => document.getElementById("new-image-input")?.focus()}
                      >
                        <Icon icon="solar:gallery-add-bold-duotone" className="w-8 h-8 mb-1" />
                        <span className="text-xs">Thêm ảnh</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pricing Tab */}
              {activeTab === "pricing" && (
                <motion.div
                  key="pricing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Price & Discount */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-1">
                        Giá gốc <span className="text-red-500">*</span>
                      </Label>
                      <InputNumber
                        size="large"
                        value={formData.price}
                        onChange={(value) => handleInputChange("price", value || 0)}
                        formatter={(value) => formatPrice(value as number)}
                        parser={(value) => parsePrice(value)}
                        placeholder="0"
                        className="w-full"
                        min={0}
                        addonAfter="₫"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Giảm giá (%)</Label>
                      <InputNumber
                        size="large"
                        value={formData.discount}
                        onChange={(value) => handleInputChange("discount", value || 0)}
                        placeholder="0"
                        className="w-full"
                        min={0}
                        max={100}
                        addonAfter="%"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Giá sau giảm</Label>
                      <div className="h-10 flex items-center px-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {formatPrice(
                            formData.price - (formData.price * (formData.discount || 0)) / 100
                          )}{" "}
                          ₫
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock & SKU */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Số lượng trong kho</Label>
                      <InputNumber
                        size="large"
                        value={formData.stock}
                        onChange={(value) => handleInputChange("stock", value || 0)}
                        placeholder="0"
                        className="w-full"
                        min={0}
                        addonAfter="sản phẩm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Mã SKU</Label>
                      <Input
                        size="large"
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        placeholder="VD: SP-001"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Weight & Dimensions */}
                  <div className="p-4 bg-muted/50 rounded-xl space-y-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Icon icon="solar:box-minimalistic-bold-duotone" className="w-5 h-5 text-primary" />
                      Thông tin vận chuyển
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Cân nặng</Label>
                        <InputNumber
                          size="large"
                          value={formData.weight}
                          onChange={(value) => handleInputChange("weight", value || 0)}
                          placeholder="0"
                          className="w-full"
                          min={0}
                          addonAfter="g"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Chiều dài</Label>
                        <InputNumber
                          size="large"
                          value={formData.dimensions?.length || 0}
                          onChange={(value) => handleDimensionChange("length", value || 0)}
                          placeholder="0"
                          className="w-full"
                          min={0}
                          addonAfter="cm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Chiều rộng</Label>
                        <InputNumber
                          size="large"
                          value={formData.dimensions?.width || 0}
                          onChange={(value) => handleDimensionChange("width", value || 0)}
                          placeholder="0"
                          className="w-full"
                          min={0}
                          addonAfter="cm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Chiều cao</Label>
                        <InputNumber
                          size="large"
                          value={formData.dimensions?.height || 0}
                          onChange={(value) => handleDimensionChange("height", value || 0)}
                          placeholder="0"
                          className="w-full"
                          min={0}
                          addonAfter="cm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Warranty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Thời gian bảo hành</Label>
                      <InputNumber
                        size="large"
                        value={formData.warrantyPeriod}
                        onChange={(value) => handleInputChange("warrantyPeriod", value || 0)}
                        placeholder="0"
                        className="w-full"
                        min={0}
                        addonAfter="tháng"
                      />
                    </div>

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
                </motion.div>
              )}

              {/* Attributes Tab */}
              {activeTab === "attributes" && (
                <motion.div
                  key="attributes"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Specifications */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Thông số kỹ thuật</Label>

                    <div className="flex gap-2">
                      <Input
                        size="large"
                        value={newSpec}
                        onChange={(e) => setNewSpec(e.target.value)}
                        placeholder="VD: RAM: 8GB, Màn hình: 15.6 inch..."
                        className="flex-1"
                        onPressEnter={handleAddSpec}
                      />
                      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSpec} size="large">
                        Thêm
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {formData.specifications?.map((spec, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-lg group"
                        >
                          <span className="flex-1 text-sm text-foreground">{spec}</span>
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveSpec(spec)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </motion.div>
                      ))}
                    </div>

                    {(!formData.specifications || formData.specifications.length === 0) && (
                      <div className="text-center py-6 text-foreground border-2 border-dashed border-border rounded-lg">
                        <p className="text-sm">Chưa có thông số kỹ thuật nào</p>
                        <p className="text-xs mt-1 text-muted-foreground">Thông số kỹ thuật giúp người dùng hiểu rõ hơn về sản phẩm</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tags & SEO Tab */}
              {activeTab === "seo" && (
                <motion.div
                  key="seo"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Tags */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Tags</Label>

                    <div className="flex gap-2">
                      <Input
                        size="large"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Nhập tag và nhấn Enter"
                        className="flex-1"
                        onPressEnter={handleAddTag}
                      />
                      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTag} size="large">
                        Thêm
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.tags?.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          <Icon icon="solar:tag-bold" className="w-3.5 h-3.5" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-500 transition-colors"
                          >
                            <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                          </button>
                        </motion.span>
                      ))}
                    </div>

                    {(!formData.tags || formData.tags.length === 0) && (
                      <div className="text-center py-6 text-foreground border-2 border-dashed border-border rounded-lg">
                        <p className="text-sm">Chưa có tag nào</p>
                        <p className="text-xs mt-1 text-muted-foreground">Tags giúp người dùng tìm kiếm sản phẩm dễ dàng hơn</p>
                      </div>
                    )}
                  </div>

                  {/* SEO Preview */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Xem trước SEO</Label>
                    <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                      <div className="text-blue-600 dark:text-blue-400 text-lg font-medium truncate">
                        {formData.name || "Tên sản phẩm"}
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 text-sm">

                        {`${import.meta.env.VITE_API_URL}/products/${formData.slug || "duong-dan"}`}
                      </div>
                      <div className="text-muted-foreground text-sm line-clamp-2">
                        {formData.shortDescription || formData.description || "Mô tả sản phẩm sẽ hiển thị ở đây..."}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 justify-end">
            <Button size="large" danger onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              {loading ? "Đang lưu..." : product ? "Cập nhật" : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
