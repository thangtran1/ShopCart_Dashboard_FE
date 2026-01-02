import { Badge } from "@/ui/badge";
import { EyeInvisibleOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar } from "antd";
import { useOrder } from "@/hooks/useOrder";

export function Header() {
  const { profile } = useUserProfile();
  const [showPhone, setShowPhone] = useState(false);
  const { orders } = useOrder();
  const orderCount = orders?.length || 0;

  const phone = profile?.phone ?? "";
  const maskedPhone = phone.replace(/^(\d{3})\d+(\d{2})$/, "$1****$2");
  const avatarUrl = profile?.avatar ? `${import.meta.env.VITE_API_URL}${profile.avatar}` : undefined;

  return (
    <div className="border border-success/30 shadow-md rounded-xl p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-b from-[#fff5f0] to-[#f4c8d0] overflow-hidden">
            <Avatar size={64} icon={<UserOutlined />} src={avatarUrl} className="border-2 border-border" />
          </div>

          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-semibold truncate">
              {profile?.name}
            </h1>

            <div className="flex items-center gap-3 text-foreground">
              <span className="tracking-wide">{showPhone ? phone : maskedPhone}</span>
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="flex cursor-pointer items-center justify-center text-lg md:text-xl text-foreground hover:opacity-80 transition"
              >
                {showPhone ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>

            <Badge variant="info">{profile?.role?.toUpperCase() ?? "TVT-NULL"}</Badge>
          </div>
        </div>

        {/* Divider đỏ: đứng trên md, ngang dưới md */}
        <div className="w-full h-px md:h-12 md:w-px bg-error/60" />

        <div className="flex items-center gap-3 md:min-w-[180px]">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-b from-[#fff5f0] to-[#f4c8d0]">
            <img
              src="https://cdn-static.smember.com.vn/_next/static/media/cart-icon.3e4e1d83.svg"
              alt="Cart"
              className="w-6 h-6"
            />
          </div>

          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-error/70 text-error font-semibold">
                {orderCount}
              </span>
            </div>
            <p className="text-xs text-foreground mt-1">
              Tổng số đơn hàng đã mua
            </p>
          </div>
        </div>

        <div className="w-full h-px md:h-12 md:w-px bg-error/60" />

        <div className="flex items-center gap-3 md:min-w-[260px]">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-b from-[#fff5f0] to-[#f4c8d0] border border-white/60 shadow-sm">
            <img
              src="https://cdn-static.smember.com.vn/_next/static/media/money-icon.3e6b67af.svg"
              alt="Money"
              className="w-6 h-6"
            />
          </div>

          <div className="min-w-0">
            <p className="text-lg font-semibold leading-tight">0đ</p>
            <p className="text-xs md:text-sm text-foreground truncate">
              Cần thêm 3.000.000đ để lên T-NEW
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
