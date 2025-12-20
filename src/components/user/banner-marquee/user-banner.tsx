import { memo, useMemo } from "react";
import { useActiveBanners } from "@/hooks/useBanner";

const UserBannerMarquee = memo(() => {
  const { banners, settings, loading } = useActiveBanners();

  // Memoize computed values để tránh re-render không cần thiết
  const bannerData = useMemo(() => {
    if (loading || !banners.length || !settings?.isActive) {
      return null;
    }

    // Sắp xếp banner theo thứ tự
    const sortedBanners = banners.sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    // Tạo chuỗi nội dung liên tục
    const bannerContent = sortedBanners
      .map((banner) => banner.content)
      .join(" • ");

    // Tính toán thời gian animation dựa trên tốc độ cuộn
    const animationDuration = Math.max(5, 100 - (settings.scrollSpeed || 60));

    // Khoảng cách giữa các banner
    const spacing = settings.bannerSpacing || 30;

    return {
      content: bannerContent,
      animationDuration,
      spacing,
      backgroundColor: settings.backgroundColor,
      textColor: settings.textColor,
    };
  }, [banners, settings, loading]);

  // Không render nếu không có data
  if (!bannerData) {
    return null;
  }

  return (
    <div
      className="w-full rounded-b-2xl overflow-hidden py-2 border-b"
      style={{
        backgroundColor: bannerData.backgroundColor,
        color: bannerData.textColor,
      }}
    >
      <div
        className="whitespace-nowrap animate-marquee font-medium text-sm flex items-center"
        style={{
          animationDuration: `${bannerData.animationDuration}s`,
          gap: `${bannerData.spacing}px`,
        }}
      >
        {banners.map((banner, index) => (
          <span key={`${banner.id}-${index}`} className="inline-block">
            {banner.content}
            {index < banners.length - 1 && (
              <span
                className="inline-block text-center"
                style={{
                  marginLeft: `${bannerData.spacing / 2}px`,
                  marginRight: `${bannerData.spacing / 2}px`,
                }}
              >
                •
              </span>
            )}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee ${bannerData.animationDuration}s linear infinite;
        }
      `}</style>
    </div>
  );
});

UserBannerMarquee.displayName = "UserBannerMarquee";

export default UserBannerMarquee;
