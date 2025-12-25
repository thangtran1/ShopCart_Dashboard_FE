import { Button } from "antd";
import {
  DisconnectOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Badge } from "@/ui/badge";

interface LinkedAccount {
  key: string;
  name: string;
  icon: string;
  linked: boolean;
  description: string;
}

export default function LinkedAccountSection() {
  const accounts: LinkedAccount[] = [
    {
      key: "google",
      name: "Google",
      icon: "https://www.svgrepo.com/show/475656/google-color.svg",
      linked: true,
      description: "Đăng nhập nhanh bằng Google",
    },
    {
      key: "facebook",
      name: "Facebook",
      icon: "https://www.svgrepo.com/show/475647/facebook-color.svg",
      linked: false,
      description: "Liên kết tài khoản Facebook",
    },
  ];

  return (
    <div className="rounded-xl border p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Tài khoản liên kết</h2>

      <div className="space-y-3">
        {accounts.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-lg border p-4 hover:border-primary/50 transition"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <img
                src={item.icon}
                alt={item.name}
                className="w-5 h-5"
              />

              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-gray-500">
                  {item.description}
                </span>
              </div>

              {item.linked ? (
                <Badge variant={'success'}>Đã liên kết</Badge>
              ) : (
                <Badge variant={'error'}>Chưa liên kết</Badge>
              )}
            </div>

            {/* Right action */}
            {item.linked ? (
              <Button
                type="link"
                danger
                icon={<DisconnectOutlined />}
              >
                Hủy liên kết
              </Button>
            ) : (
              <Button
                type="link"
                icon={<LinkOutlined />}
              >
                Liên kết
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
