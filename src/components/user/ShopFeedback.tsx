import React, { useState } from "react";
import { X, Check, ChevronLeft } from "lucide-react";
import { Modal } from "antd"; // Import Modal từ Ant Design

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
    const [isAntModalOpen, setIsAntModalOpen] = useState(false); // State cho Modal Antd
    const [step, setStep] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});

    const handleOpenDrawer = () => {
        setStep(1);
        setIsDrawerOpen(true);
    };

    const handleNext = () => {
        // Nếu đang ở bước cuối (Textarea), nhấn tiếp sẽ đóng Drawer và mở Modal Antd
        if (step === QUESTIONS.length + 1) {
            setIsDrawerOpen(false); // Đóng Drawer trượt phải
            setIsAntModalOpen(true); // Mở Modal Ant Design
        } else {
            setStep(step + 1);
        }
    };

    const toggleOption = (qId, opt) => {
        const current = selectedOptions[qId] || [];
        const next = current.includes(opt) ? current.filter(i => i !== opt) : [...current, opt];
        setSelectedOptions({ ...selectedOptions, [qId]: next });
    };

    return (
        <div>
            {/* Banner chính */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-primary mx-auto">
                <h3 className="text-lg font-bold">Bạn có hài lòng với trải nghiệm trên trang chủ FPT Shop không?</h3>
                <div className="flex gap-3">
                    <button onClick={handleOpenDrawer} className="px-6 py-2 border border-red-500 text-red-500 rounded-full font-bold hover:bg-red-50 transition-all cursor-pointer">Hài lòng</button>
                    <button onClick={handleOpenDrawer} className="px-6 py-2 border border-red-500 text-red-500 rounded-full font-bold hover:bg-red-50 transition-all cursor-pointer">Không hài lòng</button>
                </div>
            </div>

            {/* Drawer trượt phải */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
                    <div className="relative h-full w-full max-w-[500px] bg-white flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">

                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-2">
                                {step > 1 && <button onClick={() => setStep(step - 1)} className="hover:bg-background cursor-pointer rounded-full"><ChevronLeft /></button>}
                                <h3 className="text-2xl font-bold">Khảo sát trải nghiệm</h3>
                            </div>
                            <button className="cursor-pointer" onClick={() => setIsDrawerOpen(false)}><X size={24} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex justify-center mb-6">
                                <img src="https://cdn2.fptshop.com.vn/unsafe/D_Sub_5fd89e3cb2.png" alt="icon" className="w-196" />
                            </div>

                            {step <= QUESTIONS.length ? (
                                /* Các bước câu hỏi */
                                <div className="animate-in fade-in slide-in-from-bottom-4">
                                    <h4 className="text-lg font-bold mb-6 italic uppercase">{QUESTIONS[step - 1].title}</h4>
                                    <div className="space-y-3">
                                        {QUESTIONS[step - 1].options.map((opt, i) => (
                                            <label key={i} className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 accent-red-600 cursor-pointer"
                                                    checked={(selectedOptions[QUESTIONS[step - 1].id] || []).includes(opt)}
                                                    onChange={() => toggleOption(QUESTIONS[step - 1].id, opt)}
                                                />
                                                <span className="text-[15px] font-medium group-hover:text-red-600 transition-colors">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Bước cuối cùng trước khi đóng Drawer */
                                <div className="animate-in fade-in slide-in-from-bottom-4">
                                    <h4 className="text-lg font-bold mb-4 italic uppercase">Bạn mong muốn Shop_Cart TVT cải thiện hoặc bổ sung gì cho trang chủ?</h4>
                                    <textarea
                                        className="w-full h-40 p-4 rounded-xl border border-primary/20 focus:border-primary/40 outline-none transition-all"
                                        placeholder="Vui lòng nhập nội dung góp ý tại đây..."
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t">
                            <button
                                onClick={handleNext}
                                className="w-full cursor-pointer bg-[#cb1c22] text-white py-4 rounded-xl font-bold uppercase italic tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95"
                            >
                                {step === QUESTIONS.length + 1 ? "Hoàn thành" : "Tiếp theo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Cảm ơn của Ant Design */}
            <Modal
                open={isAntModalOpen}
                onCancel={() => setIsAntModalOpen(false)}
                footer={null}
                centered
                width={400}
                closeIcon={<X size={20} className="text-gray-400" />}
            >
                <div className="flex flex-col items-center text-center">
                    <img
                        src="https://cdn2.fptshop.com.vn/unsafe/M_Popup_720ff0eeb3.png"

                        alt="Success"
                        className="w-full mb-4"
                    />
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        🎉 Cảm ơn bạn đã dành thời gian phản hồi!
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        Ý kiến của bạn là nguồn cảm hứng để FPT Shop tiếp tục cải thiện và phục vụ tốt hơn mỗi ngày.
                    </p>
                    <button
                        onClick={() => setIsAntModalOpen(false)}
                        className="w-full cursor-pointer bg-[#cb1c22] text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 shadow-md transition-all active:scale-95"
                    >
                        Đóng
                    </button>
                </div>
            </Modal>
        </div>
    );
};