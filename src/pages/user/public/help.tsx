"use client";

import { Button, Col, Input, Row, Typography, Form, message } from "antd";
import { useRouter } from "@/router/hooks";
import {
    Headphones, Mail, Phone, MapPin, Clock, FileText,
    ShoppingBag, Truck, CreditCard, Shield, Send, ArrowRight
} from "lucide-react";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SigninNewletter from "@/components/user/signin-newletter";

const { Title, Paragraph, Text } = Typography;

export default function Help() {
    const { t } = useTranslation();
    const navigate = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const contactMethods = [
        {
            icon: Phone,
            title: t("help.contact_methods.hotline"),
            value: "038 921 5396",
            desc: t("help.contact_methods.hotline_desc"),
            color: "bg-green-500/10 text-green-600"
        },
        {
            icon: Mail,
            title: t("help.contact_methods.email"),
            value: "thangtrandz04@gmail.com",
            desc: t("help.contact_methods.email_desc"),
            color: "bg-blue-500/10 text-blue-600"
        },
        {
            icon: MapPin,
            title: t("help.contact_methods.address"),
            value: t("help.contact_methods.address_value"),
            desc: t("help.contact_methods.address_desc"),
            color: "bg-orange-500/10 text-orange-600"
        },
    ];

    const helpCategories = [
        { icon: ShoppingBag, title: t("help.categories.order"), desc: t("help.categories.order_desc"), link: "/faqs?category=order" },
        { icon: Truck, title: t("help.categories.shipping"), desc: t("help.categories.shipping_desc"), link: "/faqs?category=shipping" },
        { icon: CreditCard, title: t("help.categories.payment"), desc: t("help.categories.payment_desc"), link: "/faqs?category=payment" },
        { icon: FileText, title: t("help.categories.return"), desc: t("help.categories.return_desc"), link: "/faqs?category=return" },
        { icon: Shield, title: t("help.categories.account"), desc: t("help.categories.account_desc"), link: "/faqs?category=account" },
        { icon: Headphones, title: t("help.categories.other"), desc: t("help.categories.other_desc"), link: "/faqs" },
    ];

    const workingHours = [
        { day: t("help.sidebar.monday_friday"), hours: "8:00 - 21:00" },
        { day: t("help.sidebar.saturday"), hours: "9:00 - 18:00" },
        { day: t("help.sidebar.sunday"), hours: "9:00 - 17:00" },
    ];

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            form.resetFields();
            message.success(t("help.form.subtitle"));
        }, 1500);
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <div className="rounded-xl p-4 border border-border bg-gradient-to-r from-primary/10 to-primary/5 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <Headphones className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <Title level={2} className="!text-primary font-extrabold mb-0">
                                    {t("help.hero.title")}
                                </Title>
                                <Paragraph className="!text-muted-foreground mb-0">
                                    {t("help.hero.subtitle")}
                                </Paragraph>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <Title level={4} className="font-bold mb-4">
                            {t("help.contact_methods.title")}
                        </Title>
                        <Row gutter={[16, 16]}>
                            {contactMethods.map(({ icon: Icon, title, value, desc, color }) => (
                                <Col xs={24} sm={12} md={8} key={title}>
                                    <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-full">
                                        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-3`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <Text className="font-semibold block">{title}</Text>
                                        <Text className="text-primary font-medium block text-sm">{value}</Text>
                                        <Text className="!text-muted-foreground text-xs">{desc}</Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <div className="mb-6">
                        <Title level={4} className="font-bold mb-4">
                            {t("help.categories.title")}
                        </Title>
                        <Row gutter={[16, 16]}>
                            {helpCategories.map(({ icon: Icon, title, desc, link }) => (
                                <Col xs={12} sm={8} key={title}>
                                    <div
                                        className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                                        onClick={() => navigate.push(link)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                <Icon className="w-5 h-5 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <Text className="font-semibold block">{title}</Text>
                                                <Text className="!text-muted-foreground text-xs">{desc}</Text>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <div className="rounded-xl p-6 border border-border">
                        <Title level={4} className="font-bold mb-4 flex items-center gap-2">
                            <Send className="w-5 h-5 text-primary" />
                            {t("help.form.title")}
                        </Title>
                        <Paragraph className="!text-muted-foreground mb-4">
                            {t("help.form.subtitle")}
                        </Paragraph>

                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="name" label={t("help.form.label_name")} rules={[{ required: true, message: t("help.form.error_name") }]}>
                                        <Input size="large" placeholder={t("help.form.placeholder_name")} className="rounded-lg" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="phone" label={t("help.form.label_phone")} rules={[{ required: true, message: t("help.form.error_phone") }]}>
                                        <Input size="large" placeholder={t("help.form.placeholder_phone")} className="rounded-lg" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="email" label={t("help.form.label_email")} rules={[
                                { required: true, message: t("help.form.error_email_req") },
                                { type: "email", message: t("help.form.error_email_type") }
                            ]}>
                                <Input size="large" placeholder={t("help.form.placeholder_email")} className="rounded-lg" />
                            </Form.Item>
                            <Form.Item name="subject" label={t("help.form.label_subject")} rules={[{ required: true, message: t("help.form.error_subject") }]}>
                                <Input size="large" placeholder={t("help.form.placeholder_subject")} className="rounded-lg" />
                            </Form.Item>
                            <Form.Item name="message" label={t("help.form.label_message")} rules={[{ required: true, message: t("help.form.error_message") }]}>
                                <TextArea rows={4} placeholder={t("help.form.placeholder_message")} className="rounded-lg" />
                            </Form.Item>
                            <div className="flex justify-end gap-3">
                                <Button size="large" onClick={() => form.resetFields()} className="rounded-lg">
                                    {t("help.form.btn_reset")}
                                </Button>
                                <Button type="primary" size="large" htmlType="submit" loading={loading} icon={<Send className="w-4 h-4" />} className="rounded-lg">
                                    {t("help.form.btn_send")}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>

                <Col xs={24} lg={8}>
                    <div className="sticky top-4 space-y-4">
                        <div className="border border-border p-4 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <Title level={4} className="font-bold mb-0">{t("help.sidebar.working_hours")}</Title>
                            </div>
                            <div className="space-y-2">
                                {workingHours.map(({ day, hours }) => (
                                    <div key={day} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <Text>{day}</Text>
                                        <Text className="font-medium text-primary">{hours}</Text>
                                    </div>
                                ))}
                            </div>
                            <Paragraph className="!text-muted-foreground text-sm mt-4 mb-0">{t("help.sidebar.note")}</Paragraph>
                        </div>

                        <div className="border border-border p-4 rounded-2xl">
                            <Title level={4} className="font-bold mb-4">{t("help.sidebar.quick_links")}</Title>
                            <div className="space-y-2">
                                {[
                                    { label: t("help.sidebar.link_faq"), link: "/faqs" },
                                    { label: t("help.sidebar.link_terms"), link: "/terms" },
                                    { label: t("help.sidebar.link_privacy"), link: "/privacy" },
                                    { label: t("help.sidebar.link_about"), link: "/about" },
                                ].map(({ label, link }) => (
                                    <div key={label} className="p-3 bg-muted/30 rounded-lg hover:bg-primary/10 cursor-pointer transition-all flex items-center justify-between group" onClick={() => navigate.push(link)}>
                                        <Text>{label}</Text>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <SigninNewletter />
                    </div>
                </Col>
            </Row>
        </div>
    );
}