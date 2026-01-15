"use client";

import { Button, Col, Input, Row, Typography } from "antd";
import { useRouter } from "@/router/hooks";
import Logo from "@/ui/logo";
import { Users, Target, Award, Heart, CheckCircle, ArrowRight } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

export default function AboutUs() {
    const { t } = useTranslation();
    const navigate = useRouter();

    const values = [
        { icon: Heart, title: t("about.values.items.heart.title"), desc: t("about.values.items.heart.desc") },
        { icon: Award, title: t("about.values.items.award.title"), desc: t("about.values.items.award.desc") },
        { icon: Target, title: t("about.values.items.target.title"), desc: t("about.values.items.target.desc") },
        { icon: Users, title: t("about.values.items.users.title"), desc: t("about.values.items.users.desc") },
    ];

    const milestones = [
        { year: "2022", event: t("about.milestones.m1") },
        { year: "2023", event: t("about.milestones.m2") },
        { year: "2024", event: t("about.milestones.m3") },
        { year: "2025", event: t("about.milestones.m4") },
        { year: "2026", event: t("about.milestones.m5") },
    ];

    const teamMembers = [
        { name: "Trần Văn Thắng", role: "CEO & Founder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
        { name: "Nguyễn Văn A", role: "CTO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
        { name: "Lê Thị B", role: "Marketing Director", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" },
        { name: "Phạm Văn C", role: "Product Manager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4" },
    ];

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    {/* Hero Section */}
                    <div className="rounded-xl p-4 border border-border bg-gradient-to-r from-primary/10 to-primary/5 mb-6">
                        <Title level={2} className="!text-primary font-extrabold mb-2">
                            {t("about.hero.title")}
                        </Title>
                        <Paragraph className="text-lg !text-muted-foreground">
                            <Trans i18nKey="about.hero.welcome">
                                Chào mừng bạn đến với <span className="font-semibold text-primary">Shopcart TVT</span> - điểm đến tin cậy cho mọi nhu cầu mua sắm của bạn.
                            </Trans>
                        </Paragraph>
                    </div>

                    {/* Story Section */}
                    <div className="rounded-xl p-4 border border-border mb-6">
                        <Title level={3} className="font-bold flex items-center gap-2">
                            <Target className="w-6 h-6 text-primary" />
                            {t("about.story.title")}
                        </Title>
                        <Paragraph className="text-base leading-relaxed">
                            {t("about.story.p1")}
                        </Paragraph>
                        <Paragraph className="text-base leading-relaxed">
                            {t("about.story.p2")}
                        </Paragraph>
                    </div>

                    {/* Values Section */}
                    <div className="rounded-xl p-4 border border-border mb-6">
                        <Title level={3} className="font-bold mb-4 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-primary" />
                            {t("about.values.title")}
                        </Title>
                        <Row gutter={[16, 16]}>
                            {values.map(({ icon: Icon, title, desc }) => (
                                <Col xs={24} sm={12} key={title}>
                                    <div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-primary/20 h-full">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <Text className="font-semibold text-base block">{title}</Text>
                                                <Text className="!text-muted-foreground text-sm">{desc}</Text>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Timeline Section */}
                    <div className="rounded-xl p-4 border border-border mb-6">
                        <Title level={3} className="font-bold mb-4 flex items-center gap-2">
                            <Award className="w-6 h-6 text-primary" />
                            {t("about.milestones.title")}
                        </Title>
                        <div className="space-y-4 relative">
                            {milestones.map(({ year, event }, index) => (
                                <div key={year} className="flex items-center gap-4 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg">
                                        {year}
                                    </div>
                                    <div className="flex-1 p-3 bg-muted/30 rounded-lg border border-border">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <Text className="font-medium">{event}</Text>
                                        </div>
                                    </div>
                                    {index < milestones.length - 1 && (
                                        <div className="absolute left-8 top-12 w-0.5 h-8 bg-primary/20 -z-10" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="rounded-xl p-4 border border-border">
                        <Title level={3} className="font-bold mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" />
                            {t("about.team.title")}
                        </Title>
                        <Row gutter={[16, 16]}>
                            {teamMembers.map(({ name, role, avatar }) => (
                                <Col xs={12} sm={6} key={name}>
                                    <div className="text-center p-4 rounded-lg hover:bg-muted/30 transition-all h-full">
                                        <img
                                            src={avatar}
                                            alt={name}
                                            className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-primary/20"
                                        />
                                        <Text className="font-semibold block">{name}</Text>
                                        <Text className="!text-muted-foreground text-sm">{role}</Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={8}>
                    <div className="sticky top-4 space-y-4">
                        <div className="border border-border p-4 rounded-2xl flex flex-col items-center space-y-4 bg-card">
                            <Title level={4} className="font-extrabold text-center !mb-0">
                                {t("about.sidebar.connect")}
                            </Title>
                            <div className="w-20 h-1 bg-primary rounded-full" />
                            <Paragraph className="text-center !text-muted-foreground">
                                {t("about.sidebar.newsletter_desc")}
                            </Paragraph>
                            <Input
                                size="large"
                                placeholder={t("about.sidebar.email_placeholder")}
                                type="email"
                                className="w-full rounded-lg"
                            />
                            <Button type="primary" size="large" block className="rounded-lg mt-2">
                                {t("about.sidebar.subscribe")}
                            </Button>
                            <Text className="text-sm !text-muted-foreground text-center">
                                <Trans i18nKey="about.sidebar.agreement">
                                    Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ của <Logo />.
                                </Trans>
                            </Text>
                        </div>

                        {/* Quick Stats */}
                        <div className="border border-border p-4 rounded-2xl bg-card">
                            <Title level={4} className="font-bold text-center mb-4">
                                {t("about.sidebar.stats_title")}
                            </Title>
                            <div className="space-y-3">
                                {[
                                    { label: t("about.sidebar.stats.customers"), value: "100,000+" },
                                    { label: t("about.sidebar.stats.products"), value: "10,000+" },
                                    { label: t("about.sidebar.stats.partners"), value: "500+" },
                                    { label: t("about.sidebar.stats.reviews"), value: "98%" },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <Text>{stat.label}</Text>
                                        <Text className="font-bold text-primary">{stat.value}</Text>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="border border-primary/30 bg-primary/5 p-4 rounded-2xl text-center">
                            <Title level={4} className="font-semibold mb-2">
                                {t("about.sidebar.support_title")}
                            </Title>
                            <Paragraph className="!text-muted-foreground mb-4">
                                {t("about.sidebar.support_desc")}
                            </Paragraph>
                            <Button
                                type="primary"
                                size="large"
                                icon={<ArrowRight className="w-4 h-4" />}
                                onClick={() => navigate.push("/help")}
                                className="rounded-lg"
                            >
                                {t("about.sidebar.contact_btn")}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}