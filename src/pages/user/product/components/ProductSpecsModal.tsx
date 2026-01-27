"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProductSpecsModalProps {
    isOpen: boolean;
    onClose: () => void;
    specs: string[];
}

export default function ProductSpecsModal({ isOpen, onClose, specs }: ProductSpecsModalProps) {
    const { t } = useTranslation();

    return (
        <AnimatePresence
            onExitComplete={() => {
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
            }}
        >
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onAnimationStart={() => {
                            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                            document.body.style.overflow = "hidden";
                            document.body.style.paddingRight = `${scrollbarWidth}px`;
                        }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] touch-none"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className="relative h-full w-full max-w-[400px] flex flex-col shadow-2xl bg-background"
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight break-words max-w-[80%] line-clamp-2">
                                {t("product_page.specs.title")}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
                            style={{ overscrollBehavior: 'contain' }}
                        >
                            {specs.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border shadow-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5 opacity-70" />
                                    <span className="text-[14px] font-medium leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t bg-muted/20">
                            <button
                                onClick={onClose}
                                className="w-full cursor-pointer py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                            >
                                {t("product_page.button.close")}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}