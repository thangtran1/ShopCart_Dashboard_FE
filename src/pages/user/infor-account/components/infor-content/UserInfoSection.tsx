import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Gender } from "@/types/enum";
import { Badge } from "@/ui/badge";

export default function UserInfoSection({ profile, onEdit, addresses }: any) {
  const defaultAddress = addresses?.find((addr: any) => addr.is_default === true);

  const genderConfigs: Record<string, { label: string; variant: any }> = {
    [Gender.MALE]: { label: "Nam", variant: "info" },
    [Gender.FEMALE]: { label: "Nữ", variant: "destructive" },
    [Gender.OTHER]: { label: "Khác", variant: "secondary" },
  };

  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Thông tin cá nhân</h2>
          <p className="text-sm text-muted-foreground">Quản lý hồ sơ cá nhân của bạn</p>
        </div>
        <Button
          type="text"
          danger
          icon={<EditOutlined />}
          onClick={onEdit}
          className="flex items-center font-medium"
        >
          Cập nhật
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
        <InfoItem label="Họ và tên" value={profile?.name} />
        <InfoItem label="Số điện thoại" value={profile?.phone} />

        <InfoItem label="Giới tính">
          {profile?.gender && genderConfigs[profile.gender] && (
            <Badge variant={genderConfigs[profile.gender].variant} className="uppercase text-[10px]">
              {genderConfigs[profile.gender].label}
            </Badge>
          )}
        </InfoItem>

        <InfoItem label="Email" value={profile?.email} />

        <InfoItem
          label="Ngày sinh"
          value={
            profile?.dateOfBirth
              ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")
              : undefined
          }
        />

        <InfoItem label="Địa chỉ mặc định" value={defaultAddress?.full_address} />
      </div>
    </div>
  );
}

function InfoItem({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  const fallback = <span className="text-muted-foreground/60 italic font-normal">Chưa cập nhật</span>;

  return (
    <div className="border-b border-border pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-end min-h-[50px]">
      <p className="text-muted-foreground text-sm mb-1 sm:mb-0 whitespace-nowrap">
        {label}:
      </p>
      <div className="text-foreground font-medium text-sm text-left sm:text-right break-words max-w-full sm:max-w-[300px]">
        {children || (value ? value : fallback)}
      </div>
    </div>
  );
}