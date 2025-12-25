import { Button } from "antd";
import { Badge } from "@/ui/badge";
import { EditOutlined } from "@ant-design/icons";

export default function UserInfoSection({ profile, onEdit }: any) {
  return (
    <div className="rounded-xl border p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
          <p className="text-sm text-muted-foreground">Quản lý hồ sơ</p>
        </div>

        <Button type="link" icon={<EditOutlined />} onClick={onEdit}>
          Cập nhật
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm">
        <Info label="Họ và tên" value={profile?.name} />
        <Info label="Số điện thoại" value={profile?.phone} />
        <Info label="Email" value={profile?.email} />

        <div>
          <p className="text-muted-foreground">Vai trò</p>
          <Badge variant="secondary" className="uppercase mt-1">
            {profile?.role}
          </Badge>
        </div>

        <Info label="Bio" value={profile?.bio || "Chưa cập nhật"} />

        <div>
          <p className="text-muted-foreground mb-2">Trạng thái</p>
          <Badge variant="success" className="uppercase">
            {profile?.status || "ACTIVE"}
          </Badge>
        </div>

        <Info
          label="Ngày sinh"
          value={
            profile?.dateOfBirth
              ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")
              : "-"
          }
        />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground mt-0.5">{value || "-"}</p>
    </div>
  );
}
