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
import { useTranslation } from "react-i18next";

const CustomerSurveyManagement = () => {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState("questions");
    const [triggerAdd, setTriggerAdd] = useState(0);

    const items = [
        {
            key: "questions",
            label: (
                <div className="flex items-center gap-2">
                    <ListChecks size={18} />
                    <span>{t('management.customer-survey.tabs.questions')}</span>
                </div>
            ),
            children: <QuestionTableManagement addTrigger={triggerAdd} />,
        },
        {
            key: "responses",
            label: (
                <div className="flex items-center gap-2">
                    <MessageSquareQuote size={18} />
                    <span>{t('management.customer-survey.tabs.responses')}</span>
                </div>
            ),
            children: <ResponseTableManagement />,
        },
    ];

    return (
        <div className="bg-card text-card-foreground px-6 flex flex-col gap-6 rounded-xl border shadow-sm">
            <div className="space-y-6 mt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                    <div>
                        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Icon icon="lucide:message-square-text" className="h-7 w-7 text-primary" />
                            {t('management.customer-survey.title')}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">
                            {t('management.customer-survey.description')}
                        </p>
                    </div>

                    {activeTab === "questions" && (
                        <div className="flex mt-3 md:mt-0">
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                size="large"
                                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md font-bold transition-all hover:-translate-y-0.5"
                                onClick={() => setTriggerAdd(prev => prev + 1)}
                            >
                                {t('management.customer-survey.button.add_question')}
                            </Button>
                        </div>
                    )}
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