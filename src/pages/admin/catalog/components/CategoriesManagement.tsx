import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { categoryService, type Category, type CreateCategoryDto } from "@/api/services/category";
import { CategoryStatus } from "@/types/enum";
import { toast } from "sonner";
import CategoryModal from "./CategoryModal";
import { Button, Input, Select, Popconfirm, Tooltip, Space } from "antd";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";

const { Option } = Select;

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CategoryStatus | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [limit, setLimit] = useState(10);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories(page, limit, {
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      if (response.success) {
        setCategories(response.data.data);
        setTotal(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Lỗi khi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as CategoryStatus | "all");
    setPage(1);
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await categoryService.deleteCategory(id);
      if (response.success) {
        toast.success("Xóa danh mục thành công");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Lỗi khi xóa danh mục");
    }
  };

  const handleSaveCategory = async (data: CreateCategoryDto) => {
    try {
      if (editingCategory) {
        const response = await categoryService.updateCategory(editingCategory._id, data);
        if (response.success) {
          toast.success("Cập nhật danh mục thành công");
        }
      } else {
        const response = await categoryService.create(data);
        if (response.success) {
          toast.success("Tạo danh mục thành công");
        }
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Lỗi khi lưu danh mục");
    }
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== limit) {
      setLimit(newPageSize);
    }
  };

  const getStatusColor = (status?: CategoryStatus) => {
    switch (status) {
      case CategoryStatus.ACTIVE:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case CategoryStatus.INACTIVE:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status?: CategoryStatus) => {
    switch (status) {
      case CategoryStatus.ACTIVE:
        return "Hoạt động";
      case CategoryStatus.INACTIVE:
        return "Không hoạt động";
      default:
        return "Không xác định";
    }
  };

  // Table columns definition
  const columns: ColumnsType<Category> = [
    {
      title: "Danh mục",
      key: "category",
      width: 350,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            {record.image ? (
              <img
                src={record.image}
                alt={record.name}
                className="w-14 h-14 object-cover rounded-xl border-2 border-border shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center">
                <Icon icon="solar:folder-bold-duotone" className="w-7 h-7 text-blue-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground">{record.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
              {record.slug || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Mô tả",
      key: "description",
      width: 250,
      render: (_, record) => (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {record.description || "Chưa có mô tả"}
        </p>
      ),
    },
    {
      title: "Số sản phẩm",
      key: "productCount",
      width: 130,
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1.5">
          <Icon icon="solar:box-bold" className="w-4 h-4 text-primary" />
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
              onClick={() => handleEditCategory(record)}
              className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc muốn xóa danh mục này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteCategory(record._id)}
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
  const CategoryCard = ({ category, index }: { category: Category; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
        {/* Category Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 overflow-hidden">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon icon="solar:folder-bold-duotone" className="w-20 h-20 text-blue-500/30" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={getStatusColor(category.status)}>{getStatusText(category.status)}</Badge>
          </div>

          {/* Sort Order Badge */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
            #{category.sortOrder || 0}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditCategory(category)}
              className="transform scale-0 group-hover:scale-100 transition-transform duration-300"
            />
            <Popconfirm
              title="Xóa danh mục"
              description="Bạn có chắc muốn xóa danh mục này?"
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteCategory(category._id)}
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

        {/* Category Info */}
        <div className="p-4 space-y-3">
          {/* Category Name */}
          <div>
            <h3 className="font-semibold text-foreground text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">/{category.slug || "—"}</p>
          </div>

          {/* Description */}
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Icon icon="solar:box-bold" className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {category.productCount || 0}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">sản phẩm</span>
            </div>
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
            <Icon icon="solar:folder-bold-duotone" className="w-7 h-7 text-blue-500" />
            Quản lý Danh mục
          </h2>
          <p className="text-muted-foreground mt-1">Tổng cộng {total} danh mục</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-all ${viewMode === "table"
                ? "bg-background text-blue-500 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon icon="solar:list-bold" className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === "grid"
                ? "bg-background text-blue-500 shadow-sm"
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
            onClick={handleCreateCategory}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm danh mục
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Tìm kiếm</label>
            <Input
              placeholder="Tìm kiếm danh mục..."
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
            data={categories}
            loading={loading}
            pagination={{
              page: page,
              limit: limit,
              total: total,
            }}
            onPageChange={handlePageChange}
            scroll={{ x: 900 }}
          />
        </motion.div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <span className="text-muted-foreground">Đang tải danh mục...</span>
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
                {categories.map((category, index) => (
                  <CategoryCard key={category._id} category={category} index={index} />
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

      {/* Category Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
}
