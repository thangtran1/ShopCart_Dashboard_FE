import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { Button, Tabs, Input, Rate, Popconfirm, Empty, Tooltip, Tag } from "antd";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import {
  type Product,
  type ReviewProductDto,
  productService,
} from "@/api/services/product";
import { ProductStatus } from "@/types/enum";
import {
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  StarFilled,
  EyeOutlined,
  ShoppingCartOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { TextArea } = Input;

interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: () => void;
  onRefresh: () => Promise<void> | void;
}

export default function ProductDetailModal({
  open,
  onClose,
  product: initialProduct,
  onEdit,
  onRefresh,
}: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(initialProduct);

  // Sync product khi prop thay đổi
  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    if (open) {
      setActiveTab("overview");
      setSelectedImage(0);
      setReplyingTo(null);
      setReplyContent("");
    }
  }, [open]);

  // Hàm fetch lại product detail mới nhất
  const refreshProductDetail = async () => {
    if (!product?._id) return;
    try {
      const response = await productService.getProductById(product._id);
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error refreshing product:", error);
    }
  };

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  const getStatusColor = (status?: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case ProductStatus.INACTIVE:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status?: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "Hoạt động";
      case ProductStatus.INACTIVE:
        return "Không hoạt động";
      default:
        return "Không xác định";
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setLoadingAction(reviewId);
    try {
      const response = await productService.deleteReview(product._id, reviewId);
      if (response.success) {
        toast.success("Đã xóa đánh giá");
        // Refresh cả local state và parent
        await refreshProductDetail();
        await onRefresh();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Lỗi khi xóa đánh giá");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReplyReview = async (reviewId: string) => {
    if (!replyContent.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi");
      return;
    }

    setLoadingAction(reviewId);
    try {
      const response = await productService.replyToReview(product._id, reviewId, {
        comment: replyContent.trim(),
      });
      if (response.success) {
        toast.success("Đã gửi phản hồi");
        setReplyingTo(null);
        setReplyContent("");
        // Refresh cả local state và parent
        await refreshProductDetail();
        await onRefresh();
      }
    } catch (error) {
      console.error("Error replying to review:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const allImages = [
    { url: product.image, alt: product.name },
    ...(product.images || []),
  ].filter((img) => img?.url);

  const tabConfig = [
    { key: "overview", icon: "solar:document-bold-duotone", label: "Tổng quan" },
    { key: "specs", icon: "solar:settings-bold-duotone", label: "Thông số" },
    { key: "reviews", icon: "solar:star-bold-duotone", label: "Đánh giá", dynamicCount: product.reviewCount || 0 },
  ];

  const tabItems = tabConfig.map(tab => ({
    key: tab.key,
    label: (
      <span className="flex items-center gap-2">
        <Icon icon={tab.icon} className="w-4 h-4" />
        {tab.label}
        {tab.dynamicCount !== undefined && ` (${tab.dynamicCount})`}
      </span>
    ),
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success rounded-xl">
                <Icon icon="solar:box-bold-duotone" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
                <p className="text-sm text-muted-foreground">SKU: {product.sku || "N/A"}</p>
              </div>
            </div>
            <Button type="primary" className="mr-5" icon={<EditOutlined />} onClick={onEdit}>
              Chỉnh sửa
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="product-detail-tabs"
          />

          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Image Gallery */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
                    {allImages[selectedImage]?.url ? (
                      <img
                        src={allImages[selectedImage].url}
                        alt={allImages[selectedImage].alt || product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon
                          icon="solar:box-bold-duotone"
                          className="w-24 h-24 text-muted-foreground/30"
                        />
                      </div>
                    )}

                    {/* Discount Badge */}
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                        -{product.discount}%
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${getStatusColor(product.status)} px-3 py-1`}>
                        {getStatusText(product.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === index
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                            }`}
                        >
                          <img
                            src={img.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {product.isNew && (
                      <Tag color="blue" icon={<ThunderboltOutlined />}>
                        Sản phẩm mới
                      </Tag>
                    )}
                    {product.isFeatured && (
                      <Tag color="gold" icon={<StarFilled />}>
                        Nổi bật
                      </Tag>
                    )}
                    {product.isBestSeller && (
                      <Tag color="volcano" icon={<FireOutlined />}>
                        Bán chạy
                      </Tag>
                    )}
                  </div>

                  {/* Category & Brand */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Icon icon="solar:folder-bold-duotone" className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {product.category?.name || "Chưa phân loại"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <Icon icon="solar:star-bold-duotone" className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        {product.brand?.name || "Không có"}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
                      </span>
                      {product.discount && product.discount > 0 && (
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.discount && product.discount > 0
                        ? `Tiết kiệm ${formatPrice((product.price * product.discount) / 100)}`
                        : "Giá niêm yết"}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-muted/50 rounded-xl text-center">
                      <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                        <StarFilled />
                        <span className="font-bold text-lg">
                          {product.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Đánh giá</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                        <EyeOutlined />
                        <span className="font-bold text-lg">{product.viewCount || 0}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Lượt xem</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl text-center">
                      <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                        <ShoppingCartOutlined />
                        <span className="font-bold text-lg">{product.soldCount || 0}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Đã bán</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl text-center">
                      <div
                        className={`font-bold text-lg ${(product.stock || 0) > 10
                          ? "text-emerald-500"
                          : (product.stock || 0) > 0
                            ? "text-amber-500"
                            : "text-red-500"
                          }`}
                      >
                        {product.stock || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Trong kho</p>
                    </div>
                  </div>

                  {/* Short Description */}
                  {product.shortDescription && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Mô tả ngắn</h4>
                      <p className="text-muted-foreground">{product.shortDescription}</p>
                    </div>
                  )}

                  {/* Description */}
                  {product.description && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Mô tả chi tiết</h4>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                        <p className="whitespace-pre-wrap">{product.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Specs Tab */}
            {activeTab === "specs" && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className=" space-y-6"
              >
                {/* Basic Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Icon icon="solar:box-minimalistic-bold-duotone" className="w-5 h-5 text-primary" />
                      Thông tin vận chuyển
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">Cân nặng:</span>
                        <span className="font-medium text-foreground">{product.weight ? `${product.weight}g` : "—"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">Kích thước:</span>
                        <span className="font-medium text-foreground">
                          {product.dimensions
                            ? `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} cm`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Icon icon="solar:shield-check-bold-duotone" className="w-5 h-5 text-primary" />
                      Bảo hành & Khác
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">Bảo hành:</span>
                        <span className="font-medium text-foreground">
                          {product.warrantyPeriod ? `${product.warrantyPeriod} tháng` : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">Thứ tự hiển thị:</span>
                        <span className="font-medium text-foreground">#{product.sortOrder || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specifications List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Icon icon="solar:clipboard-list-bold-duotone" className="w-5 h-5 text-primary" />
                    Thông số kỹ thuật
                  </h4>
                  {product.specifications && product.specifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.specifications.map((spec, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                        >

                          <span className="text-sm text-foreground">{spec}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Chưa có thông số kỹ thuật"
                    />
                  )}
                </div>

                {/* Timestamps */}
                <div className="flex items-center gap-6 pt-4 border-t border-border text-sm text-foreground">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:calendar-add-bold-duotone" className="w-4 h-4" />
                    <span>
                      Tạo: {product.createdAt ? dayjs(product.createdAt).format("DD/MM/YYYY HH:mm") : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:calendar-mark-bold-duotone" className="w-4 h-4" />
                    <span>
                      Cập nhật:{" "}
                      {product.updatedAt ? dayjs(product.updatedAt).format("DD/MM/YYYY HH:mm") : "—"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className=" space-y-6"
              >
                {/* Reviews Summary */}
                <div className="p-4 bg-gradient-to-r from-success/10 to-success/20 dark:from-success/900/20 dark:to-success/900/20 rounded-xl">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-success dark:text-success-400">
                        {product.averageRating?.toFixed(1) || "0.0"}
                      </div>
                      <Rate disabled value={product.averageRating || 0} allowHalf className="text-sm" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.reviewCount || 0} đánh giá
                      </p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count =
                          product.reviews?.filter((r) => Math.round(r.rating) === star).length || 0;
                        const percentage = product.reviewCount
                          ? (count / product.reviewCount) * 100
                          : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-6">{star}★</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-success rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <ReviewCard
                        key={review._id}
                        review={review}
                        isReplying={replyingTo === review._id}
                        replyContent={replyContent}
                        loadingAction={loadingAction}
                        onToggleReply={() => {
                          if (replyingTo === review._id) {
                            setReplyingTo(null);
                            setReplyContent("");
                          } else {
                            setReplyingTo(review._id);
                          }
                        }}
                        onReplyContentChange={setReplyContent}
                        onDelete={() => handleDeleteReview(review._id)}
                        onSubmitReply={() => handleReplyReview(review._id)}
                      />
                    ))
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Chưa có đánh giá nào"
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Review Card Component
interface ReviewCardProps {
  review: ReviewProductDto;
  isReplying: boolean;
  replyContent: string;
  loadingAction: string | null;
  onToggleReply: () => void;
  onReplyContentChange: (value: string) => void;
  onDelete: () => void;
  onSubmitReply: () => void;
}
function ReviewCard({
  review,
  isReplying,
  replyContent,
  loadingAction,
  onToggleReply,
  onReplyContentChange,
  onDelete,
  onSubmitReply,
}: ReviewCardProps) {
  const isLoading = loadingAction === review._id;
  const [showAllReplies, setShowAllReplies] = useState<Record<string, boolean>>({});
  const visibleReplies = (review: any) => {
    if (!review.replies) return [];
    if (showAllReplies[review._id]) return review.replies;
    return review.replies.slice(0, 2);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border bg-card border-y py-6"

    >
      <div className="flex gap-2">
        <img
          src={`${import.meta.env.VITE_API_URL}/${review.user?.avatar || "uploads/avatar-default.png"}`}
          alt={review.user?.name || "Người dùng"}
          className="w-10 h-10 rounded-full border-2 object-cover"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{review?.user?.name || "Ẩn danh"}</h4>
                <Tag
                  color={review.type === "Đã mua hàng" ? "green" : "default"}
                  className="text-xs"
                >
                  {review.type}
                </Tag>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Rate disabled value={review.rating} className="text-sm" />
                <span className="text-xs text-muted-foreground">
                  {review.createdAt ? dayjs(review.createdAt).fromNow() : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip title="Phản hồi" getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}>
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={onToggleReply}
                  className={isReplying ? "text-primary bg-primary/10" : ""}
                />
              </Tooltip>
              <Popconfirm
                title="Xóa đánh giá"
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                description="Bạn có chắc muốn xóa đánh giá này?"
                onConfirm={onDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Xóa" getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}>

                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    loading={isLoading}
                  />
                </Tooltip>
              </Popconfirm>
            </div>
          </div>

          {/* Review Content */}
          <p className="mt-3 text-foreground whitespace-pre-wrap">{review.comment}</p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {review.images.map((img, index) => (
                <div
                  key={index}
                  className="w-16 h-16 rounded-lg overflow-hidden border border-border"
                >
                  <img src={img} alt={`Review ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}


          {/* Replies */}
          {review.replies && review.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {visibleReplies(review).map((reply: any, index: number) => (
                <div
                  key={reply._id || index}
                  className="pl-4 border-l-2 border-primary/30 ml-2 bg-muted/30 rounded-r-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={reply.isAdmin ? "solar:shield-user-bold-duotone" : "solar:shop-bold-duotone"}
                        className="w-4 h-4 text-success"
                      />
                      <span className="font-medium text-success">
                        {reply.isAdmin ? "Admin" : reply.userName || "Shop"}
                      </span>
                    </div>
                    {reply.createdAt && (
                      <span className="text-xs text-muted-foreground">
                        {dayjs(reply.createdAt).fromNow()}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-foreground">{reply.comment}</p>
                </div>
              ))}

              {/* Nút Xem thêm / Thu gọn */}
              {review.replies.length > 2 && (
                <button
                  onClick={() =>
                    setShowAllReplies((prev) => ({
                      ...prev,
                      [review._id]: !prev[review._id],
                    }))
                  }
                  className="text-sm text-primary hover:underline mt-1"
                >
                  {showAllReplies[review._id] ? "Thu gọn" : "Xem thêm phản hồi"}
                </button>
              )}
            </div>
          )}

          {/* Reply Form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3 overflow-hidden"
              >
                <TextArea
                  value={replyContent}
                  onChange={(e) => onReplyContentChange(e.target.value)}
                  placeholder="Nhập phản hồi của bạn..."
                  rows={3}
                  className="w-full"
                />
                <div className="flex gap-2 justify-end mt-2">
                  <Button onClick={onToggleReply}>Hủy</Button>
                  <Button
                    type="primary"
                    onClick={onSubmitReply}
                    loading={isLoading}
                    disabled={!replyContent.trim()}
                  >
                    Gửi phản hồi
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
