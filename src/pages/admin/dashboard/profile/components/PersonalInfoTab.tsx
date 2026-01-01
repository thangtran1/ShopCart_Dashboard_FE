import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  Avatar,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import {
  UserProfile,
  UpdateProfileReq,
  updateUserProfile,
  uploadAvatar,
} from "@/api/services/profileApi";
import { FullPageLoading } from "@/components/common/loading";

const { TextArea } = Input;

interface PersonalInfoTabProps {
  profile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function PersonalInfoTab({
  profile,
  onProfileUpdate,
}: PersonalInfoTabProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<UpdateProfileReq>();
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    form.resetFields();
    setIsChanged(false);
  }, [profile]);

  const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (values: UpdateProfileReq) => updateUserProfile(values),
    onSuccess: (updated) => {
      onProfileUpdate(updated);
      toast.success(t("profile.update-profile-success"));
      setIsChanged(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { mutateAsync: changeAvatar, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: async (url: string) => {
      if (!profile) return;
      const updated = await updateProfile({ avatar: url });
      onProfileUpdate(updated);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSave = async (values: UpdateProfileReq) => {
    await updateProfile({
      ...values,
      dateOfBirth: values.dateOfBirth
        ? dayjs(values.dateOfBirth).toISOString()
        : undefined,
    });
  };

  const handleAvatarUpload = async (file: File) => {
    await changeAvatar(file);
  };

  const handleValuesChange = () => {
    if (!profile) return;
    const values = form.getFieldsValue();
    const changed =
      values.name !== profile.name ||
      values.phone !== profile.phone ||
      values.bio !== profile.bio ||
      (values.dateOfBirth &&
        !dayjs(values.dateOfBirth).isSame(dayjs(profile.dateOfBirth), "day"));
    setIsChanged(Boolean(changed));
  };

  const avatarUrl = profile?.avatar
    ? `${import.meta.env.VITE_API_URL}${profile.avatar}`
    : undefined;

  return (
    <div>
      {(isUpdating || isUploading) && (
        <FullPageLoading
          message={
            isUpdating
              ? t("profile.updating-profile")
              : t("profile.updating-avatar")
          }
        />
      )}
      <div className="flex items-center mb-4">
        <div className="relative">
          <Avatar size={100} icon={<UserOutlined />} src={avatarUrl} />
          <Upload
            showUploadList={false}
            customRequest={(options) =>
              handleAvatarUpload(options.file as File)
            }
            accept="image/*"
          >
            <Button
              className="absolute -bottom-6 right-6"
              shape="circle"
              icon={<CameraOutlined />}
              loading={isUploading}
            />
          </Upload>
        </div>
        <div className="ml-4">
          <h3>{profile?.name || t("profile.loading")}</h3>
          <p>{profile?.email || t("profile.loading")}</p>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...profile,
          dateOfBirth: profile?.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
        }}
        onValuesChange={handleValuesChange}
        onFinish={handleSave}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={t("profile.name")}
              rules={[{ required: true, message: t("profile.name-required") }]}
            >
              <Input size="large" prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label={t("profile.email")}>
              <Input size="large" prefix={<MailOutlined />} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="phone" label={t("profile.phone")}>
              <Input size="large" prefix={<PhoneOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dateOfBirth" label={t("profile.date-of-birth")}>
              <DatePicker size="large" className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="bio" label={t("profile.bio")}>
          <TextArea size="large" rows={4} />
        </Form.Item>

        <div className="flex justify-end">
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            disabled={!isChanged}
            loading={isUpdating}
          >
            {t("profile.update-profile")}
          </Button>
        </div>
      </Form>
    </div>
  );
}
