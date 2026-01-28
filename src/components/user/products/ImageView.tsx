"use client";
import { useState, useEffect, useRef } from "react";
import { Button, Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { Info, StarIcon } from "lucide-react";
import ProductSideMenu from "@/pages/user/public/ProductSideMenu";
import { useTranslation } from "react-i18next";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current && isClient) {
      const activeItem = scrollRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex, isClient]);

  if (!images.length) return null;

  const displayIndex = hoverIndex ?? activeIndex;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((p) => (p === images.length - 1 ? 0 : p + 1));
  };

  return (
    <div className="w-full select-none">
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
        <h2 className="text-2xl font-bold line-clamp-1 text-foreground">{product?.name}</h2>
        <p className="text-sm mt-1 text-muted-foreground line-clamp-1 italic">
          {product?.shortDescription}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-b py-3">
        <div className="flex relative items-center gap-1 group cursor-pointer">
          <ProductSideMenu className="relative top-0 right-0" product={product} />
          <span className="group-hover:text-primary transition-colors text-foreground">{t("product.favorite")}</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer hover:text-green-500 transition-colors text-foreground">
          <Info size={15} />
          <span>{t("product.specifications")}</span>
        </div>

        <div className="flex justify-end gap-0.5 text-xs ml-auto items-center">
          {[...Array(5)].map((_, index) => (
            <StarIcon
              key={index}
              size={18}
              className="text-shop_light_green"
              fill="#3b9c3c"
            />
          ))}
          <p className="font-semibold ml-1 text-foreground">(120)</p>
        </div>
      </div>

      {/* MAIN IMAGE: Đã thu nhỏ chiều cao xuống h-[400px] */}
      <div className="relative group mt-4 flex justify-center">
        <div
          className={`
            relative w-full h-[400px] bg-white rounded-2xl shadow-sm border border-gray-100
            flex items-center justify-center cursor-zoom-in overflow-hidden
            transition-all duration-500
            ${isStock === 0 ? "opacity-50 grayscale" : "hover:shadow-lg"}
          `}
          onClick={() => setPreviewVisible(true)}
        >
          <img
            key={displayIndex}
            src={images[displayIndex]?.url}
            alt="product-main"
            className="relative z-10 max-w-[80%] max-h-[80%] object-contain transition-all duration-500 ease-out transform group-hover:scale-110 animate-in fade-in zoom-in duration-300"
          />

          {/* Nút điều hướng */}
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={prev}
              shape="circle"
              size="large"
              className="shadow-md border-none bg-white/80 backdrop-blur-sm hover:!scale-110 transition-transform flex items-center justify-center"
              icon={<LeftOutlined />}
            />
            <Button
              onClick={next}
              shape="circle"
              size="large"
              className="shadow-md border-none bg-white/80 backdrop-blur-sm hover:!scale-110 transition-transform flex items-center justify-center"
              icon={<RightOutlined />}
            />
          </div>
        </div>
      </div>

      {/* THUMBNAILS: Giữ nguyên logic mượt */}
      <div className="flex items-center gap-2 mt-6 px-1">
        <Button
          onClick={prev}
          disabled={activeIndex === 0}
          shape="circle"
          className="flex-shrink-0 flex items-center justify-center"
          icon={<LeftOutlined />}
        />

        <div className="flex-1 overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto no-scrollbar py-2 scroll-smooth snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className={`
                  relative w-[70px] h-[70px] flex-shrink-0 flex items-center justify-center 
                  border-2 rounded-xl cursor-pointer transition-all duration-300 snap-center
                  ${displayIndex === i
                    ? "border-primary scale-105 shadow-md bg-white"
                    : "border-gray-100 opacity-60 hover:opacity-100 bg-gray-50"}
                `}
              >
                <img
                  src={img.url}
                  className="max-w-[85%] max-h-[85%] object-contain rounded-md"
                  alt={`thumb-${i}`}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={next}
          disabled={activeIndex === images.length - 1}
          shape="circle"
          className="flex-shrink-0 flex items-center justify-center"
          icon={<RightOutlined />}
        />
      </div>

      {/* SYNC PREVIEW LOGIC */}
      <div className="hidden">
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            onVisibleChange: (vis) => setPreviewVisible(vis),
            current: activeIndex,
            onChange: (curr) => setActiveIndex(curr),
          }}
        >
          {images.map((img, i) => (
            <Image key={i} src={img.url} />
          ))}
        </Image.PreviewGroup>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}