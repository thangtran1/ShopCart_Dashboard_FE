import { Button, Form, Input, Modal, Select, Space } from "antd";
import { Notification } from "@/types/entity";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/icon";
import { useEffect } from "react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (values: Notification) => void;
  notification: Notification | null;
}

export default function EditModal({
  isOpen,
  onClose,
  onUpdate,
  notification,
}: EditModalProps) {
  const [editForm] = Form.useForm<Notification>();
  const { t } = useTranslation();
  useEffect(() => {
    if (notification) {
      editForm.setFieldsValue(notification);
    }
  }, [notification, editForm]);
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Icon icon="lucide:edit" className="h-5 w-5 text-blue-600" />
          {t("notification.edit-notification")}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={editForm} layout="vertical" onFinish={onUpdate}>
        <Form.Item
          name="title"
          label={t("notification.title")}
          rules={[
            {
              required: true,
              message: t("notification.title-required"),
            },
            { max: 100, message: t("notification.title-max") },
          ]}
        >
          <Input placeholder={t("notification.title-placeholder")} />
        </Form.Item>

        <Form.Item
          name="content"
          label={t("notification.content")}
          rules={[
            {
              required: true,
              message: t("notification.content-required"),
            },
            { max: 2000, message: t("notification.content-max") },
          ]}
        >
          <Input.TextArea
            placeholder={t("notification.content-placeholder")}
            rows={3}
            maxLength={2000}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="type"
          label={t("notification.type")}
          rules={[
            {
              required: true,
              message: t("notification.type-required"),
            },
          ]}
        >
          <Select
            placeholder={t("notification.type-placeholder")}
            options={[
              { value: "system", label: t("notification.system") },
              {
                value: "promotion",
                label: t("notification.promotion"),
              },
              {
                value: "maintenance",
                label: t("notification.maintenance"),
              },
              { value: "update", label: t("notification.update") },
            ]}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button size="large" danger onClick={onClose}>
              {t("notification.cancel")}
            </Button>
            <Button
              size="large"
              color="primary"
              variant="outlined"
              htmlType="submit"
            >
              {t("notification.update")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
