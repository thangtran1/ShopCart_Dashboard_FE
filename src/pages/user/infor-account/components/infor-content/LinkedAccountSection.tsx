import { useState } from "react";
import { Button, Modal } from "antd";
import { DisconnectOutlined, LinkOutlined } from "@ant-design/icons";
import { Badge } from "@/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";

interface LinkedAccount {
  key: string;
  name: string;
  icon: string;
  linked: boolean;
  description: string;
}

export default function LinkedAccountSection() {
  const { profile } = useUserProfile();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<LinkedAccount | null>(null);

  const accountConfigs: Omit<LinkedAccount, "linked">[] = [
    {
      key: "google",
      name: "Google",
      icon: "https://www.svgrepo.com/show/475656/google-color.svg",
      description: "Đăng nhập nhanh bằng Google",
    },
    {
      key: "github",
      name: "GitHub",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Github-desktop-logo-symbol.svg/1200px-Github-desktop-logo-symbol.svg.png",
      description: "Liên kết tài khoản GitHub",
    },
    {
      key: "local",
      name: "Email/Local",
      icon: "https://cdn-icons-png.flaticon.com/512/561/561127.png",
      description: "Đăng nhập bằng email và mật khẩu",
    },
  ];

  const accounts: LinkedAccount[] = accountConfigs.map((acc) => ({
    ...acc,
    linked: profile?.providers?.includes(acc.key) || false,
  }));

  const handleUnlinkClick = (account: LinkedAccount) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleConfirmUnlink = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
    toast.success(`Hủy liên kết thành công`)
    // TODO: gọi API hủy liên kết ở đây
  };


  const handleLinkAccount = async (account: LinkedAccount) => {
    setLoadingKey(account.key);
      if (account.key === "google") {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
      }
      if (account.key === "github") {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
    };
  };
  return (
    <div className="rounded-xl border p-5 shadow-sm space-y-2">
      <h2 className="text-lg font-semibold">Tài khoản liên kết</h2>

      <div className="space-y-0">
        {accounts.map((item, idx) => (
          <div
            key={item.key}
            className={`flex flex-col sm:flex-row sm:items-center justify-between transition gap-2 
              ${idx < accounts.length - 1 ? "border-b border-error/40 pb-4" : ""} 
              pt-4`}
          >
            {/* Left */}
            <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
              <div className="border border-border rounded-full p-2">
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-gray-500">{item.description}</span>
              </div>

              {item.linked ? (
                <Badge variant="success" className="shrink-0">
                  Đã liên kết
                </Badge>
              ) : (
                <Badge variant="error" className="shrink-0">
                  Chưa liên kết
                </Badge>
              )}
            </div>

            {/* Right action */}
            <div className="mt-2 sm:mt-0 shrink-0">
              {item.linked ? (
                <Button
                  type="link"
                  danger
                  icon={<DisconnectOutlined />}
                  onClick={() => handleUnlinkClick(item)}
                >
                  Hủy liên kết
                </Button>
              ) : (
                <Button
                type="link"
                icon={<LinkOutlined />}
                onClick={() => handleLinkAccount(item)}
                loading={loadingKey === item.key} // hiển thị loading
              >
                Liên kết
              </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        centered
        closable={false}
        footer={null}
        width={300}
        className="!text-center"
      >
        <h3 className="text-lg font-semibold mb-1">Huỷ liên kết tài khoản</h3>
        <p className="text-sm text-muted-foreground mb-3">
        Bạn có chắc chắn muốn hủy liên kết tài khoản {selectedAccount?.name} không?
        </p>

        <div className="flex justify-center gap-2">
          <Button
            type="default"
            onClick={() => {
              handleConfirmUnlink();
            }}
            className="flex-1 !rounded-lg"

          >
            Hủy liên kết
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              setIsModalOpen(false);
            }}
            className="flex-1 !rounded-lg"

          >
            Ở lại trang
          </Button>
        </div>
      </Modal>
    </div>
  );
}