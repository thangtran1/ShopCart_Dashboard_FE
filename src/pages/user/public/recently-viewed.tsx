"use client";

import { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import useStore from "@/store/store";
import { Button, Modal, Carousel } from "antd";
import { DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { toast } from "sonner";

export const RecentlyViewed = () => {
    const { t } = useTranslation();
    const { viewedProducts, clearRecentlyViewed } = useStore();
    const [mounted, setMounted] = useState(false);
    const [openClearModal, setOpenClearModal] = useState(false);

    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef<any>(null);
    const [slidesToShow, setSlidesToShow] = useState(5);

    const handleConfirmClear = () => {
        try {
            clearRecentlyViewed();
            setOpenClearModal(false);
            toast.success(t("recently-viewed.clear_success"));
        } catch (error) {
            toast.error(t("recently-viewed.clear_error"));
        }
    };

    useEffect(() => {
        setMounted(true);
        const updateSlidesToShow = () => {
            const width = window.innerWidth;
            if (width < 640) setSlidesToShow(2);
            else if (width < 768) setSlidesToShow(2);
            else if (width < 1024) setSlidesToShow(3);
            else if (width < 1280) setSlidesToShow(4);
            else setSlidesToShow(5);
        };

        updateSlidesToShow();
        window.addEventListener("resize", updateSlidesToShow);
        return () => window.removeEventListener("resize", updateSlidesToShow);
    }, []);

    if (!mounted || viewedProducts.length === 0) return null;

    const isCarouselActive = viewedProducts.length > slidesToShow;
    const canGoPrev = currentSlide > 0;

    const canGoNext = currentSlide < (viewedProducts.length - slidesToShow);

    const carouselSettings = {
        dots: false,
        infinite: false,
        speed: 400,
        slidesToScroll: 1,
        swipeToSlide: true,
        afterChange: (current: number) => {
            setCurrentSlide(current);
        },
    };

    return (
        <>
            <section className="space-y-4 border border-border rounded-2xl p-4 bg-muted/10 relative group overflow-hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-xl md:text-2xl font-bold italic uppercase tracking-tight">
                            {t("recently-viewed.viewed")}
                        </h2>
                    </div>

                    <Button
                        type="primary"
                        danger
                        onClick={() => setOpenClearModal(true)}
                        icon={<DeleteOutlined />}
                    >
                        <span className="hidden sm:inline">{t("recently-viewed.clear_all")}</span>
                    </Button>
                </div>

                <div className="relative">
                    {isCarouselActive ? (
                        <>
                            <button
                                onClick={() => carouselRef.current?.prev()}
                                className={`absolute -left-4 top-1/2 -translate-y-1/2 z-30 
                                    w-7 h-14 flex items-center justify-center
                                    backdrop-blur-md bg-muted/90 border border-l-0 border-primary/30
                                    rounded-r-full shadow-lg text-foreground
                                    transition-all duration-300
                                    ${canGoPrev
                                        ? "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                                        : "opacity-0 pointer-events-none"}`}
                            >
                                <LeftOutlined className="text-lg -ml-1" />
                            </button>

                            <Carousel
                                key={slidesToShow}
                                ref={carouselRef}
                                slidesToShow={slidesToShow}
                                {...carouselSettings}
                                className="px-2"
                            >
                                {viewedProducts.map((product) => (
                                    <div key={product._id} className="px-1">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </Carousel>

                            <button
                                onClick={() => carouselRef.current?.next()}
                                className={`absolute -right-4 top-1/2 -translate-y-1/2 z-30 
                                    w-7 h-14 flex items-center justify-center
                                    backdrop-blur-md bg-muted/90 border border-r-0 border-primary/30
                                    rounded-l-full shadow-lg text-foreground
                                    transition-all duration-300
                                    ${canGoNext
                                        ? "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                                        : "opacity-0 pointer-events-none"}`}
                            >
                                <RightOutlined className="text-lg -mr-1" />
                            </button>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {viewedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Modal
                open={openClearModal}
                onCancel={() => setOpenClearModal(false)}
                centered
                closable={false}
                footer={null}
                width={320}
                className="!text-center"
            >
                <h3 className="text-lg font-semibold mb-1">
                    {t("recently-viewed.modal.title")}
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                    {t("recently-viewed.modal.decs")}
                </p>

                <div className="flex justify-center gap-2">
                    <Button
                        type="primary"
                        danger
                        className="flex-1 !rounded-lg"
                        onClick={handleConfirmClear}
                    >
                        {t("recently-viewed.modal.delete")}

                    </Button>

                    <Button
                        type="default"
                        className="flex-1 !rounded-lg"
                        onClick={() => setOpenClearModal(false)}
                    >
                        {t("recently-viewed.modal.cancel")}
                    </Button>
                </div>
            </Modal>
        </>
    );
};



