import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Breadcrumb,
} from "antd";
import { Link } from "react-router";
import { toast } from "sonner";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { NotificationType } from "@/types/enum";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { Notification } from "@/types/entity";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const NewNotification: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { createNotification } = useAdminNotifications();
  const [actionUrlFile, setActionUrlFile] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string>("");

  // Cleanup URL object khi component unmount
  useEffect(() => {
    return () => {
      if (actionUrlFile) {
        URL.revokeObjectURL(actionUrlFile);
      }
    };
  }, [actionUrlFile]);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (values: Notification) => {
    setLoading(true);
    try {
      await createNotification({
        title: values.title,
        content: values.content,
        actionUrl: actionUrlFile || undefined, // Sử dụng actionUrlFile thay vì values.actionUrl
        type: values.type as NotificationType,
      });

      toast.success("Tạo thông báo thành công", {
        description: "Thông báo đã được tạo và gửi đến tất cả người dùng",
        duration: 4000,
      });
      form.resetFields();
      if (actionUrlFile) {
        URL.revokeObjectURL(actionUrlFile);
      }
      setActionUrlFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendForApproval = () => {
    form.setFieldsValue({ status: "pending" });
    form.submit();
  };

  return (
    <Card className="!bg-background">
      <Breadcrumb style={{ marginBottom: "8px" }}>
        <Breadcrumb.Item>
          <Link to="/admin/management/notifications">{t("notification.management")}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("notification.new-notification")}</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3}>{t("notification.new-notification")}</Title>

      <Divider style={{ margin: "12px 0" }} />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: "system",
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label={t("notification.type")}
              rules={[{ message: "Vui lòng chọn loại thông báo" }]}
            >
              <Select placeholder={t("notification.select-type")}>
                <Option value="system">{t("notification.system")}</Option>
                <Option value="news">{t("notification.news")}</Option>
                <Option value="maintenance">
                  {t("notification.maintenance")}
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Title level={4} style={{ marginBottom: "12px" }}>
          {t("notification.content")}
        </Title>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="actionUrl"
              label={t("notification.image-video")}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (validateUrl(value)) return Promise.resolve();
                    return Promise.reject(
                      new Error(t("notification.url-invalid"))
                    );
                  },
                },
              ]}
            >
              <div className="border border-border rounded-lg p-2 text-center h-[200px] flex items-center justify-center relative mb-3">
                {actionUrlFile ? (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <img
                      src={actionUrlFile}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div
                      className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs cursor-pointer"
                      onClick={() => {
                        setActionUrlFile(null);
                        form.setFieldsValue({ actionUrl: undefined });
                      }}
                    >
                      Xóa
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "#999" }}>
                    <PlusCircleOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                    <div>{t("notification.preview-image-video")}</div>
                  </div>
                )}
              </div>

              {/* Input luôn hiển thị */}
              <Input
                placeholder={t("notification.image-video-placeholder")}
                status={urlError ? "error" : ""}
                value={form.getFieldValue("actionUrl") || ""}
                onChange={(e) => {
                  const url = e.target.value.trim();
                  setUrlError("");

                  if (url) {
                    if (validateUrl(url)) {
                      setActionUrlFile(url);
                      form.setFieldsValue({ actionUrl: url });
                    } else {
                      setActionUrlFile(null);
                      form.setFieldsValue({ actionUrl: url });
                      setUrlError(t("notification.url-invalid"));
                    }
                  } else {
                    setActionUrlFile(null);
                    form.setFieldsValue({ actionUrl: undefined });
                  }
                }}
              />
              {urlError && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: 12,
                    marginTop: 4,
                    textAlign: "center",
                  }}
                >
                  {urlError}
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <div>
              <Form.Item
                style={{ marginBottom: 12 }}
                name="title"
                label={t("notification.title")}
                rules={[
                  {
                    required: true,
                    message: t("notification.title-required"),
                  },
                  { max: 200, message: t("notification.title-max") },
                ]}
              >
                <Input
                  placeholder={t("notification.title")}
                  showCount
                  maxLength={200}
                />
              </Form.Item>

              <Form.Item
                name="content"
                label={t("notification.content")}
                rules={[
                  {
                    required: true,
                    message: t("notification.content-required"),
                  },
                  {
                    max: 500,
                    message: t("notification.content-max"),
                  },
                ]}
              >
                <TextArea
                  rows={7}
                  placeholder={t("notification.content-placeholder")}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <div className="flex justify-end gap-2 mt-2 border-t border-border pt-4">
          <Button
            size="large"
            danger
            onClick={() => {
              form.resetFields();
              setActionUrlFile(null);
            }}
          >
            {t("notification.cancel")}
          </Button>
          <Button
            size="large"
            color="primary"
            variant="outlined"
            loading={loading}
            onClick={handleSendForApproval}
          >
            {t("notification.add")}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default NewNotification;
