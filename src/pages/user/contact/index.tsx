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

const { Title, Paragraph, Text } = Typography;

const socialLinks = [
    { icon: Facebook, name: "Facebook", url: "https://www.facebook.com/thang.tran.631808", color: "bg-blue-600" },
    { icon: MessageCircle, name: "WhatsApp", url: "https://wa.me/+8562096356940", color: "bg-green-500" },
    { icon: Send, name: "Telegram", url: "https://t.me/kai_dev123", color: "bg-sky-500" },
    { icon: Globe, name: "Website", url: "https://shop-cart-dashboard-fe.vercel.app/", color: "bg-primary" },
];

const quickLinks = [
    { label: "Câu hỏi thường gặp", link: "/faqs" },
    { label: "Trung tâm hỗ trợ", link: "/help" },
    { label: "Điều khoản sử dụng", link: "/terms" },
    { label: "Về chúng tôi", link: "/about" },
];

const features = [
    "Phản hồi nhanh chóng trong 24h",
    "Đội ngũ hỗ trợ chuyên nghiệp",
    "Giải đáp mọi thắc mắc",
    "Hỗ trợ đa kênh 24/7"
];

export default function Contact() {
    const navigate = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const userInfo = useUserInfo();
    const handleSubmit = async () => {
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
            setLoading(false);
        } else {
            toast.error(response.message);
            setLoading(false);
        }
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                {/* Main content */}
                <Col xs={24} lg={16}>
                    {/* Hero Section */}
                    <div className="rounded-xl p-4 border border-border bg-gradient-to-r from-primary/10 to-primary/5 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <MessageSquare className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <Title level={2} className="!text-primary font-extrabold mb-0">
                                    Liên Hệ Với Chúng Tôi
                                </Title>
                                <Paragraph className="!text-muted-foreground mb-0">
                                    Chúng tôi luôn sẵn lòng lắng nghe và hỗ trợ bạn
                                </Paragraph>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <Text className="!text-muted-foreground">{feature}</Text>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="rounded-xl p-6 border border-border">
                        <Title level={4} className="font-bold mb-2 flex items-center gap-2">
                            <Send className="w-5 h-5 text-primary" />
                            Gửi Feedback Cho Chúng Tôi
                        </Title>
                        <Paragraph className="!text-muted-foreground mb-6">
                            Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
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
                                        label="Họ và tên"
                                        initialValue={userInfo.username || ""}
                                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Nhập họ và tên của bạn"
                                            className="rounded-lg"
                                            disabled={!!userInfo.username} // Có thì khóa input
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label="Số điện thoại"
                                        initialValue={userInfo.phone || ""}
                                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Nhập số điện thoại"
                                            className="rounded-lg"
                                            disabled={!!userInfo.phone}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="emailAddress"
                                label="Email"
                                initialValue={userInfo.email || ""}
                                rules={[
                                    { required: true, message: "Vui lòng nhập email" },
                                    { type: "email", message: "Email không hợp lệ" }
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Nhập địa chỉ email"
                                    className="rounded-lg"
                                    disabled={!!userInfo.email}
                                />
                            </Form.Item>

                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                            >
                                <Input size="large" placeholder="Nhập tiêu đề tin nhắn" className="rounded-lg" />
                            </Form.Item>

                            <Form.Item
                                name="content"
                                label="Nội dung tin nhắn"
                                rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                            >
                                <TextArea
                                    rows={5}
                                    placeholder="Nhập nội dung tin nhắn của bạn..."
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <div className="flex justify-end gap-3">
                                <Button size="large" onClick={() => form.resetFields()} className="rounded-lg">
                                    Xóa nội dung
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<Send className="w-4 h-4" />}
                                    className="rounded-lg"
                                >
                                    Gửi tin nhắn
                                </Button>
                            </div>
                        </Form>
                    </div>

                    {/* Map Section */}
                    <div className="rounded-xl p-4 border border-border mt-6">
                        <Title level={4} className="font-bold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Vị Trí Của Chúng Tôi
                        </Title>
                        <div className="rounded-xl overflow-hidden border border-border">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.896245889863!2d108.20216637470624!3d16.054407884625524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792d2b4ff%3A0xa084d0b12304c3d!2zSMOibiBDaOG7hyDEkOG7qWMgRGFuYW5nLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1701788400000!5m2!1svi!2s
"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps"
                            />
                        </div>
                    </div>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={8}>
                    <div className="sticky top-4 space-y-4">
                        {/* Social Links */}
                        <div className="border border-border p-4 rounded-2xl">
                            <Title level={4} className="font-bold mb-4">
                                Kết Nối Với Chúng Tôi
                            </Title>
                            <div className="grid grid-cols-2 gap-1">
                                {socialLinks.map(({ icon: Icon, name, url, color }) => (
                                    <a
                                        key={name}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex  border border-primary/10 items-center gap-2 p-3 rounded-lg ${color} text-foreground hover:opacity-90 transition-all`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <Text className="text-foreground font-medium text-sm">{name}</Text>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="border border-border p-4 rounded-2xl">
                            <Title level={4} className="font-bold mb-4">
                                Liên Kết Hữu Ích
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

                        {/* Support CTA */}
                        <div className="border border-primary/30 bg-primary/5 p-6 rounded-2xl text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                <Headphones className="w-7 h-7 text-primary" />
                            </div>
                            <Title level={4} className="font-semibold mb-2">
                                Cần Hỗ Trợ Ngay?
                            </Title>
                            <Paragraph className="!text-muted-foreground mb-4">
                                Gọi ngay hotline để được tư vấn miễn phí
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

                        {/* Newsletter */}
                        <SigninNewletter />
                    </div>
                </Col>
            </Row>
        </div>
    );
}
