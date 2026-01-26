"use client";
import { useState, useEffect } from "react";
import { Button, Image } from "antd";
import {
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { CheckCircle2, Info, LayoutGrid, StarIcon, X } from "lucide-react";
import ProductSideMenu from "@/pages/user/public/ProductSideMenu";
import { useTranslation } from "react-i18next";
import { Separator } from "@/ui/separator";
import { motion, AnimatePresence } from "framer-motion";


interface ImageViewProps {
  images?: { url: string; alt?: string }[];
  isStock?: number;
  product?: any;
}

export default function ImageView({
  images = [],
  isStock,
  product,
}: ImageViewProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const specs = (product?.specifications as string[]) || [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!images.length) return null;

  const displayIndex = hoverIndex ?? activeIndex;

  const prev = () =>
    setActiveIndex((p) => (p === 0 ? images.length - 1 : p - 1));

  const next = () =>
    setActiveIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  const commitmentList = [
    {
      id: 1,
      iconUrl: "https://cdn2.fptshop.com.vn/svg/Type_Bao_hanh_chinh_hang_4afa1cb34d.svg",
      text: t('product.commitment.feature_1'),
    },
    {
      id: 2,
      iconUrl: "https://cdn2.fptshop.com.vn/svg/Type_Giao_hang_toan_quoc_318e6896b4.svg",
      text: t('product.commitment.feature_2'),
    },
    {
      id: 3,
      iconUrl: "https://cdn2.fptshop.com.vn/svg/Type_Doi_tra_ff3d266f2b.svg",
      text: t('product.commitment.feature_3'),
    },
    {
      id: 4,
      iconUrl: "https://cdn2.fptshop.com.vn/svg/icon_ktv_8c9caa2c06.svg",
      text: t('product.commitment.feature_4'),
    },
  ];

  return (
    <div className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t("breadcrumb.home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">{t("breadcrumb.shop")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("breadcrumb.detail")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-2">
        <h2 className="text-2xl font-bold line-clamp-1">{product?.name}</h2>
        <p className="text-sm mt-1 text-muted-foreground line-clamp-1">
          {product?.shortDescription}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-b py-3">
        <div className="flex relative items-center gap-1">
          <ProductSideMenu
            className="relative top-0 right-0"
            product={product}
          />
          <span>{t("product.favorite")}</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer hover:text-green-500 transition-colors">
          <Info size={15} />
          <span>{t("product.specifications")}</span>
        </div>
        
        <div className="flex justify-end gap-0.5 text-xs">
          {[...Array(5)].map((_, index) => (
            <StarIcon
              key={index}
              size={20}
              className="text-shop_light_green"
              fill="#3b9c3c"
            />
          ))}
          <p className="font-semibold">(120)</p>
        </div>
      </div>

      {/* MAIN IMAGE */}
      <div
        className={`
          w-full h-[450px] bg-white rounded-md shadow overflow-hidden 
          flex items-center justify-center cursor-zoom-in
          transition-all duration-300 mt-4
          ${isStock === 0 ? "opacity-50" : "hover:shadow-lg"}
        `}
        onClick={() => setPreviewVisible(true)}
      >
        <img
          src={images[displayIndex]?.url}
          alt="product-main"
          className="w-full h-full object-contain"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex items-center gap-2 my-3">
        <Button
          onClick={prev}
          disabled={activeIndex === 0}
          shape="circle"
          icon={<LeftOutlined />}
        />

        <div className="flex overflow-hidden flex-1">
          <div
            className={`flex gap-2 flex-nowrap ${
              isClient && images.length * 77 < window.innerWidth - 120 ? "mx-auto" : ""
            }`}
          >
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className={`w-[75px] h-[75px] flex-shrink-0 flex items-center justify-center border p-1 rounded-md cursor-pointer transition-all
                ${displayIndex === i ? "border-primary scale-105 shadow-md" : "border-border opacity-75"}`}
              >
                <img src={img.url} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={next}
          disabled={activeIndex === images.length - 1}
          shape="circle"
          icon={<RightOutlined />}
        />
      </div>

      <div className="md:col-span-2 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">
            {t("product_page.specs.title")}
          </h3>
          {specs.length > 4 && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-fit md:flex-none px-6 py-2 border border-border text-foreground rounded-xl hover:border-primary/40 hover:bg-muted font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {t("product_page.specs.view_all")}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {specs.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 border border-border bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 bg-background rounded-lg shadow-sm">
                <LayoutGrid className="w-4 h-4 text-primary/70" />
              </div>
              <span className="text-sm font-medium leading-tight">{item}</span>
            </div>
          ))}
        </div>

        <AnimatePresence
          onExitComplete={() => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }}
        >
          {isDrawerOpen && (
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
                onClick={() => setIsDrawerOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                onWheel={(e) => e.stopPropagation()}
                className="relative h-full w-full max-w-[400px] flex flex-col shadow-2xl bg-background"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight break-words max-w-[80%] line-clamp-2">
                    {t("product_page.specs.title")}
                  </h3>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
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
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full cursor-pointer py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    {t("product_page.button.close")}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <Separator className="my-6" />

      <div className="mt-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground tracking-tight">
            {t('product.commitment_title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
          {commitmentList.map((policy) => (
            <div key={policy.id} className="flex items-center gap-3.5 group">
              <div className="shrink-0 w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110">
                <img
                  src={policy.iconUrl}
                  alt="policy-icon"
                  className="w-full h-full object-contain dark:invert dark:brightness-200 transition-all duration-300"
                />
              </div>
              <span className="text-[14.5px] font-medium text-foreground leading-snug">
                {policy.text}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            onVisibleChange: (vis) => setPreviewVisible(vis),
            current: activeIndex,
          }}
        >
          {images.map((img, i) => (
            <Image key={i} src={img.url} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
}