import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Typography,
  Button,
  Space,
  Avatar,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  CloseOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Separator } from "@/ui/separator";
import {
  getUserById,
  updateUser,
  UpdateUserReq,
  UserRole,
  UserStatus,
} from "@/api/services/userManagementApi";
import { User } from "@/types/entity";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import UpdatePassword from "./update-password";

const { Title, Text } = Typography;
const { Option } = Select;

export default function UserInformation({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getUserById(userId);
        if (isMounted) {
          setUserData(response);
          form.setFieldsValue(response);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error(t("management.user.user-detail.load-failed"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading && !userData) {
    return (
      <div className="flex justify-center py-10">
        <Spin tip={t("management.user.user-detail.loading")} />
      </div>
    );
  }

  const handleSubmit = async (values: UpdateUserReq) => {
    setLoading(true);
    try {
      const response = await updateUser(userId, values);
      if (response.data.success) {
        toast.success(t("management.user.user-detail.update-success"));
        setIsEditing(false);
        setUserData(response.data.data);
      } else {
        toast.error(t("management.user.user-detail.update-error"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userData) form.setFieldsValue(userData);
    setIsEditing(false);
  };

  const statusColor: Record<UserStatus, string> = {
    active: "border-green-500 text-green-700 bg-green-50",
    inactive: "border-orange-500 text-orange-700 bg-orange-50",
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card text-card-foreground p-4 flex flex-col gap-6 rounded-md border shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar
              size={84}
              icon={<UserOutlined />}
              className="border border-gray-200 shadow-sm"
            />
            <div>
              <Title level={3} className="!mb-0">
                {userData?.name}
              </Title>
              <Text type="secondary">{userData?.email}</Text>
              <div className="mt-1 flex gap-2">
                <div
                  className={`capitalize rounded-md px-2 py-1 text-sm border ${
                    statusColor[userData?.status as UserStatus]
                  }`}
                >
                  {userData?.status}
                </div>
                <div className="capitalize border border-sky-500 bg-sky-50 text-sky-700 rounded-md px-2 py-1 text-sm">
                  {userData?.role}
                </div>
              </div>
            </div>
          </div>

          <Button
            type={isEditing ? "default" : "primary"}
            icon={isEditing ? <CloseOutlined /> : <EditOutlined />}
            size="large"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-full px-6 font-medium"
          >
            {isEditing
              ? t("management.user.user-detail.cancel-edit")
              : t("management.user.user-detail.edit-information")}
          </Button>
        </div>

        <Separator />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={!isEditing}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Form.Item
              name="name"
              label={t("management.user.user-detail.name")}
              rules={[
                {
                  required: true,
                  message: t("management.user.user-detail.name-required"),
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder={t("management.user.user-detail.name-placeholder")}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: t("management.user.user-detail.email-required"),
                },
                {
                  type: "email",
                  message: t("management.user.user-detail.email-invalid"),
                },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder={t("management.user.user-detail.email-placeholder")}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={t("management.user.user-detail.phone")}
              rules={[
                {
                  required: true,
                  message: t("management.user.user-detail.phone-required"),
                },
              ]}
            >
              <Input
                size="large"
                prefix={<PhoneOutlined />}
                placeholder={t("management.user.user-detail.phone-placeholder")}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="role"
              label={t("management.user.user-detail.role")}
              rules={[
                {
                  required: true,
                  message: t("management.user.user-detail.role-required"),
                },
              ]}
            >
              <Select
                size="large"
                className="rounded-lg"
                placeholder={t("management.user.user-detail.role-placeholder")}
              >
                <Option value={UserRole.USER}>
                  {t("management.user.user-detail.role-user")}
                </Option>
                <Option value={UserRole.MODERATOR}>
                  {t("management.user.user-detail.role-moderator")}
                </Option>
                <Option value={UserRole.ADMIN}>
                  {t("management.user.user-detail.role-admin")}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label={t("management.user.user-detail.status")}
              rules={[
                {
                  required: true,
                  message: t("management.user.user-detail.status-required"),
                },
              ]}
            >
              <Select
                size="large"
                className="rounded-lg"
                placeholder={t(
                  "management.user.user-detail.status-placeholder"
                )}
              >
                <Option value={UserStatus.ACTIVE}>
                  {t("management.user.user-detail.status-active")}
                </Option>
                <Option value={UserStatus.INACTIVE}>
                  {t("management.user.user-detail.status-inactive")}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item name="bio" label={t("management.user.user-detail.bio")}>
              <Input.TextArea
                rows={4}
                maxLength={200}
                placeholder={t("management.user.user-detail.bio-placeholder")}
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          {isEditing && (
            <div className="flex justify-end mt-4">
              <Space>
                <Button
                  size="large"
                  onClick={handleCancel}
                  danger
                  disabled={loading}
                >
                  {t("management.user.user-detail.cancel")}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  {t("management.user.user-detail.update")}
                </Button>
              </Space>
            </div>
          )}
        </Form>
      </div>
      <UpdatePassword userId={userId} />
    </div>
  );
}
