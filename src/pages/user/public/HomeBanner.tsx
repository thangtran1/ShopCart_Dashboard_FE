import UserBannerMarquee from "@/components/user/banner-marquee/user-banner";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import { useRef } from "react";

const banners = [
  { id: 1, type: "book", imageUrl: "/images/banner/banner2.png" },
  { id: 2, type: "phone", imageUrl: "/images/banner/banner3.png" },
  { id: 3, type: "fashion", imageUrl: "/images/banner/banner4.jpg" },
  { id: 4, type: "home", imageUrl: "/images/banner/banner5.png" },
];

const CustomBannerItem = ({ imageUrl, type }: { imageUrl: string; type: string }) => {
  return (
    <div className="flex justify-center">
      <img
        src={imageUrl}
        alt={`banner_${type}`}
        className="w-full h-56 object-cover rounded-t-xl shadow-md"
      />
    </div>
  );
};

const HomeBannerWithCarousel = () => {
  const carouselRef = useRef<any>(null);

  return (
    <>
      <div className="relative">
        {/* Carousel */}
        <Carousel
          ref={carouselRef}
          autoplay
          dots
          infinite
          slidesToShow={2}
          slidesToScroll={2}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
          className="rounded-lg"
        >
          {banners.map((item) => (
            <div key={item.id}>
              <CustomBannerItem imageUrl={item.imageUrl} type={item.type} />
            </div>
          ))}
        </Carousel>

        {/* Prev Button */}
        <button
          onClick={() => carouselRef.current.prev()}
          className="absolute cursor-pointer top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary/80 shadow-lg transition z-10"
        >
          <LeftOutlined />
        </button>

        {/* Next Button */}
        <button
          onClick={() => carouselRef.current.next()}
          className="absolute cursor-pointer top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary/80 shadow-lg transition z-10"
        >
          <RightOutlined />
        </button>
        <UserBannerMarquee />
      </div>

    </>
  );
};

export default HomeBannerWithCarousel;
