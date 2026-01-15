"use client";

import { Button, Col, Input, Row, Typography, Form } from "antd";
import { useRouter } from "@/router/hooks";
import {
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Globe,
    Facebook,
    ArrowRight,
    CheckCircle,
    Headphones,
    MessageCircle
} from "lucide-react";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { toast } from "sonner";
import { feedbackService } from "@/api/services/feedback";
import { useUserInfo } from "@/store/userStore";
import SigninNewletter from "@/components/user/signin-newletter";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

export default function Contact() {
    const { t } = useTranslation();
    const navigate = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const userInfo = useUserInfo();

    const socialLinks = [
        { icon: Facebook, name: "Facebook", url: "https://www.facebook.com/thang.tran.631808", color: "bg-blue-600" },
        { icon: MessageCircle, name: "WhatsApp", url: "https://wa.me/+8562096356940", color: "bg-green-500" },
        { icon: Send, name: "Telegram", url: "https://t.me/kai_dev123", color: "bg-sky-500" },
        { icon: Globe, name: "Website", url: "https://shop-cart-dashboard-fe.vercel.app/", color: "bg-primary" },
    ];

    const quickLinks = [
        { label: t("contact_page.sidebar.links.faqs"), link: "/faqs" },
        { label: t("contact_page.sidebar.links.help"), link: "/help" },
        { label: t("contact_page.sidebar.links.terms"), link: "/terms" },
        { label: t("contact_page.sidebar.links.about"), link: "/about" },
    ];

    const features = t("contact_page.hero.features", { returnObjects: true }) as string[];

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const response = await feedbackService.create({
                fullName: userInfo.username || values.fullName,
                phone: userInfo.phone || values.phoneNumber,
                email: userInfo.email || values.emailAddress,
                title: values.title,
                content: values.content,
            });
            if (response.success) {
                toast.success(response.message);
                form.resetFields();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Validation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    {/* Hero Section */}
                    <div className="rounded-xl p-4 border border-border bg-gradient-to-r from-primary/10 to-primary/5 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <MessageSquare className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <Title level={2} className="!text-primary font-extrabold mb-0">
                                    {t("contact_page.hero.title")}
                                </Title>
                                <Paragraph className="!text-muted-foreground mb-0">
                                    {t("contact_page.hero.subtitle")}
                                </Paragraph>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <Text className="!text-muted-foreground">{feature}</Text>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="rounded-xl p-4 border border-border">
                        <Title level={4} className="font-bold mb-2 flex items-center gap-2">
                            <Send className="w-5 h-5 text-primary" />
                            {t("contact_page.form.title")}
                        </Title>
                        <Paragraph className="!text-muted-foreground mb-6">
                            {t("contact_page.form.subtitle")}
                        </Paragraph>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="fullName"
                                        label={t("profile_drawer.form.labels.name")}
                                        initialValue={userInfo.username || ""}
                                        rules={[{ required: true, message: t("profile_drawer.form.rules.required_name") }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder={t("contact_page.form.placeholders.name")}
                                            className="rounded-lg"
                                            disabled={!!userInfo.username}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label={t("profile_drawer.form.labels.phone")}
                                        initialValue={userInfo.phone || ""}
                                        rules={[{ required: true, message: t("profile_drawer.form.rules.required_phone") || "Required" }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder={t("contact_page.form.placeholders.phone")}
                                            className="rounded-lg"
                                            disabled={!!userInfo.phone}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="emailAddress"
                                label={t("profile_drawer.form.labels.email")}
                                initialValue={userInfo.email || ""}
                                rules={[
                                    { required: true, message: t("profile_drawer.form.rules.required_email") || "Required" },
                                    { type: "email", message: t("profile_drawer.form.rules.email_invalid") || "Invalid email" }
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder={t("contact_page.form.placeholders.email")}
                                    className="rounded-lg"
                                    disabled={!!userInfo.email}
                                />
                            </Form.Item>

                            <Form.Item
                                name="title"
                                label={t("profile_drawer.form.labels.addr_title")}
                                rules={[{ required: true, message: t("profile_drawer.form.rules.required_title") }]}
                            >
                                <Input size="large" placeholder={t("contact_page.form.placeholders.subject")} className="rounded-lg" />
                            </Form.Item>

                            <Form.Item
                                name="content"
                                label={t("contact_page.form.btns.send")}
                                rules={[{ required: true, message: t("contact_page.form.placeholders.message") }]}
                            >
                                <TextArea
                                    rows={5}
                                    placeholder={t("contact_page.form.placeholders.message")}
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <div className="flex justify-end gap-3">
                                <Button size="large" onClick={() => form.resetFields()} className="rounded-lg">
                                    {t("contact_page.form.btns.reset")}
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<Send className="w-4 h-4" />}
                                    className="rounded-lg"
                                >
                                    {t("contact_page.form.btns.send")}
                                </Button>
                            </div>
                        </Form>
                    </div>

                    {/* Map Section */}
                    <div className="rounded-xl p-4 border border-border mt-6">
                        <Title level={4} className="font-bold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            {t("contact_page.sidebar.location_title")}
                        </Title>
                        <div className="rounded-xl overflow-hidden border border-border">
                            <iframe
                                src="https://www.google.com/maps/embed?..." 
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Google Maps"
                            />
                        </div>
                    </div>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={8}>
                    <div className="sticky top-4 space-y-4">
                        <div className="border border-border p-4 rounded-2xl">
                            <Title level={4} className="font-bold mb-4">
                                {t("contact_page.sidebar.social_title")}
                            </Title>
                            <div className="grid grid-cols-2 gap-1">
                                {socialLinks.map(({ icon: Icon, name, url, color }) => (
                                    <a
                                        key={name}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex border border-primary/10 items-center gap-2 p-3 rounded-lg ${color} text-white hover:opacity-90 transition-all`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <Text className="text-white font-medium text-sm">{name}</Text>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="border border-border p-4 rounded-2xl">
                            <Title level={4} className="font-bold mb-4">
                                {t("contact_page.sidebar.links_title")}
                            </Title>
                            <div className="space-y-2">
                                {quickLinks.map(({ label, link }) => (
                                    <div
                                        key={label}
                                        className="p-3 bg-muted/30 rounded-lg hover:bg-primary/10 cursor-pointer transition-all flex items-center justify-between group"
                                        onClick={() => navigate.push(link)}
                                    >
                                        <Text>{label}</Text>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border border-primary/30 bg-primary/5 p-4 rounded-2xl text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                <Headphones className="w-7 h-7 text-primary" />
                            </div>
                            <Title level={4} className="font-semibold mb-2">
                                {t("contact_page.sidebar.cta_title")}
                            </Title>
                            <Paragraph className="!text-muted-foreground mb-4">
                                {t("contact_page.sidebar.cta_subtitle")}
                            </Paragraph>
                            <Button
                                type="primary"
                                size="large"
                                icon={<Phone className="w-4 h-4" />}
                                className="rounded-lg"
                                block
                            >
                                1900 1234 56
                            </Button>
                        </div>
                        <SigninNewletter />
                    </div>
                </Col>
            </Row>
        </div>
    );
}