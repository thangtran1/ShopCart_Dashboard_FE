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
            className={`flex gap-2 flex-nowrap ${isClient && images.length * 77 < window.innerWidth - 120 ? "mx-auto" : ""
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