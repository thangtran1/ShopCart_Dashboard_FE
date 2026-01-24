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
import { SurveyFilters, SurveyQuestion } from "@/api/services/customer-survey";
import CustomerSurveyFilters from "./CustomerSurveyFilters";
import QuestionDetailModal from "./QuestionDetailModal";
import { Separator } from "@/ui/separator";
import { useTranslation } from "react-i18next";

const initialFilters: SurveyFilters = {
  page: 1,
  limit: 10,
  search: "",
};

export default function QuestionTableManagement({ addTrigger }: { addTrigger?: number }) {
  const { t } = useTranslation()
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

  const columns: ColumnsType<SurveyQuestion> = useMemo(
    () => [
      {
        title: t('management.customer-survey.table.order'),
        dataIndex: "order",
        width: 80,
        align: "center",
        render: (order) => <b className="text-primary">#{order}</b>,
      },
      {
        title: t('management.customer-survey.table.type'),
        dataIndex: 'type',
        key: 'type',
        width: 150,
        render: (type: SurveyQuestion['type']) => (
          <Tag color={type === 'multiple' ? 'blue' : 'green'}>
            {type === 'multiple'
              ? t('management.customer-survey.filters.type_multiple')
              : t('management.customer-survey.filters.type_single')}
          </Tag>
        ),
      },
      {
        title: t('management.customer-survey.table.question'),
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
                {t('management.customer-survey.table.type')}: {record.type === 'multiple' 
                  ? t('management.customer-survey.filters.type_multiple') 
                  : t('management.customer-survey.filters.type_single')}
              </span>
            </div>
          </div>
        ),
      },
      {
        title: t('management.customer-survey.table.options'),
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
        title: t('management.customer-survey.table.created_at'),
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
        title: t('management.customer-survey.table.actions'),
        key: "actions",
        width: 120,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title={t('management.customer-survey.table.edit')}>
              <Button
                type="text"
                size="small"
                className="text-indigo-600 hover:bg-indigo-50 rounded-lg"
                icon={<EditOutlined className="text-lg" />}
                onClick={() => handleOpenEditModal(record)}
              />
            </Tooltip>
            <Popconfirm
              title={t('management.customer-survey.table.delete_confirm')}
              description={t('management.customer-survey.table.delete_desc')}
              onConfirm={() => handleDelete(record._id)}
              okText={t('management.customer-survey.table.delete_ok')}
              cancelText={t('management.customer-survey.table.delete_cancel')}
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
    [t]
  );

  return (
    <div>
      <div className="space-y-6">
          <CustomerSurveyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
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