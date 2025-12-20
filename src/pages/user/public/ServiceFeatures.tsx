import {
    ShieldCheck,
    Laptop,
    Watch,
    Calendar,
    PackageCheck,
    Truck,
    Wallet,
    Headset,
  } from "lucide-react";
  
  const FEATURES = [
    {
      icon: ShieldCheck,
      title: "Điện thoại bảo hành",
      highlight: "18 tháng",
    },
    {
      icon: Laptop,
      title: "Laptop bảo hành",
      highlight: "12 tháng",
    },
    {
      icon: Watch,
      title: "Đồng hồ bảo hành",
      highlight: "5 năm",
    },
    {
      icon: Calendar,
      title: "Dùng thử",
      highlight: "7 ngày miễn phí",
      sub: "(đối với hàng cũ)",
    },
    {
      icon: PackageCheck,
      title: "Giữ đặt hàng",
      highlight: "3 ngày miễn phí",
    },
    {
      icon: Truck,
      title: "Gửi hàng đi ngay trong ngày",
      sub: "(đơn lên trước 12:00)",
    },
    {
      icon: Wallet,
      title: "Thanh toán khi nhận hàng",
      sub: "(Daibiki)",
    },
    {
      icon: Headset,
      title: "Hỗ trợ online",
      highlight: "24/7",
    },
  ];
  
  export default function ServiceFeatures() {
    return (
      <div className="grid mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((item, index) => {
          const Icon = item.icon;
  
          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-success/40 p-3 hover:shadow-md transition"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error/10 text-error">
                <Icon className="w-6 h-6" />
              </div>
  
              <div className="text-sm leading-snug">
                <span className="font-medium">
                  {item.title}{" "}
                  {item.highlight && (
                    <span className="text-error/90 font-semibold">
                      {item.highlight}
                    </span>
                  )}
                </span>
                {item.sub && (
                  <div className="text-xs text-muted-foreground">
                    {item.sub}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  