import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Descriptions,
  Typography,
  Row,
  Col,
  Divider,
  Breadcrumb,
  Spin,
  Alert,
} from "antd";
import { useParams, Link } from "react-router";
import dayjs from "dayjs";
import { notificationAdminService } from "@/api/services/notificationApi";
import { Notifications } from "@/types/entity";
import { NotificationType } from "@/types/enum";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const Notification: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [notification, setNotification] = useState<Notifications | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchNotificationDetail(id);
    }
  }, [id]);

  const fetchNotificationDetail = async (notificationId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await notificationAdminService.getById(notificationId);
      setNotification(response as unknown as Notifications);
    } catch (error: any) {
      console.error("Error fetching notification detail:", error);
      setError(error.message || t("notification.load-detail-error"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "16px" }}>
          {t("notification.loading-detail")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert
          message={t("notification.error")}
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => fetchNotificationDetail(id!)}>
              {t("notification.try-again")}
            </Button>
          }
        />
      </Card>
    );
  }

  if (!notification) {
    return (
      <Card>
        <Alert
          message={t("notification.not-found")}
          description={t("notification.not-found-description")}
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  const typeMap: Record<string, NotificationType> = {
    system: NotificationType.SYSTEM,
    news: NotificationType.NEWS,
    maintenance: NotificationType.MAINTENANCE,
  };

  return (
    <Card>
      <Breadcrumb style={{ marginBottom: "8px" }}>
        <Breadcrumb.Item>
          <Link to="/admin/management/notifications">{t("notification.management")}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("notification.detail")}</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Title level={3}>{t("notification.detail")}</Title>
      </div>

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="ID" span={2}>
          {notification.data._id}
        </Descriptions.Item>
        <Descriptions.Item label={t("notification.type")} span={2}>
          {typeMap[notification.data.type] || notification.data.type}
        </Descriptions.Item>
        <Descriptions.Item label={t("notification.created-at")} span={2}>
          {dayjs(notification.data.createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label={t("notification.updated-at")} span={2}>
          {dayjs(notification.data.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Row gutter={24}>
        <Col span={8}>
          <Title level={5} style={{ marginBottom: "16px" }}>
            {t("notification.image-video")}
          </Title>
          <div
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#fafafa",
            }}
          >
            <Title level={5} style={{ marginBottom: "12px" }}>
              {t("notification.image-video-description")}
            </Title>
            {notification.data.actionUrl ? (
              <div style={{ textAlign: "center" }}>
                <img
                  src={notification.data.actionUrl}
                  alt="Notification"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "4px",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/200x200?text=Invalid+URL";
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#999",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📷</div>
                <div>{t("notification.no-image")}</div>
              </div>
            )}
          </div>
        </Col>
        <Col span={16}>
          <div>
            <Title level={5} style={{ marginBottom: "16px" }}>
              {t("notification.content-description")}
            </Title>

            <div style={{ marginBottom: "16px" }}>
              <Text strong>{t("notification.title-description")}:</Text>
              <div
                style={{
                  marginTop: "4px",
                  padding: "8px 12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                {notification.data.title}
              </div>
            </div>

            <div>
              <Text strong>{t("notification.content-description")}:</Text>
              <div className="mt-1 p-3 bg-gray-100 rounded whitespace-pre-wrap">
                {notification.data.content}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default Notification;
