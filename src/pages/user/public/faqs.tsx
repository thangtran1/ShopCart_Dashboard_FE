"use client";

import { Button, Col, Collapse, Input, Row, Typography, Tag } from "antd";
import { useRouter } from "@/router/hooks";
import { HelpCircle, Search, MessageCircle, ShoppingCart, Truck, CreditCard, RefreshCw, Shield } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import SigninNewletter from "@/components/user/signin-newletter";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function FAQs() {
    const { t } = useTranslation();
    const navigate = useRouter();
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const faqCategories = [
        { key: "all", label: t("faq.categories.all"), icon: HelpCircle, count: 20 },
        { key: "order", label: t("faq.categories.order"), icon: ShoppingCart, count: 5 },
        { key: "shipping", label: t("faq.categories.shipping"), icon: Truck, count: 4 },
        { key: "payment", label: t("faq.categories.payment"), icon: CreditCard, count: 4 },
        { key: "return", label: t("faq.categories.return"), icon: RefreshCw, count: 4 },
        { key: "account", label: t("faq.categories.account"), icon: Shield, count: 3 },
    ];

    const faqData = useMemo(() => [
        { category: "order", q: "order_q1", a: "order_a1" },
        { category: "order", q: "order_q2", a: "order_a2" },
        { category: "order", q: "order_q3", a: "order_a3" },
        { category: "order", q: "order_q4", a: "order_a4" },
        { category: "order", q: "order_q5", a: "order_a5" },
        { category: "shipping", q: "shipping_q1", a: "shipping_a1" },
        { category: "shipping", q: "shipping_q2", a: "shipping_a2" },
        { category: "shipping", q: "shipping_q3", a: "shipping_a3" },
        { category: "shipping", q: "shipping_q4", a: "shipping_a4" },
        { category: "payment", q: "payment_q1", a: "payment_a1" },
        { category: "payment", q: "payment_q2", a: "payment_a2" },
        { category: "payment", q: "payment_q3", a: "payment_a3" },
        { category: "payment", q: "payment_q4", a: "payment_a4" },
        { category: "return", q: "return_q1", a: "return_a1" },
        { category: "return", q: "return_q2", a: "return_a2" },
        { category: "return", q: "return_q3", a: "return_a3" },
        { category: "return", q: "return_q4", a: "return_a4" },
        { category: "account", q: "account_q1", a: "account_a1" },
        { category: "account", q: "account_q2", a: "account_a2" },
        { category: "account", q: "account_q3", a: "account_a3" },
    ], []);

    const filteredFaqs = faqData.filter(faq => {
        const question = t(`faq.questions.${faq.q}`);
        const answer = t(`faq.questions.${faq.a}`);
        const matchCategory = activeCategory === "all" || faq.category === activeCategory;
        const matchSearch = question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <div className="rounded-xl p-4 border border-border bg-gradient-to-r from-primary/10 to-primary/5 mb-6">
                        <Title level={2} className="!text-primary font-extrabold mb-2 flex items-center gap-2">
                            <HelpCircle className="w-8 h-8" />
                            {t("faq.title")}
                        </Title>
                        <Paragraph className="text-lg !text-muted-foreground mb-4">
                            <Trans i18nKey="faq.subtitle">
                                Tìm câu trả lời nhanh cho các thắc mắc của bạn về <span className="font-semibold text-primary">Shopcart TVT</span>
                            </Trans>
                        </Paragraph>

                        <Input
                            size="large"
                            prefix={<Search className="w-5 h-5 text-muted-foreground" />}
                            placeholder={t("faq.search_placeholder")}
                            className="rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {faqCategories.map(({ key, label, icon: Icon, count }) => (
                            <Button
                                key={key}
                                type={activeCategory === key ? "primary" : "default"}
                                icon={<Icon className="w-4 h-4" />}
                                onClick={() => setActiveCategory(key)}
                                className="rounded-full flex items-center gap-1"
                            >
                                {label}
                                <Tag className={`ml-1 ${activeCategory === key ? "bg-white/20 border-0 text-white" : ""}`}>
                                    {count}
                                </Tag>
                            </Button>
                        ))}
                    </div>

                    <div className="rounded-xl border border-border overflow-hidden">
                        {filteredFaqs.length > 0 ? (
                            <Collapse accordion expandIconPosition="end" className="bg-background" bordered={false}>
                                {filteredFaqs.map((faq, index) => {
                                    const categoryObj = faqCategories.find(c => c.key === faq.category);
                                    const Icon = categoryObj?.icon || HelpCircle;
                                    return (
                                        <Panel
                                            key={index}
                                            header={
                                                <div className="flex items-center gap-3 py-1">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <Icon className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <Text className="font-medium text-base">{t(`faq.questions.${faq.q}`)}</Text>
                                                </div>
                                            }
                                            className="border-b border-border last:border-b-0"
                                        >
                                            <div className="pl-11 pb-2">
                                                <Paragraph className="!text-muted-foreground mb-0 leading-relaxed">
                                                    {t(`faq.questions.${faq.a}`)}
                                                </Paragraph>
                                            </div>
                                        </Panel>
                                    );
                                })}
                            </Collapse>
                        ) : (
                            <div className="p-8 text-center">
                                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                <Text className="!text-muted-foreground">{t("faq.no_results")}</Text>
                            </div>
                        )}
                    </div>
                </Col>

                <Col xs={24} lg={8}>
                    <div className="sticky top-4 space-y-4">
                        <div className="border border-border p-4 rounded-2xl flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <MessageCircle className="w-8 h-8 text-primary" />
                            </div>
                            <Title level={4} className="font-extrabold text-center mb-0">
                                {t("faq.sidebar.help_title")}
                            </Title>
                            <Paragraph className="text-center !text-muted-foreground">
                                {t("faq.sidebar.help_desc")}
                            </Paragraph>
                            <Button
                                type="primary"
                                size="large"
                                block
                                className="rounded-lg"
                                onClick={() => navigate.push("/help")}
                            >
                                {t("faq.sidebar.contact_btn")}
                            </Button>
                        </div>

                        <div className="border border-border p-4 rounded-2xl">
                            <Title level={4} className="font-bold mb-4">
                                {t("faq.sidebar.popular_title")}
                            </Title>
                            <div className="space-y-2">
                                {[
                                    { q: "shipping_q1", cat: "shipping" },
                                    { q: "payment_q2", cat: "payment" },
                                    { q: "return_q2", cat: "return" },
                                    { q: "order_q1", cat: "order" }
                                ].map((item) => (
                                    <div
                                        key={item.q}
                                        className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-all flex items-center justify-between"
                                        onClick={() => {
                                            setActiveCategory(item.cat);
                                            setSearchTerm(t(`faq.questions.${item.q}`));
                                        }}
                                    >
                                        <Text>{t(`faq.questions.${item.q}`)}</Text>
                                        <Search className="w-4 h-4 text-muted-foreground" />
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