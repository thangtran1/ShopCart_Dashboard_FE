import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { productService, type Product, type CreateProductDto } from "@/api/services/product";
import { categoryService, type Category } from "@/api/services/category";
import { brandService, type Brand } from "@/api/services/brands";
import { ProductStatus } from "@/types/enum";
import { toast } from "sonner";
import ProductModal from "./ProductModal";
import ProductDetailModal from "./ProductDetailModal";
import { Button, Input, Select, Popconfirm, Tag, Tooltip, Space } from "antd";
import { PlusCircleOutlined, EyeOutlined, EditOutlined, DeleteOutlined, StarFilled, FireOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";

const { Option } = Select;

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "not-featured">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [limit, setLimit] = useState(10);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts(page, limit, {
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        isFeatured: featuredFilter === "featured" ? true : featuredFilter === "not-featured" ? false : undefined,
      });

      if (response.success) {
        setProducts(response.data.data);
        setTotal(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter, featuredFilter]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getActive();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await brandService.getActive();
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as ProductStatus | "all");
    setPage(1);
  };

  const handleFeaturedFilter = (value: string) => {
    setFeaturedFilter(value as "all" | "featured" | "not-featured");
    setPage(1);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setDetailModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        toast.success("Xóa sản phẩm thành công");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  const handleSaveProduct = async (data: CreateProductDto) => {
    try {
      if (editingProduct) {
        const response = await productService.updateProduct(editingProduct._id, data);
        if (response.success) {
          toast.success("Cập nhật sản phẩm thành công");
        }
      } else {
        const response = await productService.create(data);
        if (response.success) {
          toast.success("Tạo sản phẩm thành công");
        }
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== limit) {
      setLimit(newPageSize);
    }
  };

  const getStatusColor = (status?: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "bg-success text-success-foreground";
      case ProductStatus.INACTIVE:
        return "bg-error text-error-foreground";
      default:
        return "bg-gray text-gray-foreground";
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

  // Table columns definition
  const columns: ColumnsType<Product> = [
    {
      title: "Sản phẩm",
      key: "product",
      width: 350,
      fixed: "left",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            {record.image ? (
              <img
                src={record.image}
                alt={record.name}
                className="w-16 h-16 object-cover rounded-xl border-2 border-border shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <Icon icon="solar:box-bold-duotone" className="w-8 h-8 text-primary" />
              </div>
            )}
            {(record?.discount ?? 0) > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                -{record.discount}%
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate max-w-[200px]" title={record.name}>
              {record.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">SKU: {record.sku || "N/A"}</p>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {record.isNew && (
                <Tag color="blue" className="text-[10px] px-1.5 py-0 m-0 leading-4">
                  <ThunderboltOutlined className="mr-0.5" /> Mới
                </Tag>
              )}
              {record.isFeatured && (
                <Tag color="gold" className="text-[10px] px-1.5 py-0 m-0 leading-4">
                  <StarFilled className="mr-0.5" /> Nổi bật
                </Tag>
              )}
              {record.isBestSeller && (
                <Tag color="volcano" className="text-[10px] px-1.5 py-0 m-0 leading-4">
                  <FireOutlined className="mr-0.5" /> Bán chạy
                </Tag>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục / Thương hiệu",
      key: "category_brand",
      width: 180,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Icon icon="solar:folder-bold-duotone" className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-foreground">{record.category?.name || "—"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon icon="solar:star-bold-duotone" className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-muted-foreground">{record.brand?.name || "—"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      key: "price",
      width: 160,
      render: (_, record) => (
        <div className="space-y-0.5">
          {record.discount && record.discount > 0 ? (
            <>
              <div className="text-sm font-bold text-primary">
                {formatPrice(calculateDiscountedPrice(record.price, record.discount))}
              </div>
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(record.price)}
              </div>
            </>
          ) : (
            <div className="text-sm font-bold text-foreground">{formatPrice(record.price)}</div>
          )}
        </div>
      ),
    },
    {
      title: "Kho",
      key: "stock",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div className="text-center">
          <span
            className={`inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-lg text-sm font-semibold ${(record.stock || 0) > 10
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : (record.stock || 0) > 0
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
          >
            {record.stock || 0}
          </span>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      key: "rating",
      width: 130,
      align: "center",
      render: (_, record) => (
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1">
            <Icon icon="solar:star-bold" className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-foreground">{record.averageRating?.toFixed(1) || "0.0"}</span>
          </div>
          <span className="text-xs text-muted-foreground">({record.reviewCount || 0} đánh giá)</span>
        </div>
      ),
    },
    {
      title: "Lượt xem / Đã bán",
      key: "stats",
      width: 140,
      align: "center",
      render: (_, record) => (
        <div className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Icon icon="solar:eye-bold" className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{record.viewCount || 0}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Icon icon="solar:cart-check-bold" className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">{record.soldCount || 0}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 130,
      align: "center",
      render: (_, record) => (
        <Badge className={getStatusColor(record.status)}>{getStatusText(record.status)}</Badge>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewProduct(record)}
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditProduct(record)}
              className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteProduct(record._id)}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Grid view card component
  const ProductCard = ({ product, index }: { product: Product; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon icon="solar:box-bold-duotone" className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
              -{product.discount}%
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={getStatusColor(product.status)}>{getStatusText(product.status)}</Badge>
          </div>

          {/* Tags */}
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {product.isNew && (
              <span className="bg-blue-500/90 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <ThunderboltOutlined className="text-[10px]" /> Mới
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-amber-500/90 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <StarFilled className="text-[10px]" /> Nổi bật
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-orange-500/90 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <FireOutlined className="text-[10px]" /> Bán chạy
              </span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => handleViewProduct(product)}
              className="transform scale-0 group-hover:scale-100 transition-transform duration-300"
            />
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditProduct(product)}
              className="transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75"
            />
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có chắc muốn xóa sản phẩm này?"
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteProduct(product._id)}
            >
              <Button
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                className="transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-150"
              />
            </Popconfirm>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category & Brand */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {product.category?.name || "Chưa phân loại"}
            </span>
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
              {product.brand?.name || "Không có"}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
            </span>
            {product.discount && product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <Icon icon="solar:star-bold" className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">{product.averageRating?.toFixed(1) || "0.0"}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <Icon icon="solar:eye-bold" className="w-3.5 h-3.5" />
                {product.viewCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Icon icon="solar:cart-check-bold" className="w-3.5 h-3.5" />
                {product.soldCount || 0}
              </span>
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center justify-between text-sm">
            <span >Kho:</span>
            <span
              className={`font-semibold ${(product.stock || 0) > 10
                ? "text-emerald-600 dark:text-emerald-400"
                : (product.stock || 0) > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400"
                }`}
            >
              {product.stock || 0} sản phẩm
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <Icon icon="solar:box-bold-duotone" className="h-7 w-7 text-primary" />
            </div>
            Quản lý Sản phẩm
          </h2>
          <p className="text-muted-foreground ml-14">Tổng cộng {total} sản phẩm</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-all ${viewMode === "table"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon icon="solar:list-bold" className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === "grid"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon icon="solar:widget-5-bold" className="w-5 h-5" />
            </button>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusCircleOutlined />}
            onClick={handleCreateProduct}
            className="bg-primary hover:bg-primary/90"
          >
            Thêm sản phẩm
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border-y py-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-foreground mb-2">Tìm kiếm</label>
            <Input
              placeholder="Tìm theo tên, SKU..."
              value={searchTerm}
              size="large"
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
              allowClear
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Trạng thái</label>
            <Select
              size="large"
              value={statusFilter}
              onChange={handleStatusFilter}
              className="w-full"
            >
              <Option value="all">Tất cả trạng thái</Option>
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

          {/* Featured Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nổi bật</label>
            <Select
              size="large"
              value={featuredFilter}
              onChange={handleFeaturedFilter}
              className="w-full"
            >
              <Option value="all">Tất cả</Option>
              <Option value="featured">
                <div className="flex items-center gap-2">
                  <StarFilled className="text-amber-500" />
                  Nổi bật
                </div>
              </Option>
              <Option value="not-featured">Không nổi bật</Option>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Danh mục</label>
            <Select
              size="large"
              value={categoryFilter}
              onChange={setCategoryFilter}
              className="w-full"
              showSearch
              optionFilterProp="children"
            >
              <Option value="all">Tất cả danh mục</Option>
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Thương hiệu</label>
            <Select
              size="large"
              value={brandFilter}
              onChange={setBrandFilter}
              className="w-full"
              showSearch
              optionFilterProp="children"
            >
              <Option value="all">Tất cả thương hiệu</Option>
              {brands.map((brand) => (
                <Option key={brand._id} value={brand._id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Products Table View */}
      {viewMode === "table" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden"
        >
          <TableAntd
            columns={columns}
            data={products}
            loading={loading}
            pagination={{
              page: page,
              limit: limit,
              total: total,
            }}
            onPageChange={handlePageChange}
            scroll={{ x: 1200 }}
          // onRowClick={(record) => handleViewProduct(record)}
          />
        </motion.div>
      )}

      {/* Products Grid View */}
      {viewMode === "grid" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <span className="text-muted-foreground">Đang tải sản phẩm...</span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2"
            >
              <AnimatePresence>
                {products.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Grid Pagination */}
          {total > limit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="border-0"
                >
                  <Icon icon="solar:arrow-left-bold" className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-muted-foreground">
                    Trang {page} / {Math.ceil(total / limit)}
                  </span>
                </div>

                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(total / limit)}
                  className="border-0"
                >
                  <Icon icon="solar:arrow-right-bold" className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Product Modal */}
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        brands={brands}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={viewingProduct}
        onEdit={() => {
          setDetailModalOpen(false);
          if (viewingProduct) {
            handleEditProduct(viewingProduct);
          }
        }}
        onRefresh={fetchProducts}
      />
    </div>
  );
}
