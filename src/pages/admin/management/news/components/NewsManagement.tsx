"use client";

import { useState, useMemo } from "react";
import { useNews } from "@/hooks/useNews";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";
import dayjs from "dayjs";

import NewsModal from "./NewsModal";
import NewsFilters from "./NewsFilters";
import { CardTitle } from "@/ui/card";
import { Icon } from "@/components/icon";
import { Separator } from "@/ui/separator";
import { Badge } from "@/ui/badge";
import { INews, INewsFilters } from "@/api/services/newsApi";

const initialFilters: INewsFilters = {
  page: 1,
  limit: 10,
  search: "",
  category: "",
};

export default function NewsManagement() {
  const { useAdminNews, deleteNews } = useNews();
  const [filters, setFilters] = useState<INewsFilters>(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<INews | null>(null);

  const { data: adminData, isLoading } = useAdminNews(filters);

  const dataSource = adminData?.data || [];
  const total = adminData?.total || 0;

  const handleFilterChange = (key: keyof INewsFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleOpenAddModal = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: INews) => {
    setEditingNews(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteNews(id);
  };

  const columns: ColumnsType<INews> = useMemo(
    () => [
      {
        title: "Bài viết",
        key: "news",
        width: 350,
        render: (_, record) => (
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0 w-16 h-10 overflow-hidden rounded-lg border border-border shadow-sm bg-muted">
              <img
                src={record.thumbnail}
                alt={record.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-foreground line-clamp-1 leading-tight">
                {record.title}
              </span>
              <span className="text-[10px] text-muted-foreground truncate italic">
                {record.slug}
              </span>
            </div>
          </div>
        ),
      },
      {
        title: "Danh mục",
        dataIndex: "category",
        width: 140,
        render: (category: string) => (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase text-[10px]">
            {category || "Chưa phân loại"}
          </Badge>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "isPublished",
        width: 130,
        align: "center",
        render: (isPublished: boolean) => (
          isPublished ? (
            <Badge variant="success" className="gap-1">
              CÔNG KHAI
            </Badge>
          ) : (
            <Badge variant="outline">BẢN NHÁP</Badge>
          )
        ),
      },
      {
        title: "Thống kê",
        key: "stats",
        width: 150,
        render: (_, record) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-foreground">
              <EyeOutlined className="text-primary" />
              <span>{record.views?.toLocaleString()} lượt xem</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-foreground">
              <FileTextOutlined />
              <span>{record.tags?.length || 0} thẻ (tags)</span>
            </div>
          </div>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        width: 140,
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        render: (date) => (
          <div className="flex flex-col text-muted-foreground">
            <span className="text-xs font-semibold text-foreground">
              {dayjs(date).format("DD/MM/YYYY")}
            </span>
            <span className="text-[10px]">
              {dayjs(date).format("HH:mm")}
            </span>
          </div>
        ),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 120,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                size="small"
                className="text-indigo-600 hover:bg-indigo-50 rounded-lg"
                icon={<EditOutlined className="text-lg" />}
                onClick={() => handleOpenEditModal(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Xóa bài viết?"
              description="Hành động này sẽ xóa vĩnh viễn dữ liệu."
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true, className: "bg-rose-500" }}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined className="text-lg" />}
              />
            </Popconfirm>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="py-4">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon icon="lucide:newspaper" className="h-7 w-7 text-primary" />
              Quản lý Tin tức
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Sáng tạo nội dung, quản lý bài viết và theo dõi lượt tương tác của độc giả.
            </p>
          </div>

          <div className="mt-3 md:mt-0">
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              size="large"
              className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md font-bold transition-all hover:-translate-y-0.5"
              onClick={handleOpenAddModal}
            >
              Đăng bài mới
            </Button>
          </div>
        </div>


        <Separator />

        <NewsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="mt-4 overflow-hidden">
          <TableAntd
            columns={columns}
            data={dataSource}
            loading={isLoading}
            pagination={{
              page: filters.page,
              limit: filters.limit,
              total,
            }}
            onPageChange={(p, l) => {
              setFilters((prev) => ({
                ...prev,
                page: p,
                limit: l || prev.limit,
              }));
            }}
          />
        </div>
      </div>

      <NewsModal
        open={isModalOpen}
        news={editingNews}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}