"use client";

import { useState } from "react";
import { Button, Tabs } from "antd";
import { ListChecks, MessageSquareQuote } from "lucide-react";
import QuestionTableManagement from "./components/QuestionTableManagement";
import ResponseTableManagement from "./components/ResponseTableManagement";
import { Separator } from "@/ui/separator";
import { CardTitle } from "@/ui/card";
import { Icon } from "@/components/icon";
import { PlusCircleOutlined } from "@ant-design/icons";

const CustomerSurveyManagement = () => {
    const [activeTab, setActiveTab] = useState("questions");
    const [triggerAdd, setTriggerAdd] = useState(0);

    const items = [
        {
            key: "questions",
            label: (
                <div className="flex items-center gap-2">
                    <ListChecks size={18} />
                    <span>Thiết lập câu hỏi</span>
                </div>
            ),
            children: <QuestionTableManagement addTrigger={triggerAdd} />,
        },
        {
            key: "responses",
            label: (
                <div className="flex items-center gap-2">
                    <MessageSquareQuote size={18} />
                    <span>Phản hồi khách hàng</span>
                </div>
            ),
            children: <ResponseTableManagement />,
        },
    ];

    return (
        <div className="bg-card text-card-foreground px-6 flex flex-col gap-6 rounded-xl border shadow-sm">
            <div className="space-y-6 mt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Icon icon="lucide:message-square-text" className="h-7 w-7 text-primary" />
                            Quản lý khảo sát khách hàng
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">
                            Các câu hỏi trắc nghiệm và xem ý kiến đóng góp từ người dùng.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {activeTab === "questions" && (
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                size="large"
                                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md font-bold transition-all hover:-translate-y-0.5"
                                onClick={() => setTriggerAdd(prev => prev + 1)} 
                            >
                                Thêm câu hỏi
                            </Button>
                        )}
                    </div>
                </div>

                <Separator className="my-0" />

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={items}
                    type="line"
                    size="large"
                    className="custom-survey-tabs"
                />
            </div>
        </div>
    );
};

export default CustomerSurveyManagement;