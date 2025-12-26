import {
  Drawer,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
} from "antd";
import { Label } from "@/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  UpdateProfileReq,
  updateUserProfile,
} from "@/api/services/profileApi";
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
  updateUser: { title: "Cập nhật thông tin", desc: "Chỉnh sửa thông tin cá nhân của bạn" },
  addAddress: { title: "Thêm địa chỉ", desc: "Dùng để giao hàng nhanh hơn" },
  updateAddress: { title: "Cập nhật địa chỉ", desc: "Thay đổi thông tin địa chỉ" },
  updatePassword: { title: "Đổi mật khẩu", desc: "Bảo mật tài khoản của bạn" },
};

export default function ProfileDrawer({ open, type, data, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (type === "updateUser" && data) {
      form.setFieldsValue({
        ...data,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : undefined,
      });
    }

    if (type === "addAddress" || type === "updateAddress") {
      locationApi.getProvinces().then(setProvinces);
    }
  }, [open, type, data, form]);

  // 2. Xử lý (Tỉnh -> Huyện -> Xã)
  const handleProvinceChange = async (value: string) => {
    const res = await locationApi.getDistricts(value);
    setDistricts(res);
    setWards([]);
    form.setFieldsValue({ district: undefined, ward: undefined });
  };

  const handleDistrictChange = async (value: string) => {
    const res = await locationApi.getWards(value);
    setWards(res);
    form.setFieldsValue({ ward: undefined });
  };

  // 3. Mutations
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (values: UpdateProfileReq) => updateUserProfile(values),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onClose();
    },
    onError: (error: any) => toast.error(error?.message || "Cập nhật thất bại"),
  });

  const { mutateAsync: updatePass, isPending: isUpdatingPass } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công");
      onClose();
    },
    onError: (err: any) => toast.error(err?.message || "Đổi mật khẩu thất bại"),
  });

  // 4. Xử lý Submit chung
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (type === "updatePassword") {
        await updatePass({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        return;
      }

      if (type === "updateUser") {
        const updatePayload: Partial<UpdateProfileReq> = {};

        // So sánh các trường thông thường
        const fields: (keyof UpdateProfileReq)[] = ["name", "phone", "address", "bio"];
        fields.forEach((field) => {
          if (values[field] !== data[field]) {
            updatePayload[field] = values[field];
          }
        });

        // So sánh ngày sinh (Dayjs)
        const isDateChanged = values.dateOfBirth &&
          (!data.dateOfBirth || !dayjs(values.dateOfBirth).isSame(dayjs(data.dateOfBirth), "day"));

        if (isDateChanged) {
          updatePayload.dateOfBirth = values.dateOfBirth.format("YYYY-MM-DD");
        }

        if (Object.keys(updatePayload).length === 0) {
          toast.info("Không có thông tin nào thay đổi");
          return onClose();
        }

        await updateProfile(updatePayload as UpdateProfileReq);
      }
    } catch (error) {
      console.error("Validate failed:", error);
    }
  };

  return (
    <Drawer
      open={open}
      width={380}
      closable={false}
      onClose={onClose}
      title={
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{drawerTitleMap[type].title}</h3>
          <p className="text-sm text-muted-foreground">{drawerTitleMap[type].desc}</p>
        </div>
      }
      footer={
        <div className="flex gap-3 w-full py-2">
          <Button danger size="large" className="flex-1" onClick={onClose}>Hủy</Button>
          <Button
            size="large"
            type="primary"
            className="flex-1"
            loading={isUpdatingProfile || isUpdatingPass}
            onClick={handleSubmit}
          >
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" className="space-y-4">
        {/* --- CASE: UPDATE USER --- */}
        {type === "updateUser" && (
          <>
            <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: "Nhập họ tên" }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Giới tính" name="gender">
              <Select size="large" placeholder="Chọn giới tính">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Ngày sinh" name="dateOfBirth">
              <DatePicker size="large" className="w-full" format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone"><Input size="large" /></Form.Item>
            <Form.Item label="Email" name="email"><Input size="large" disabled /></Form.Item>
            <Form.Item label="Bio" name="bio"><Input size="large" placeholder="Giới thiệu ngắn" /></Form.Item>

            <Form.Item label="Địa chỉ mặc định" name="address">
              <Select size="large">
                <Option value={data?.address}>{data?.address}</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {/* --- CASE: PASSWORD --- */}
        {type === "updatePassword" && (
          <div className="space-y-4">
            <Form.Item label="Mật khẩu hiện tại" name="currentPassword" rules={[{ required: true }]}>
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true }]}>
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                    return Promise.reject(new Error("Mật khẩu không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
          </div>
        )}

        {/* --- CASE: ADD/UPDATE ADDRESS --- */}
        {(type === "addAddress" || type === "updateAddress") && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Tỉnh/Thành phố</Label>
              <Select size="large" className="w-full" placeholder="Chọn tỉnh" onChange={handleProvinceChange}>
                {provinces.map((p) => <Option key={p.province_id} value={p.province_id}>{p.province_name}</Option>)}
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Quận/Huyện</Label>
              <Select size="large" className="w-full" placeholder="Chọn huyện" onChange={handleDistrictChange}>
                {districts.map((d) => <Option key={d.district_id} value={d.district_id}>{d.district_name}</Option>)}
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Phường/Xã</Label>
              <Select size="large" className="w-full" placeholder="Chọn xã">
                {wards.map((w) => <Option key={w.ward_id} value={w.ward_id}>{w.ward_name}</Option>)}
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Địa chỉ chi tiết</Label>
              <Input size="large" placeholder="Số nhà, tên đường..." />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Label>Đặt làm mặc định</Label>
              <Switch />
            </div>
          </div>
        )}
      </Form>
    </Drawer>
  );
}