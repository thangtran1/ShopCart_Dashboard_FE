"use client";
import { useState } from "react";
import { Button, Card, Image } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  SafetyOutlined,
  SyncOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
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
import Title from "@/ui/title";
import { Icon } from "@/components/icon";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  if (!images.length) return null;

  const displayIndex = hoverIndex ?? activeIndex;

  const prev = () =>
    setActiveIndex((p) => (p === 0 ? images.length - 1 : p - 1));

  const next = () =>
    setActiveIndex((p) => (p === images.length - 1 ? 0 : p + 1));
  const commitmentList = [
    {
      icon: <SafetyOutlined style={{ fontSize: 32 }} />,
      title: "Chất lượng đảm bảo",
      desc: "Sản phẩm chính hãng 100%",
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 32 }} />,
      title: "Chất lượng đảm bảo",
      desc: "Sản phẩm chính hãng 100%",
    },
    {
      icon: <SyncOutlined style={{ fontSize: 32 }} />,
      title: "Đổi trả linh hoạt",
      desc: "Hỗ trợ đổi trả trong 7 ngày",
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 32 }} />,
      title: "Dịch vụ tốt nhất",
      desc: "Tư vấn & hỗ trợ nhanh chóng",
    },
  ];
  return (
    <div className="w-full md:w-1/2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Chi tiết sản phẩm</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-2">
        <h2 className="text-2xl font-bold line-clamp-1">{product?.name}</h2>
        <p className="text-sm mt-1 text-muted-foreground line-clamp-1">
          {product?.shortDescription}
        </p>
      </div>

      <div className="mt-4  flex flex-wrap items-center gap-4 border-t border-b py-3">
        <div className="flex relative items-center gap-1">
          <ProductSideMenu
            className="relative top-0 right-0"
            product={product}
          />
          <span>Yêu thích</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer hover:text-green-500 transition-colors">
          <Info size={15} />
          <span>Thông số</span>
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

        <div className="flex gap-3">
          <span className="flex items-center gap-2">
            <Icon icon="solar:eye-bold" className="w-3.5 h-3.5" />
            {product.viewCount || 0}
          </span>
          <span className="flex items-center gap-2">
            <Icon icon="solar:cart-check-bold" className="w-3.5 h-3.5" />
            {product.soldCount || 0}
          </span>
        </div>
      </div>
      {/* Hidden preview group */}
      <Image.PreviewGroup
        preview={{
          visible: previewVisible,
          onVisibleChange: setPreviewVisible,
          current: activeIndex,
          onChange: (i) => setActiveIndex(i),
        }}
      >
        {images.map((img, i) => (
          <Image
            key={i}
            src={img.url}
            style={{ display: "none" }}
            alt={`preview-${i}`}
          />
        ))}
      </Image.PreviewGroup>

      {/* MAIN IMAGE */}
      <div
        className={`
          w-full h-[300px] bg-white rounded-md shadow overflow-hidden 
          flex items-center justify-center cursor-zoom-in
          transition-all duration-300
          ${isStock === 0 ? "opacity-50" : "hover:shadow-lg"}
        `}
        onClick={() => setPreviewVisible(true)}
      >
        <img
          src={images[displayIndex].url}
          className="w-full h-full object-contain transition-transform duration-300"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex items-center gap-2 my-3">
        <Button
          onClick={prev}
          disabled={activeIndex === 0}
          shape="circle"
          size="middle"
          className="bg-white/80 shadow-md text-gray-600 transition-all duration-300 hover:bg-blue-500 hover:text-white"
        >
          <LeftOutlined />
        </Button>

        <div className="flex overflow-hidden flex-1">
          <div
            className={`flex gap-2 flex-nowrap ${images.length * 77 < window.innerWidth - 120 ? "mx-auto" : ""
              }`}
          >
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className={`w-[75px] h-[75px] flex-shrink-0 flex items-center justify-center border border-border p-1 rounded-md cursor-pointer overflow-hidden transition-all duration-300
            ${displayIndex === i
                    ? "!border-primary scale-105 shadow-md"
                    : "opacity-75 hover:opacity-100 hover:scale-105"
                  }`}
              >
                <img
                  src={img.url}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={next}
          disabled={activeIndex === images.length - 1}
          shape="circle"
          size="middle"
          className="bg-white/80 shadow-md text-gray-600 transition-all duration-300 hover:bg-blue-500 hover:text-white"
        >
          <RightOutlined />
        </Button>
      </div>

      <div className="my-5">
        <Title>Cam kết sản phẩm</Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          {commitmentList.map((item, index) => (
            <Card key={index} hoverable className="p-6 text-center rounded-xl">
              <div className="text-success">{item.icon}</div>
              <h3 className="text-foreground mt-2 font-semibold">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
