import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Typography } from "antd";

const { Title } = Typography;

export const CustomerInfoForm = ({ value, onChange }: any) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <Title level={4} className="mb-0">1. Thông Tin Khách Hàng</Title>
      
      <div className="space-y-4 border border-border rounded-lg p-4 bg-card shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">Họ *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={value.firstName}
              onChange={handleInputChange}
              placeholder="Ví dụ: Nguyễn"
              className="focus-visible:ring-primary"
              required
            />
            <p className="text-[11px] text-muted-foreground italic">Vui lòng nhập họ như trên giấy tờ tùy thân</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">Tên *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={value.lastName}
              onChange={handleInputChange}
              placeholder="Ví dụ: Văn An"
              className="focus-visible:ring-primary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1 text-sm font-medium">
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={value.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className="focus-visible:ring-primary"
              required
            />
            <p className="text-[11px] text-muted-foreground italic">Dùng để nhận thông tin hành trình đơn hàng</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1 text-sm font-medium">
              Số điện thoại *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={value.phone}
              onChange={handleInputChange}
              placeholder="0123 456 789"
              className="focus-visible:ring-primary"
              required
            />
            <p className="text-[11px] text-muted-foreground italic">Số dùng để liên hệ khi giao hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};