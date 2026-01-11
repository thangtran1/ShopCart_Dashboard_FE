import UserBannerMarquee from "@/components/user/banner-marquee/user-banner";
import { Carousel } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import bannerOne from "@/assets/images/banner/banner2.png";
import bannerTwo from "@/assets/images/banner/banner3.png";
import bannerThree from "@/assets/images/banner/banner4.jpg";
import bannerFour from "@/assets/images/banner/banner5.png";

const banners = [
  { id: 1, type: "book", imageUrl: bannerOne },
  { id: 2, type: "phone", imageUrl: bannerTwo },
  { id: 3, type: "fashion", imageUrl: bannerThree },
  { id: 4, type: "home", imageUrl: bannerFour },
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

        <button
          onClick={() => carouselRef.current.prev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
             w-7 h-14 flex items-center justify-center
             backdrop-blur-md
             border border-l-0 border-primary/40
             rounded-r-full shadow-lg
            bg-muted/70 hover:bg-muted
             transition-all duration-300 group cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 -ml-1 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => carouselRef.current.next()}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
             w-7 h-14 flex items-center justify-center
            backdrop-blur-md
             border border-r-0 border-primary/20
             rounded-l-full shadow-lg
              bg-muted/70 hover:bg-muted
             transition-all duration-300 group cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 -mr-1 group-hover:scale-110 transition-transform" />
        </button>
        <UserBannerMarquee />
      </div>

    </>
  );
};

export default HomeBannerWithCarousel;
