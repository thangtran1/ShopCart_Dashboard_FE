import {
  Drawer,
  Button,
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  Switch,
} from "antd";
import { Label } from "@/ui/label";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/services/profileApi";
import { toast } from "sonner";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  District,
  locationApi,
  Province,
  Ward,
} from "@/api/services/provinceApi";
const { Option } = Select;
export type DrawerType =
  | "updateUser"
  | "addAddress"
  | "updateAddress"
  | "updatePassword";

interface Props {
  open: boolean;
  type: DrawerType;
  data?: any;
  onClose: () => void;
}

const drawerTitleMap: Record<DrawerType, { title: string; desc: string }> = {
  updateUser: {
    title: "Cập nhật thông tin",
    desc: "Chỉnh sửa thông tin cá nhân của bạn",
  },
  addAddress: {
    title: "Thêm địa chỉ",
    desc: "Dùng để giao hàng nhanh hơn",
  },
  updateAddress: {
    title: "Cập nhật địa chỉ",
    desc: "Thay đổi thông tin địa chỉ",
  },
  updatePassword: {
    title: "Đổi mật khẩu",
    desc: "Bảo mật tài khoản của bạn",
  },
};

export default function ProfileDrawer({ open, type, data, onClose }: Props) {
  const [form] = Form.useForm();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();
  const [wardId, setWardId] = useState<string>();

  useEffect(() => {
    locationApi.getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (!provinceId) return;
    locationApi.getDistricts(provinceId).then(setDistricts);
    setDistrictId(undefined);
    setWards([]);
  }, [provinceId]);

  useEffect(() => {
    if (!districtId) return;
    locationApi.getWards(districtId).then(setWards);
    setWardId(undefined);
  }, [districtId]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      changePassword(payload),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công");
      form.resetFields();
      onClose();
    },
    onError: (err: any) => toast.error(err?.message || "Đổi mật khẩu thất bại"),
  });

  const handleSubmit = async () => {
    if (type === "updatePassword") {
      const values = await form.validateFields();
      await mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      return;
    }

    toast.success("Lưu thành công (fake)");
    onClose();
  };

  return (
    <Drawer
      open={open}
      width={350}
      closable={false}
      onClose={onClose}
      title={
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            {drawerTitleMap[type].title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {drawerTitleMap[type].desc}
          </p>
        </div>
      }
      footer={
        <div className="flex gap-3 w-full py-4">
          <Button danger size="large" className="flex-1" onClick={onClose}>
            Hủy
          </Button>
          <Button
            size="large"
            type="primary"
            className="flex-1"
            loading={isPending}
            onClick={handleSubmit}
          >
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      {type === "updatePassword" && (
        <Form form={form} layout="vertical" className="!space-y-4">
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
            style={{ marginBottom: 0 }}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="confirmPassword"
            dependencies={["newPassword"]}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
        </Form>
      )}

      {type === "updateUser" && (
        <div className="space-y-4">
          {/* Họ và tên */}
          <div className="space-y-1">
            <Label>Họ và tên</Label>
            <Input
              size="large"
              defaultValue={data?.name || "Lê Hồng Quang"}
              allowClear
            />
          </div>

          {/* Giới tính */}
          <div className="space-y-1">
            <Label>Giới tính</Label>
            <Select
              size="large"
              className="w-full"
              placeholder="Chọn giới tính"
              defaultValue={data?.gender || undefined}
            >
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </div>

          {/* Ngày sinh */}
          <div className="space-y-1">
            <Label>Ngày sinh</Label>
            <DatePicker
              size="large"
              className="w-full"
              defaultValue={dayjs(data?.birthday || "2000-11-11")}
              format="DD/MM/YYYY"
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1">
            <Label>Số điện thoại</Label>
            <Input
              size="large"
              defaultValue={data?.phone || "0389215396"}
              disabled
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              size="large"
              defaultValue={data?.email || "kimochi2023@gmail.com"}
              disabled
            />
          </div>

          {/* Địa chỉ mặc định */}
          <div className="space-y-1">
            <Label>
              Địa chỉ mặc định <span className="text-red-500">*</span>
            </Label>
            <Select size="large" className="w-full" defaultValue="address1">
              <Option value="address1">
                Admin123@, Phường Nguyễn Thị Minh Khai, Thành phố Bắc Kạn, Bắc
                Kạn
              </Option>
              <Option value="address2">
                Admin123@, Thị trấn Núi Sập, Huyện Thoại Sơn, An Giang
              </Option>
            </Select>
          </div>
        </div>
      )}

      {type === "addAddress" && (
        <div className="space-y-4">
          {/* Tỉnh / Thành phố */}
          <div className="space-y-1">
            <Label>Tỉnh/Thành phố</Label>
            <Select
              size="large"
              placeholder="Chọn Tỉnh/Thành phố"
              className="w-full"
              onChange={setProvinceId}
            >
              {provinces.map((item) => (
                <Option key={item.province_id} value={item.province_id}>
                  {item.province_name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Quận / Huyện */}
          <div className="space-y-1">
            <Label>Quận/Huyện</Label>
            <Select
              size="large"
              placeholder="Chọn Quận/Huyện"
              className="w-full"
              disabled={!provinceId}
              onChange={setDistrictId}
            >
              {districts.map((item) => (
                <Option key={item.district_id} value={item.district_id}>
                  {item.district_name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Phường / Xã */}
          <div className="space-y-1">
            <Label>Phường/Xã</Label>
            <Select
              size="large"
              placeholder="Chọn Phường/Xã"
              className="w-full"
              disabled={!districtId}
              onChange={setWardId}
            >
              {wards.map((item) => (
                <Option key={item.ward_id} value={item.ward_id}>
                  {item.ward_name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Địa chỉ nhà */}
          <div className="space-y-1">
            <Label>Địa chỉ nhà</Label>
            <Input size="large" placeholder="Nhập địa chỉ nhà" />
          </div>

          {/* Tên gợi nhớ */}
          <div className="space-y-1">
            <Label>Đặt tên gợi nhớ</Label>
            <Input size="large" placeholder="Ví dụ: Nhà riêng, Văn phòng" />
          </div>

          {/* Loại địa chỉ */}
          <div className="space-y-1">
            <Label>Loại địa chỉ</Label>
            <Radio.Group defaultValue="home" className="flex gap-4">
              <Radio.Button value="home">Nhà</Radio.Button>
              <Radio.Button value="office">Văn phòng</Radio.Button>
            </Radio.Group>
          </div>

          {/* Đặt làm mặc định */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Label>Đặt làm địa chỉ mặc định</Label>
            <Switch />
          </div>
        </div>
      )}

      {type === "updateAddress" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Tỉnh/Thành phố</Label>
            <Select size="large" className="w-full" defaultValue="01">
              <Option value="01">Hà Nội</Option>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Quận/Huyện</Label>
            <Select size="large" className="w-full" defaultValue="001">
              <Option value="001">Ba Đình</Option>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Phường/Xã</Label>
            <Select size="large" className="w-full" defaultValue="00001">
              <Option value="00001">Phúc Xá</Option>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Địa chỉ nhà</Label>
            <Input size="large" defaultValue="123 Nguyễn Trãi" />
          </div>

          <div className="space-y-1">
            <Label>Đặt tên gợi nhớ</Label>
            <Input size="large" defaultValue="Nhà riêng" />
          </div>

          <div className="space-y-1">
            <Label>Loại địa chỉ</Label>
            <Radio.Group defaultValue="home" className="flex gap-4">
              <Radio.Button value="home">Nhà</Radio.Button>
              <Radio.Button value="office">Văn phòng</Radio.Button>
            </Radio.Group>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <Label>Đặt làm địa chỉ mặc định</Label>
            <Switch defaultChecked />
          </div>
        </div>
      )}
    </Drawer>
  );
}
