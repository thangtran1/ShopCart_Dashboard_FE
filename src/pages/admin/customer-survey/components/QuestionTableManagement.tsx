"use client";

import { useState, useMemo, useEffect } from "react";
import { Button, Popconfirm, Tooltip, Tag } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableAntd from "@/components/common/tables/custom-table-antd";
import dayjs from "dayjs";

import { useCustomerSurvey } from "@/hooks/user-customer-survey";
import { SurveyFilters } from "@/api/services/customer-survey";
import CustomerSurveyFilters from "./CustomerSurveyFilters";
import QuestionDetailModal from "./QuestionDetailModal";
import { Separator } from "@/ui/separator";

const initialFilters: SurveyFilters = {
  page: 1,
  limit: 10,
  search: "",
};

export default function QuestionTableManagement({ addTrigger }: { addTrigger?: number }) {
  const { useQuestions, deleteQuestion } = useCustomerSurvey();
  const [filters, setFilters] = useState<SurveyFilters>(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

  const { data: questionData, isLoading } = useQuestions(filters);

  const dataSource = questionData?.data?.data || [];
  const total = questionData?.data.total || 0;

  useEffect(() => {
    if (addTrigger && addTrigger > 0) {
      handleOpenAddModal();
    }
  }, [addTrigger]);

  const handleFilterChange = (key: keyof SurveyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: any) => {
    setEditingQuestion(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteQuestion(id);
  };

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "THỨ TỰ",
        dataIndex: "order",
        width: 80,
        align: "center",
        render: (order) => <b className="text-primary">#{order}</b>,
      },
      {
        title: 'Loại câu hỏi',
        dataIndex: 'type',
        key: 'type',
        render: (type: string) => (
          <Tag color={type === 'multiple' ? 'blue' : 'green'}>
            {type === 'multiple' ? 'Chọn nhiều' : 'Chọn một'}
          </Tag>
        ),
      },
      {
        title: "CÂU HỎI KHẢO SÁT",
        key: "question",
        width: 400,
        render: (_, record) => (
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <QuestionCircleOutlined className="text-indigo-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-foreground leading-tight">
                {record.title}
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-1 italic mt-1">
                Loại: {record.type === 'multiple' ? 'Chọn nhiều' : 'Chọn một'}
              </span>
            </div>
          </div>
        ),
      },
      {
        title: "CÁC LỰA CHỌN",
        dataIndex: "options",
        width: 300,
        render: (options: string[]) => (
          <div className="flex flex-wrap gap-1">
            {options?.map((opt, index) => (
              <Tag key={index} className="text-[10px] bg-slate-100 border-none rounded-md">
                {opt}
              </Tag>
            ))}
          </div>
        ),
      },
      {
        title: "NGÀY TẠO",
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
        title: "THAO TÁC",
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
              title="Xóa câu hỏi này?"
              description="Hành động này sẽ ảnh hưởng đến dữ liệu báo cáo cũ."
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
    <div>
      <div className="space-y-6">
          <CustomerSurveyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            placeholder="Tìm kiếm tiêu đề câu hỏi..."
          />
          <Separator />

        <div className="overflow-hidden">
          <TableAntd
            columns={columns}
            data={dataSource}
            loading={isLoading}
            pagination={{
              page: filters.page ?? 1,
              limit: filters.limit ?? 10,
              total: total,
            }}
            onPageChange={(p, l) => {
              setFilters((prev) => ({
                ...prev,
                page: p,
                limit: l ?? 10,
              }));
            }}
          />
        </div>
      </div>

      <QuestionDetailModal
        open={isModalOpen}
        question={editingQuestion}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}