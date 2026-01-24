"use client";

import { Modal, List, Tag, Divider } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
}

export default function ResponseDetailModal({ open, data, onClose }: Props) {
  const { t } = useTranslation();

  if (!data) return null;

  return (
    <Modal
      title={
        <span className="text-lg font-bold uppercase italic text-primary">
          {t('management.customer-survey.response_detail.title')}
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
            {t('management.customer-survey.response_detail.customer_feedback')}
          </p>
          <p className="text-base font-medium text-foreground italic">
            "{data.customerFeedback || t('management.customer-survey.response_detail.no_feedback')}"
          </p>
          <p className="text-[10px] text-muted-foreground mt-2">
            {t('management.customer-survey.response_detail.submitted_at')}: {dayjs(data.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </p>
        </div>

        <Divider orientation="left" className="m-0 text-xs text-muted-foreground">
          {t('management.customer-survey.response_detail.specific_answers')}
        </Divider>

        <List
          dataSource={data.surveyData}
          renderItem={(item: any) => (
            <List.Item className="flex-col items-start border-none px-0 py-3">
              <p className="font-bold text-foreground mb-2">
                Q: {item.questionTitle || t('management.customer-survey.response_detail.unknown_question')}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.selectedOptions?.map((opt: string, idx: number) => (
                  <Tag key={idx} color="red" className="rounded-md border-red-200">
                    {opt}
                  </Tag>
                ))}
              </div>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
}