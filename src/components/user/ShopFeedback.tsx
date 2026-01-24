"use client";

import { useState } from "react";
import { X, Check, ChevronLeft, MessageSquareHeart } from "lucide-react";
import { Modal, Progress, Skeleton } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/ui/textarea";
import { useCustomerSurvey } from "@/hooks/user-customer-survey";
import { useTranslation } from "react-i18next";

export const ShopFeedBack = () => {
    const { t } = useTranslation();
    const { useQuestions, submitSurvey, isActionLoading } = useCustomerSurvey();

    const { data: apiResponse, isLoading: isFetchingQuestions } = useQuestions({
        page: 1,
        limit: 50,
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAntModalOpen, setIsAntModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
    const [error, setError] = useState("");
    const [feedbackText, setFeedbackText] = useState("");

    const QUESTIONS = apiResponse?.data?.data || [];
    const totalSteps = QUESTIONS.length + 1;
    const progressPercent = Math.round((step / totalSteps) * 100);

    const handleOpenDrawer = () => {
        setStep(1);
        setSelectedOptions({});
        setFeedbackText('');
        setIsDrawerOpen(true);
    };

    const toggleOption = (qId: string, opt: string, type: string) => {
        setError("");
        const current = selectedOptions[qId] || [];

        if (type === 'single') {
            // Nếu là chọn một: Click cái mới thì thay thế, click cái đang chọn thì bỏ chọn
            setSelectedOptions({
                ...selectedOptions,
                [qId]: current.includes(opt) ? [] : [opt]
            });
        } else {
            // Nếu là chọn nhiều: Toggle như bình thường
            const next = current.includes(opt)
                ? current.filter(i => i !== opt)
                : [...current, opt];
            setSelectedOptions({ ...selectedOptions, [qId]: next });
        }
    };

    const handleNext = async () => {
        setError("");

        // Kiểm tra câu hỏi hiện tại đã được trả lời chưa
        if (step <= QUESTIONS.length) {
            const currentQuestion = QUESTIONS[step - 1];
            const answers = selectedOptions[currentQuestion._id] || [];

            if (answers.length === 0) {
                setError(t('shop-feedback.error_min_option'));
                return;
            }
        }

        // Bước cuối cùng: Gửi Form
        if (step === totalSteps) {
            if (!feedbackText.trim()) {
                setError(t('shop-feedback.error_empty_feedback'));
                return;
            }

            const formattedAnswers = QUESTIONS.map((q: any) => ({
                questionId: q._id,
                questionTitle: q.title,
                selectedOptions: selectedOptions[q._id] || [],
            }));

            try {
                await submitSurvey({
                    surveyData: formattedAnswers,
                    customerFeedback: feedbackText,
                });

                setIsDrawerOpen(false);
                setIsAntModalOpen(true);
            } catch (err) {
                console.error("Submit error:", err);
            }
            return;
        }

        setStep(step + 1);
    };

    return (
        <div>
            {/* Banner gọi khảo sát */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col md:flex-row items-center justify-between rounded-2xl p-4 border border-border gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-2xl">
                        <MessageSquareHeart className="text-red-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">
                        {t('shop-feedback.description')}
                    </h3>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        disabled={isFetchingQuestions}
                        onClick={handleOpenDrawer}
                        className="flex-1 md:flex-none px-8 py-2 bg-[#cb1c22] text-white rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                        {t('shop-feedback.button.satisfied')}
                    </button>
                    <button
                        disabled={isFetchingQuestions}
                        onClick={handleOpenDrawer}
                        className="flex-1 md:flex-none px-8 py-2 border border-border text-foreground rounded-xl hover:border-primary/40 hover:bg-muted font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                        {t('shop-feedback.button.unsatisfied')}
                    </button>
                </div>
            </motion.div>

            {/* Drawer Khảo sát */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => !isActionLoading && setIsDrawerOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative h-full w-full max-w-[400px] flex flex-col shadow-2xl bg-background"
                        >
                            {/* Header */}
                            <div className="p-4 border-b bg-muted">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {step > 1 && (
                                            <button onClick={() => setStep(step - 1)} className="hover:bg-primary/20 rounded-full p-1 transition-all">
                                                <ChevronLeft size={24} />
                                            </button>
                                        )}
                                        <h3 className="text-2xl font-black text-foreground italic tracking-tight uppercase">
                                            {t('shop-feedback.title')}
                                        </h3>
                                    </div>
                                    <button onClick={() => setIsDrawerOpen(false)} className="hover:bg-red-50 rounded-full p-1 text-muted-foreground">
                                        <X size={28} />
                                    </button>
                                </div>
                                <Progress percent={progressPercent} strokeColor="#cb1c22" showInfo={false} size="small" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="flex justify-center mb-6">
                                    <img src="https://cdn2.fptshop.com.vn/unsafe/D_Sub_5fd89e3cb2.png" alt="icon" className="w-full max-w-[280px] object-contain" />
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isFetchingQuestions ? (
                                            <Skeleton active paragraph={{ rows: 6 }} />
                                        ) : step <= QUESTIONS.length ? (
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-xl font-extrabold text-foreground leading-tight uppercase italic border-l-4 border-red-600 pl-4">
                                                        {QUESTIONS[step - 1].title}
                                                    </h4>
                                                    <p className="text-[11px] text-muted-foreground font-bold ml-5 mt-2 uppercase tracking-tighter">
                                                        {QUESTIONS[step - 1].type === 'single' ? '● Chọn một phương án' : '■ Có thể chọn nhiều'}
                                                    </p>
                                                </div>

                                                <div className="grid gap-3">
                                                    {QUESTIONS[step - 1].options.map((opt: string, i: number) => {
                                                        const currentQ = QUESTIONS[step - 1];
                                                        const isSelected = (selectedOptions[currentQ._id] || []).includes(opt);

                                                        return (
                                                            <label
                                                                key={i}
                                                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer group 
                                                            ${isSelected
                                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                                        : "border-border hover:border-primary/30 "
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`flex-shrink-0 w-6 h-6 border-2 flex items-center justify-center transition-all duration-200
                                                            ${currentQ.type === "single" ? "rounded-full" : "rounded-md"} 
                                                            ${isSelected
                                                                            ? "bg-primary border-primary"
                                                                            : "border-border group-hover:border-primary/50"
                                                                        }`}
                                                                >
                                                                    {isSelected && (
                                                                        currentQ.type === "single"
                                                                            ? <div className="w-2 h-2 bg-white rounded-full" />
                                                                            : <Check size={14} className="text-white" strokeWidth={4} />
                                                                    )}
                                                                </div>

                                                                <input
                                                                    type={currentQ.type === "single" ? "radio" : "checkbox"}
                                                                    className="hidden"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleOption(currentQ._id, opt, currentQ.type)}
                                                                />

                                                                <span className={`text-[15px] font-semibold transition-colors 
                                                            ${isSelected ? "text-primary" : "text-foreground"}`}>
                                                                    {opt}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <h4 className="text-xl font-extrabold text-foreground leading-tight uppercase italic border-l-4 border-red-600 pl-4">
                                                    {t('shop-feedback.improve_title')}
                                                </h4>
                                                <Textarea
                                                    placeholder={t('shop-feedback.placeholder')}
                                                    className="min-h-[150px] rounded-2xl p-4"
                                                    value={feedbackText}
                                                    onChange={(e) => {
                                                        setFeedbackText(e.target.value);
                                                        setError("");
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {error && <p className="text-red-600 text-sm font-bold mt-4 animate-pulse">⚠️ {error}</p>}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Footer Button */}
                            <div className="p-4 border-t bg-muted">
                                <button
                                    disabled={isActionLoading}
                                    onClick={handleNext}
                                    className="w-full cursor-pointer bg-[#cb1c22] text-white py-4 rounded-2xl font-black uppercase italic tracking-[1px] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isActionLoading ? t('shop-feedback.button.sending') : step === totalSteps ? t('shop-feedback.button.submit') : t('shop-feedback.button.next')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <Modal
                open={isAntModalOpen}
                onCancel={() => setIsAntModalOpen(false)}
                footer={null}
                centered
                width={400}
                styles={{ content: { borderRadius: '24px', padding: '24px' } }}
            >
                <div className="flex flex-col items-center text-center">
                    <img src="https://cdn2.fptshop.com.vn/unsafe/M_Popup_720ff0eeb3.png" alt="Success" className="w-full mb-4 rounded-xl" />
                    <h3 className="text-2xl font-black mb-1 italic text-foreground uppercase">{t('shop-feedback.success_modal.title')}</h3>
                    <p className="text-muted-foreground mb-6 font-medium px-4">
                        {t('shop-feedback.success_modal.desc')}
                    </p>
                    <button
                        onClick={() => setIsAntModalOpen(false)}
                        className="w-full cursor-pointer bg-red-600 text-white py-3 rounded-2xl font-black text-lg uppercase italic shadow-md active:scale-95 transition-all"
                    >
                        {t('shop-feedback.button.close')}
                    </button>
                </div>
            </Modal>
        </div>
    );
};