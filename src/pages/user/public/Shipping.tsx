"use client";
import { useTranslation } from "react-i18next";

export default function Shipping() {
    const { t } = useTranslation();
    const extraData = [
        {
            title: t("brands.extra.shipping_title"),
            description: t("brands.extra.shipping_desc"),
            imageUrl: "https://cdn2.fptshop.com.vn/estore-v2/img/icons/policy3.svg",
        },
        {
            title: t("brands.extra.return_title"),
            description: t("brands.extra.return_desc"),
            imageUrl: "https://cdn2.fptshop.com.vn/estore-v2/img/icons/policy4.svg",
        },
        {
            title: t("brands.extra.support_title"),
            description: t("brands.extra.support_desc"),
            imageUrl: "https://cdn2.fptshop.com.vn/estore-v2/img/icons/policy1.svg",
        },
        {
            title: t("brands.extra.guarantee_title"),
            description: t("brands.extra.guarantee_desc"),
            imageUrl: "https://cdn2.fptshop.com.vn/estore-v2/img/icons/policy2.svg",
        },
    ];

    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                {extraData.map((item, index) => (
                    <div
                        key={index}
                        className="relative overflow-hidden group p-6 rounded-3xl bg-white dark:bg-card border border-border hover:shadow-xl transition-all duration-300"
                    >
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />

                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-15 h-15 object-contain group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                                    }}
                                />
                            </div>

                            <div>
                                <h4 className="text-lg font-bold">{item.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}