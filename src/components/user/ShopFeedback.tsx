import { useState } from "react";
import { X, Check, ChevronLeft, MessageSquareHeart } from "lucide-react";
import { Modal, Progress } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/ui/textarea";


const QUESTIONS = [
    {
        id: 1,
        title: "Khi vào trang chủ, bạn thường quan tâm đến các thông tin gì?",
        options: [
            "Các chương trình khuyến mãi",
            "Sản phẩm giảm giá",
            "Sản phẩm đang bán chạy",
            "Khám phá sản phẩm mới",
            "Gợi ý sản phẩm theo nhu cầu",
            "Xem các tin tức công nghệ",
            "Tìm kiếm danh mục sản phẩm (SIM, trả góp...)",
        ],
    },
    {
        id: 2,
        title: "Bạn có hài lòng với tốc độ truy cập trang web không?",
        options: ["Rất hài lòng", "Hài lòng", "Bình thường", "Không hài lòng"],
    }
];

export const ShopFeedBack = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAntModalOpen, setIsAntModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({});
    const [error, setError] = useState("");
    const [feedbackText, setFeedbackText] = useState("");

    const totalSteps = QUESTIONS.length + 1;
    const progressPercent = Math.round((step / totalSteps) * 100);

    const handleOpenDrawer = () => {
        setStep(1);
        setSelectedOptions({});
        setFeedbackText('')
        setIsDrawerOpen(true);
    };

    const handleNext = () => {
        setError("");

        if (step <= QUESTIONS.length) {
            const qId = QUESTIONS[step - 1].id;
            const answers = selectedOptions[qId] || [];

            if (answers.length === 0) {
                setError("Vui lòng chọn ít nhất một câu trả lời.");
                return;
            }
        }

        if (step === totalSteps) {
            if (!feedbackText.trim()) {
                setError("Vui lòng nhập nội dung góp ý.");
                return;
            }

            const formattedAnswers = QUESTIONS.map((q) => ({
                questionId: q.id,
                questionTitle: q.title, 
                selectedOptions: selectedOptions[q.id] || [],
            }));

            const payload = {
                surveyData: formattedAnswers,
                customerFeedback: feedbackText,
                submittedAt: new Date().toISOString(),
            };

            console.log("🚀 GỬI API VỚI PAYLOAD:", payload);

            setIsDrawerOpen(false);
            setIsAntModalOpen(true);

            setFeedbackText("");
            setSelectedOptions({});
            return;
        }

        setStep(step + 1);
    };


    const toggleOption = (qId: number, opt: string) => {
        setError("");
        const current = selectedOptions[qId] || [];
        const next = current.includes(opt) ? current.filter(i => i !== opt) : [...current, opt];
        setSelectedOptions({ ...selectedOptions, [qId]: next });
    };

    return (
        <div>
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
                        Bạn có hài lòng với trải nghiệm trên trang chủ Shop Cart TVT không?
                    </h3>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={handleOpenDrawer} className="flex-1 md:flex-none px-8 py-2 bg-[#cb1c22] text-white rounded-xl font-bold transition-all cursor-pointer">Hài lòng</button>
                    <button onClick={handleOpenDrawer} className="flex-1 md:flex-none px-8 py-2 border border-border text-foreground rounded-xl hover:border-primary/40 hover:bg-muted  font-bold transition-all cursor-pointer">Không hài lòng</button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isDrawerOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsDrawerOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative h-full w-full max-w-[400px] flex flex-col shadow-2xl"
                        >
                            <div className="p-4 border-b bg-muted">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {step > 1 && (
                                            <button onClick={() => setStep(step - 1)} className="hover:bg-primary/20 rounded-full transition-all cursor-pointer">
                                                <ChevronLeft size={24} />
                                            </button>
                                        )}
                                        <h3 className="text-2xl font-black text-foreground italic tracking-tight">KHẢO SÁT</h3>
                                    </div>
                                    <button onClick={() => setIsDrawerOpen(false)} className="hover:bg-error/20 rounded-2xl text-muted-foreground transition-all cursor-pointer">
                                        <X size={28} />
                                    </button>
                                </div>
                                <Progress percent={progressPercent} strokeColor="#cb1c22" showInfo={false} size="small" />
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-background">
                                <div className="flex justify-center mb-8">
                                    <img src="https://cdn2.fptshop.com.vn/unsafe/D_Sub_5fd89e3cb2.png" alt="icon" className="w-full max-w-[320px] object-contain" />
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {step <= QUESTIONS.length ? (
                                            <div className="space-y-6">
                                                <h4 className="text-xl font-extrabold text-foreground leading-tight uppercase italic border-l-4 border-red-600 pl-4">
                                                    {QUESTIONS[step - 1].title}
                                                </h4>


                                                <div className="grid gap-3">
                                                    {QUESTIONS[step - 1].options.map((opt, i) => {
                                                        const isSelected = (selectedOptions[QUESTIONS[step - 1].id] || []).includes(opt);
                                                        return (
                                                            <label key={i} className={`flex items-center gap-4 p-3 rounded-2xl border transition-all cursor-pointer group ${isSelected ? 'border-primary/40 bg-primary/20' : 'border-border bg-muted hover:border-primary/20'}`}>
                                                                <div className={`flex-shrink-0 w-6 h-6 rounded-md border border-primary/20 flex items-center justify-center transition-all ${isSelected ? 'bg-muted border-error/60 shadow-lg' : 'border-border'}`}>
                                                                    {isSelected && <Check size={14} className="text-foreground" strokeWidth={4} />}
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="hidden"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleOption(QUESTIONS[step - 1].id, opt)}
                                                                />
                                                                <span className='text-[15px] font-bold'>{opt}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                                {error && (
                                                    <p className="text-red-600 font-semibold">
                                                        {error}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <h4 className="text-xl font-extrabold text-foreground leading-tight uppercase italic border-l-4 border-red-600 pl-4">
                                                    Bạn mong muốn Shop_Cart TVT cải thiện điều gì?
                                                </h4>
                                                <Textarea
                                                    placeholder="Vui lòng nhập nội dung góp ý tại đây..."
                                                    value={feedbackText}
                                                    onChange={(e) => {
                                                        setFeedbackText(e.target.value);
                                                        setError("");
                                                    }}
                                                />
                                                {error && (
                                                    <p className="text-red-600 font-semibold">
                                                        {error}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <div className="p-4 border-t bg-muted">
                                <button
                                    onClick={handleNext}
                                    className="w-full cursor-pointer bg-[#cb1c22] text-white py-3 rounded-2xl font-black uppercase italic tracking-[2px] transition-all  active:scale-95"
                                >
                                    {step === totalSteps ? "Gửi phản hồi" : "Tiếp theo"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Modal
                open={isAntModalOpen}
                onCancel={() => setIsAntModalOpen(false)}
                footer={null}
                centered
                width={400}
                closeIcon={<div className="p-1 rounded-full"><X size={18} /></div>}
                styles={{ content: { borderRadius: '16px', padding: '16px' } }}
            >
                <div className="flex flex-col items-center text-center">
                    <img src="https://cdn2.fptshop.com.vn/unsafe/M_Popup_720ff0eeb3.png" alt="Success" className="w-full mb-4" />

                    <h3 className="text-2xl font-black mb-1 italic text-foreground uppercase">Cảm ơn bạn đã dành thời gian phản hồi!</h3>
                    <p className="text-muted-foreground mb-6 font-medium px-2">
                        Ý kiến của bạn là nguồn cảm hứng để Shop Cart TVT tiếp tục cải thiện và phục vụ tốt hơn mỗi ngày.
                    </p>
                    <button
                        onClick={() => setIsAntModalOpen(false)}
                        className="w-full cursor-pointer bg-red-600 text-white py-2 rounded-xl font-bold text-lg transition-all active:scale-95 uppercase italic"
                    >
                        Đóng
                    </button>
                </div>
            </Modal>
        </div>
    );
};