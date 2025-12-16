import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { brandService, type Brand, type CreateBrandDto } from "@/api/services/brands";
import { BrandStatus } from "@/types/enum";
import { toast } from "sonner";
import BrandModal from "./BrandModal";
import { Button, Input, Select, Popconfirm, Tag, Tooltip, Space } from "antd";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, StarFilled, GlobalOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";

const { Option } = Select;

export default function BrandsManagement() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BrandStatus | "all">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "not-featured">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [limit, setLimit] = useState(12);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const response = await brandService.getAllBrands(page, limit, {
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        isFeatured: featuredFilter === "featured" ? true : featuredFilter === "not-featured" ? false : undefined,
      });

      if (response.success) {
        setBrands(response.data.data);
        setTotal(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Lỗi khi tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter, featuredFilter]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as BrandStatus | "all");
    setPage(1);
  };

  const handleFeaturedFilter = (value: string) => {
    setFeaturedFilter(value as "all" | "featured" | "not-featured");
    setPage(1);
  };

  const handleCreateBrand = () => {
    setEditingBrand(null);
    setModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setModalOpen(true);
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      const response = await brandService.deleteBrand(id);
      if (response.success) {
        toast.success("Xóa thương hiệu thành công");
        fetchBrands();
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Lỗi khi xóa thương hiệu");
    }
  };

  const handleSaveBrand = async (data: CreateBrandDto) => {
    try {
      if (editingBrand) {
        const response = await brandService.updateBrand(editingBrand._id, data);
        if (response.success) {
          toast.success("Cập nhật thương hiệu thành công");
        }
      } else {
        const response = await brandService.create(data);
        if (response.success) {
          toast.success("Tạo thương hiệu thành công");
        }
      }
      setModalOpen(false);
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Lỗi khi lưu thương hiệu");
    }
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== limit) {
      setLimit(newPageSize);
    }
  };

  const getStatusColor = (status?: BrandStatus) => {
    switch (status) {
      case BrandStatus.ACTIVE:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case BrandStatus.INACTIVE:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status?: BrandStatus) => {
    switch (status) {
      case BrandStatus.ACTIVE:
        return "Hoạt động";
      case BrandStatus.INACTIVE:
        return "Không hoạt động";
      default:
        return "Không xác định";
    }
  };

  // Table columns definition
  const columns: ColumnsType<Brand> = [
    {
      title: "Thương hiệu",
      key: "brand",
      width: 300,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            {record.logo ? (
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl border-2 border-border p-1.5 flex items-center justify-center">
                <img
                  src={record.logo}
                  alt={record.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-xl flex items-center justify-center">
                <Icon icon="solar:star-bold-duotone" className="w-7 h-7 text-amber-500" />
              </div>
            )}
            {record.isFeatured && (
              <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                <StarFilled className="text-white text-[10px]" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground">{record.name}</h4>
              {record.isFeatured && (
                <Tag color="gold" className="text-[10px] px-1.5 py-0 m-0 leading-4">
                  Nổi bật
                </Tag>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[180px]">
              {record.slug || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      width: 220,
      render: (_, record) => (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {record.description || "Chưa có mô tả"}
        </p>
      ),
    },
    {
      title: "Website",
      key: "website",
      width: 180,
      render: (_, record) =>
        record.website ? (
          <a
            href={record.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <GlobalOutlined className="text-xs" />
            <span className="truncate max-w-[140px]">{record.website.replace(/^https?:\/\//, "")}</span>
          </a>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      title: "Số sản phẩm",
      key: "productCount",
      width: 130,
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1.5">
          <Icon icon="solar:box-bold" className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-foreground">{record.productCount || 0}</span>
        </div>
      ),
    },
    {
      title: "Thứ tự",
      key: "sortOrder",
      width: 100,
      align: "center",
      render: (_, record) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-muted rounded-lg text-sm font-medium">
          #{record.sortOrder || 0}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Badge className={getStatusColor(record.status)}>{getStatusText(record.status)}</Badge>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditBrand(record)}
              className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa thương hiệu"
            description="Bạn có chắc muốn xóa thương hiệu này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteBrand(record._id)}
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
  const BrandCard = ({ brand, index }: { brand: Brand; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
        {/* Brand Logo */}
        <div className="relative aspect-[4/3] bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center p-6">
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <Icon icon="solar:star-bold-duotone" className="w-20 h-20 text-amber-500/30" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={getStatusColor(brand.status)}>{getStatusText(brand.status)}</Badge>
          </div>

          {/* Featured Badge */}
          {brand.isFeatured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <StarFilled className="text-[10px]" /> Nổi bật
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditBrand(brand)}
              className="transform scale-0 group-hover:scale-100 transition-transform duration-300"
            />
            <Popconfirm
              title="Xóa thương hiệu"
              description="Bạn có chắc muốn xóa thương hiệu này?"
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteBrand(brand._id)}
            >
              <Button
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                className="transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75"
              />
            </Popconfirm>
          </div>
        </div>

        {/* Brand Info */}
        <div className="p-4 space-y-3">
          {/* Brand Name */}
          <div>
            <h3 className="font-semibold text-foreground text-lg group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {brand.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">/{brand.slug || "—"}</p>
          </div>

          {/* Description */}
          {brand.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{brand.description}</p>
          )}

          {/* Website */}
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <GlobalOutlined className="text-xs" />
              <span className="truncate">{brand.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Icon icon="solar:box-bold" className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {brand.productCount || 0}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">sản phẩm</span>
            </div>
            <span className="text-xs text-muted-foreground">#{brand.sortOrder || 0}</span>
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
            <Icon icon="solar:star-bold-duotone" className="w-7 h-7 text-amber-500" />
            Quản lý Thương hiệu
          </h2>
          <p className="text-muted-foreground mt-1">Tổng cộng {total} thương hiệu</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-all ${viewMode === "table"
                ? "bg-background text-amber-500 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon icon="solar:list-bold" className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === "grid"
                ? "bg-background text-amber-500 shadow-sm"
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
            onClick={handleCreateBrand}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Thêm thương hiệu
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Tìm kiếm</label>
            <Input
              placeholder="Tìm kiếm thương hiệu..."
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
        </div>
      </motion.div>

      {/* Table View */}
      {viewMode === "table" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card overflow-hidden"
        >
          <TableAntd
            columns={columns}
            data={brands}
            loading={loading}
            pagination={{
              page: page,
              limit: limit,
              total: total,
            }}
            onPageChange={handlePageChange}
            scroll={{ x: 1000 }}
          />
        </motion.div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
                <span className="text-muted-foreground">Đang tải thương hiệu...</span>
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
                {brands.map((brand, index) => (
                  <BrandCard key={brand._id} brand={brand} index={index} />
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

      {/* Brand Modal */}
      <BrandModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveBrand}
        brand={editingBrand}
      />
    </div>
  );
}
