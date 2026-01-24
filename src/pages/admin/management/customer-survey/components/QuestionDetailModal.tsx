"use client";

import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Button, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCustomerSurvey } from "@/hooks/user-customer-survey";
import { Textarea } from "@/ui/textarea";
import { useTranslation } from "react-i18next";
import { SurveyQuestion } from "@/api/services/customer-survey";

interface Props {
  open: boolean;
  question: SurveyQuestion | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuestionDetailModal({ open, question, onClose, onSuccess }: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { createQuestion, updateQuestion, isActionLoading } = useCustomerSurvey();

  useEffect(() => {
    if (open) {
      if (question) {
        form.setFieldsValue(question);
      } else {
        form.resetFields();
        form.setFieldsValue({ order: 1, type: "single", options: ["", ""] });
      }
    }
  }, [open, question, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (question?._id) {
        await updateQuestion({ id: question._id, data: values });
        message.success(t('management.customer-survey.messages.update_success'));
      } else {
        await createQuestion(values);
        message.success(t('management.customer-survey.messages.create_success'));
      }
      onSuccess();
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold italic uppercase text-primary">
          {question ? t('management.customer-survey.form.edit_title') : t('management.customer-survey.form.add_title')}
        </span>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isActionLoading}
      okText={question ? t('management.customer-survey.form.btn_save') : t('management.customer-survey.form.btn_create')}
      cancelText={t('management.customer-survey.form.btn_cancel')}
      width={600}
      centered
      styles={{ body: { paddingTop: "20px" } }}
      okButtonProps={{
        size: "large",
        className: "rounded-xl font-bold px-6",
      }}
      cancelButtonProps={{
        size: "large",
        className: "rounded-xl px-6",
      }}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <div className="grid grid-cols-4 gap-4">
          <Form.Item
            label={<span className="font-bold text-xs uppercase">{t('management.customer-survey.form.label_order')}</span>}
            name="order"
            className="col-span-1"
            rules={[{ required: true, message: t('management.customer-survey.messages.error_required') }]}
          >
            <InputNumber min={1} className="w-full rounded-lg" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold text-xs uppercase">{t('management.customer-survey.form.label_type')}</span>}
            name="type"
            className="col-span-3"
            rules={[{ required: true }]}
          >
            <Select size="large" className="rounded-lg">
              <Select.Option value="single">{t('management.customer-survey.filters.type_single')}</Select.Option>
              <Select.Option value="multiple">{t('management.customer-survey.filters.type_multiple')}</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="font-bold text-xs uppercase">{t('management.customer-survey.form.label_title')}</span>}
          name="title"
          rules={[{ required: true, message: t('management.customer-survey.messages.error_required') }]}
        >
          <Textarea 
            rows={2} 
            placeholder={t('management.customer-survey.form.placeholder_title')} 
            className="rounded-lg" 
          />
        </Form.Item>

        <Separator label={t('management.customer-survey.form.label_options_list')} />

        <Form.List
          name="options"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(new Error(t('management.customer-survey.messages.error_min_options')));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <div className="space-y-3">
              {fields.map(({ key, ...fieldConfig }, index) => (
                <Form.Item
                  key={key} 
                  required={false}
                  className="mb-0"
                >
                  <div className="flex gap-2">
                    <Form.Item
                      {...fieldConfig}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[{ required: true, whitespace: true, message: t('management.customer-survey.messages.error_required') }]}
                      noStyle
                    >
                      <Input 
                        placeholder={`${t('management.customer-survey.form.placeholder_option')} ${index + 1}`} 
                        className="rounded-lg" 
                        size="large" 
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(fieldConfig.name)}
                        className="h-10 w-10 flex items-center justify-center"
                      />
                    )}
                  </div>
                </Form.Item>
              ))}
              
              <Button
                type="dashed"
                size="large"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                className="rounded-lg h-10 border-primary text-primary"
              >
                {t('management.customer-survey.form.btn_add_option')}
              </Button>
              <Form.ErrorList errors={errors} className="text-red-500 text-xs mt-1" />
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}

const Separator = ({ label }: { label: string }) => (
  <div className="relative py-4">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-border" />
    </div>
    <div className="relative flex justify-start">
      <span className="bg-background pr-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
        {label}
      </span>
    </div>
  </div>
);