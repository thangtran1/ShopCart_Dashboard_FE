"use client";
import Logo from "@/ui/logo";
import { Button, Typography, Form, Input } from "antd";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

export default function SigninNewletter() {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            toast.success(t("newsletter.toast.success"));
            form.resetFields();
        } catch (err) {
            // Validation lỗi sẽ hiển thị tự động theo rules bên dưới
        }
    };

    return (
        <div className="border border-primary/30 p-4 rounded-2xl flex flex-col items-center space-y-4">
            <Title level={4} className="font-extrabold text-center !m-0">
                {t("newsletter.title")}
            </Title>
            
            <div className="w-20 h-1 bg-primary rounded-full" />
            
            <Paragraph className="text-center !text-muted-foreground !m-0">
                {t("newsletter.description")}
            </Paragraph>

            <Form form={form} className="w-full !my-2">
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: t("newsletter.error.required") },
                        { type: "email", message: t("newsletter.error.invalid") },
                    ]}
                    className="!mb-2"
                >
                    <Input
                        size="large"
                        placeholder={t("newsletter.placeholder")}
                        className="w-full rounded-lg"
                    />
                </Form.Item>

                <Button
                    onClick={handleSubmit}
                    type="primary"
                    size="large"
                    block
                    className="rounded-lg font-bold"
                >
                    {t("newsletter.button")}
                </Button>
            </Form>

            <Text className="text-sm !text-muted-foreground text-center">
                {t("newsletter.policy")} <Logo />.
            </Text>
        </div>
    );
}