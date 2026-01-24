import React from "react";
import { Modal, Button, Descriptions, Tag } from "antd";
import {
    UserOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Feedback } from "@/api/services/feedback";
import { useTranslation } from "react-i18next";

interface FeedbackDetailModalProps {
    open: boolean;
    feedback: Feedback | null;
    loading?: boolean;
    onClose: () => void;
}

const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
    open,
    feedback,
    loading = false,
    onClose,
}) => {
    const { t } = useTranslation();
    return (
        <Modal
            title={
                <div className="flex items-center text-foreground gap-2 text-2xl">
                    <MessageOutlined className="text-primary" />
                    {t("feedback.detail")}
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    {t("feedback.close")}
                </Button>,
            ]}
            width={700}
            confirmLoading={loading}
        >
            {feedback && (
                <div className="py-4">
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ fontWeight: 600, width: 140 }}
                    >
                        <Descriptions.Item
                            label={
                                <span className="flex items-center gap-2">
                                    <UserOutlined className="text-primary" />
                                    {t("feedback.name")}
                                </span>
                            }
                        >
                            <Tag color="blue" className="text-base px-3 py-1">
                                {feedback.fullName}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="flex items-center gap-2">
                                    {t("feedback.phone")}
                                </span>
                            }
                        >
                            <a
                                href={`tel:${feedback.phone}`}
                                className="text-primary hover:underline font-medium"
                            >
                                {feedback.phone}
                            </a>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="flex items-center gap-2">
                                    {t("feedback.email")}
                                </span>
                            }
                        >
                            <a
                                href={`mailto:${feedback.email}`}
                                className="text-primary hover:underline"
                            >
                                {feedback.email}
                            </a>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="flex items-center gap-2">
                                    {t("feedback.title")}
                                </span>
                            }
                        >
                            <span className="font-semibold text-foreground">{feedback.title}</span>
                        </Descriptions.Item>

                        <Descriptions.Item label={t("feedback.content")}>
                            <div className="bg-muted p-2 rounded-lg border whitespace-pre-wrap text-foreground">
                                {feedback.content}
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item label={t("feedback.created-at")}>
                            <div className="flex items-center gap-2">
                                <Tag color="green">
                                    {dayjs(feedback.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                                </Tag>
                                <span className="text-muted-foreground text-sm">
                                    ({dayjs(feedback.createdAt).fromNow()})
                                </span>
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </Modal>
    );
};

export default FeedbackDetailModal;
