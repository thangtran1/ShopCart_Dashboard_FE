import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/icon";
import { Card, CardContent, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { categoryService } from "@/api/services/category";
import { brandService } from "@/api/services/brands";

interface StatsData {
  activeCategories: number;
  activeBrands: number;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  trend,
  delay = 0
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`} />
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {value.toLocaleString()}
              </h3>
              {trend && (
                <Badge
                  variant={trend.isPositive ? "default" : "destructive"}
                  className="text-xs"
                >
                  <Icon
                    icon={trend.isPositive ? "solar:arrow-up-bold" : "solar:arrow-down-bold"}
                    className="w-3 h-3 mr-1"
                  />
                  {Math.abs(trend.value)}%
                </Badge>
              )}
            </div>
          </div>
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon icon={icon} className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const QuickActionCard = ({
  title,
  description,
  icon,
  color,
  onClick,
  delay = 0
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div
      className="cursor-pointer border rounded-xl hover:border-border transition-all duration-300 group"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-shadow`}>
            <Icon icon={icon} className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <Icon
            icon="solar:arrow-right-bold"
            className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export default function CatalogOverview() {
  const [stats, setStats] = useState<StatsData>({
    activeCategories: 0,
    activeBrands: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch categories data
        const categoriesResponse = await categoryService.getActive();
        const categories = categoriesResponse.data;

        // Fetch brands data
        const brandsResponse = await brandService.getActive();
        const brands = brandsResponse.data;

        setStats({
          activeCategories: categories.length,
          activeBrands: brands.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: "Thêm danh mục mới",
      description: "Tạo danh mục sản phẩm mới cho cửa hàng",
      icon: "solar:add-folder-bold",
      color: "from-green-500 to-emerald-600",
      onClick: () => ({}),
    },
    {
      title: "Thêm thương hiệu",
      description: "Thêm thương hiệu mới vào hệ thống",
      icon: "solar:star-bold",
      color: "from-orange-500 to-red-600",
      onClick: () => ({}),
    },
    {
      title: "Quản lý trạng thái",
      description: "Cập nhật trạng thái danh mục và thương hiệu",
      icon: "solar:settings-bold",
      color: "from-blue-500 to-purple-600",
      onClick: () => ({}),
    },
    {
      title: "Xuất báo cáo",
      description: "Tạo báo cáo thống kê danh mục",
      icon: "solar:document-bold",
      color: "from-purple-500 to-pink-600",
      onClick: () => ({}),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-slate-600 dark:text-slate-400">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground mb-2"
        >
          Thống kê tổng quan
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">

          <StatCard
            title="Danh mục hoạt động"
            value={stats.activeCategories}
            icon="solar:check-circle-bold-duotone"
            color="from-green-500 to-green-600"
            trend={{ value: 8, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="Thương hiệu hoạt động"
            value={stats.activeBrands}
            icon="solar:star-bold-duotone"
            color="from-orange-500 to-orange-600"
            trend={{ value: 8, isPositive: true }}
            delay={0.2}
          />

        </div>
      </div>

      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-foreground mb-2"
        >
          Thao tác nhanh
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action.title}
              {...action}
              delay={0.6 + index * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div>
          <CardTitle className="text-2xl font-bold text-foreground flex items-center">
            Hoạt động gần đây
          </CardTitle>
          <div className="pt-2">
            <div className="space-y-4 border rounded-xl">
              {[
                { action: "Thêm danh mục", item: "Điện thoại & Phụ kiện", time: "2 giờ trước", type: "category" },
                { action: "Cập nhật thương hiệu", item: "Samsung", time: "4 giờ trước", type: "brand" },
                { action: "Xóa danh mục", item: "Sách cũ", time: "1 ngày trước", type: "category" },
                { action: "Thêm thương hiệu", item: "Apple", time: "2 ngày trước", type: "brand" },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors border-b"
                >
                  <div className={`p-2 rounded-md ${activity.type === 'category'
                    ? 'bg-primary/10'
                    : 'bg-success/10'
                    }`}>
                    <Icon
                      icon={activity.type === 'category' ? "solar:folder-bold" : "solar:star-bold"}
                      className={`w-4 h-4 ${activity.type === 'category' ? 'text-primary' : 'text-success'
                        }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {activity.action}: <span className="text-success">{activity.item}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
