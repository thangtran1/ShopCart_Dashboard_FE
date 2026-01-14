import { Button, Col, Row, Typography, Collapse } from "antd";
import { useRouter } from "@/router/hooks";
import { useTranslation } from "react-i18next";
import {
    FileText, Shield, Scale, AlertCircle, Users, Lock,
    CreditCard, Truck, RefreshCw, MessageCircle, ArrowRight,
    CheckCircle, Calendar, BookOpen
} from "lucide-react";
import SigninNewletter from "@/components/user/signin-newletter";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function TermsPage() {
    const { t } = useTranslation();
    const navigate = useRouter();

    const icons = [BookOpen, Shield, Users, CreditCard, Truck, RefreshCw, Lock, Scale];

    // Lấy dữ liệu mảng từ i18n
    const sectionsData = t("terms.sections", { returnObjects: true }) as any[];

    const termsSections = sectionsData.map((section, index) => ({
        ...section,
        icon: icons[index] || FileText
    }));

    const quickStats = [
        { label: t("terms.stats.labels.effective"), value: "01/01/2023" },
        { label: t("terms.stats.labels.updated"), value: "05/12/2025" },
        { label: t("terms.stats.labels.version"), value: "3.0" },
        { label: t("terms.stats.labels.language"), value: t("terms.stats.labels.lang_value") },
    ];

    return (
        <div>
            <Row gutter={[16, 16]}>
                {/* Main content */}
                <Col xs={24} lg={16}>
                    {/* Hero Section */}
                    <div className="rounded-xl p-4 border border-border bg-gradient-to-r from-primary/10 to-primary/5 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <Title level={2} className="!text-primary font-extrabold mb-0">
                                    {t("terms.header.title")}
                                </Title>
                                <Paragraph className="!text-muted-foreground mb-0">
                                    {t("terms.header.brand")}
                                </Paragraph>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full text-sm">
                                <Calendar className="w-4 h-4 text-primary" />
                                <Text>{t("terms.header.updated", { date: "05/12/2025" })}</Text>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <Text>{t("terms.header.effective", { date: "01/01/2023" })}</Text>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    <div className="rounded-xl p-4 border border-border mb-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <Title level={4} className="font-bold mb-2">{t("terms.important_note.title")}</Title>
                                <Paragraph className="!text-muted-foreground mb-0">
                                    {t("terms.important_note.content")}
                                </Paragraph>
                            </div>
                        </div>
                    </div>

                    {/* Terms Sections */}
                    <div className="rounded-xl border border-border overflow-hidden">
                        <Collapse
                            accordion
                            expandIconPosition="end"
                            className="bg-background"
                            bordered={false}
                            defaultActiveKey={['0']}
                        >
                            {termsSections.map((section, index) => {
                                const Icon = section.icon;
                                return (
                                    <Panel
                                        key={index}
                                        header={
                                            <div className="flex items-center gap-3 py-2">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <Text className="font-semibold text-base">{section.title}</Text>
                                            </div>
                                        }
                                        className="border-b border-border last:border-b-0"
                                    >
                                        <div className="pl-13 space-y-4">
                                            {section.content.map((item: any, idx: number) => (
                                                <div key={idx} className="pl-4 border-l-2 border-primary/30">
                                                    <Text className="font-medium block mb-1">{item.subtitle}</Text>
                                                    <Paragraph className="!text-muted-foreground mb-0 leading-relaxed">
                                                        {item.text}
                                                    </Paragraph>
                                                </div>
                                            ))}
                                        </div>
                                    </Panel>
                                );
                            })}
                        </Collapse>
                    </div>

                    {/* Contact Section */}
                    <div className="rounded-xl p-4 border border-border mt-6">
                        <Title level={4} className="font-bold mb-4 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-primary" />
                            {t("terms.contact.title")}
                        </Title>
                        <Paragraph className="!text-muted-foreground mb-4">
                            {t("terms.contact.desc")}
                        </Paragraph>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <div className="p-4 bg-muted/30 rounded-lg">
                                    <Text className="font-medium block">{t("terms.contact.email_label")}</Text>
                                    <Text className="text-primary">thangtrandz04@gmail.com</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="p-4 bg-muted/30 rounded-lg">
                                    <Text className="font-medium block">{t("terms.contact.hotline_label")}</Text>
                                    <Text className="text-primary">038 921 5396</Text>
                                </div>
                            </Col>
                        </Row>
                        <div className="flex justify-center mt-6">
                            <Button
                                type="primary"
                                size="large"
                                icon={<ArrowRight className="w-4 h-4" />}
                                onClick={() => navigate.push("/contact")}
                                className="rounded-lg"
                            >
                                {t("terms.contact.button")}
                            </Button>
                        </div>
                    </div>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={8}>
                    <div className="sticky top-4 space-y-4">
                        {/* Document Info */}
                        <div className="border border-border p-4 rounded-2xl">
                            <Title level={4} className="font-bold mb-4">
                                {t("terms.stats.title")}
                            </Title>
                            <div className="space-y-3">
                                {quickStats.map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <Text className="!text-muted-foreground">{label}</Text>
                                        <Text className="font-medium text-primary">{value}</Text>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Navigation */}
                        <div className="border border-border p-4 rounded-2xl">
                            <Title level={4} className="font-bold mb-4">
                                {t("terms.sidebar.toc")}
                            </Title>
                            <div className="space-y-2">
                                {termsSections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-all text-sm"
                                    >
                                        <Text className="!text-muted-foreground hover:text-primary">
                                            {section.title}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Related Links */}
                        <div className="border border-border p-4 rounded-2xl">
                            <Title level={4} className="font-bold mb-4">
                                {t("terms.sidebar.related")}
                            </Title>
                            <div className="space-y-2">
                                {[
                                    { key: "privacy", link: "/privacy" },
                                    { key: "faqs", link: "/faqs" },
                                    { key: "help", link: "/help" },
                                    { key: "about", link: "/about" },
                                ].map(({ key, link }) => (
                                    <div
                                        key={key}
                                        className="p-3 bg-muted/30 rounded-lg hover:bg-primary/10 cursor-pointer transition-all flex items-center justify-between group"
                                        onClick={() => navigate.push(link)}
                                    >
                                        <Text>{t(`terms.sidebar.links.${key}`)}</Text>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter */}
                        <SigninNewletter />
                    </div>
                </Col>
            </Row>
        </div>
    );
}