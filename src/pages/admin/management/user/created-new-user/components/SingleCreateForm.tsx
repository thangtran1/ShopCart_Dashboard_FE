import { Form, Input, Select, Space, Button } from "antd";
import { Icon } from "@/components/icon";
import { CreateUserReq, createUser } from "@/api/services/userManagementApi";
import { UserOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";

const { Option } = Select;

interface SingleCreateFormProps {
  onSuccess?: () => void;
}

export default function SingleCreateForm({ onSuccess }: SingleCreateFormProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CreateUserReq) => {
    try {
      setLoading(true);
      const response = await createUser(values);

      if (response.data.success) {
        toast.success(t("management.user.create-success"));
        form.resetFields();
        onSuccess?.();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="space-y-4"
      initialValues={{
        role: "user",
        status: "active",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          name="name"
          label={t("management.user.name")}
          rules={[
            {
              required: true,
              message: t("management.user.name-required"),
            },
            { min: 2, message: t("management.user.name-min-length") },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder={t("management.user.name")}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("management.user.email")}
          rules={[
            {
              required: true,
              message: t("management.user.email-required"),
            },
            {
              type: "email",
              message: t("management.user.email-invalid"),
            },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined />}
            placeholder={t("management.user.email")}
          />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          name="role"
          label={t("management.user.role")}
          rules={[
            {
              message: t("management.user.role-required"),
            },
          ]}
        >
          <Select size="large" placeholder={t("management.user.role")}>
            <Option value="user">
              <Space>
                <Icon icon="lucide:user" className="w-4 h-4" />
                {t("management.user.role-user")}
              </Space>
            </Option>
            <Option value="moderator">
              <Space>
                <Icon icon="lucide:shield-check" className="w-4 h-4" />
                {t("management.user.role-moderator")}
              </Space>
            </Option>
            <Option value="admin">
              <Space>
                <Icon icon="lucide:shield" className="w-4 h-4" />
                {t("management.user.role-admin")}
              </Space>
            </Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label={t("management.user.status")}>
          <Select
            size="large"
            placeholder={t("management.user.status")}
            defaultValue="active"
          >
            <Option value="active">{t("management.user.status-active")}</Option>
            <Option value="inactive">
              {t("management.user.status-inactive")}
            </Option>
          </Select>
        </Form.Item>
      </div>

      <Form.Item
        name="password"
        label={t("management.user.password")}
        rules={[
          {
            required: true,
            message: t("management.user.password-required"),
          },
          { min: 6, message: t("management.user.password-min-length") },
        ]}
      >
        <Input.Password
          size="large"
          prefix={<KeyOutlined />}
          placeholder={t("management.user.password")}
        />
      </Form.Item>

      <Form.Item name="phone" label={t("management.user.phone")}>
        <Input size="large" placeholder={t("management.user.phone")} />
      </Form.Item>

      <Form.Item name="bio" label={t("management.user.bio")}>
        <Input.TextArea rows={3} placeholder={t("management.user.bio")} />
      </Form.Item>

      <div className="flex justify-end gap-4 pt-2">
        <Button danger size="large" onClick={() => form.resetFields()}>
          <Icon icon="lucide:x-circle" className="h-5 w-5" />
          {t("management.user.cancel")}
        </Button>
        <Button type="primary" htmlType="submit" size="large" loading={loading}>
          <Icon icon="lucide:check-circle" className="h-5 w-5" />
          {t("management.user.create")}
        </Button>
      </div>
    </Form>
  );
}
