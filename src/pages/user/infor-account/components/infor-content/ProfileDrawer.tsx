import {
  Drawer,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Radio,
} from "antd";
import { Label } from "@/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  UpdateProfileReq,
  updateUserProfile,
} from "@/api/services/profileApi";
import { toast } from "sonner";
import dayjs from "dayjs";
import { useEffect } from "react";
import { locationApi } from "@/api/services/provinceApi";
import {
  AddressListResponse,
  addressService,
  CreateAddressDto,
} from "@/api/services/addressesApi";
import { AddressType } from "@/types/enum";
import { Badge } from "@/ui/badge";

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
  addAddress: { title: "Thêm địa chỉ", desc: "Dùng để giao hàng nhanh hơn" },
  updateAddress: {
    title: "Cập nhật địa chỉ",
    desc: "Thay đổi thông tin địa chỉ",
  },
  updatePassword: { title: "Đổi mật khẩu", desc: "Bảo mật tài khoản của bạn" },
};

export default function ProfileDrawer({ open, type, data, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const watchProvinceId = Form.useWatch("province_id", form);
  const watchDistrictId = Form.useWatch("district_id", form);
  const { data: addresses } = useQuery<AddressListResponse>({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAll(),
  });

  const currentCount = addresses?.data?.length || 0;
  const isMaxAddress = currentCount >= 10;

  const { data: provinces = [] } = useQuery({
    queryKey: ["provinces"],
    queryFn: locationApi.getProvinces,
    staleTime: Infinity, // Cache vĩnh viễn trong phiên làm việc
    enabled: open && (type === "addAddress" || type === "updateAddress"),
  });

  const { data: districts = [] } = useQuery({
    queryKey: ["districts", watchProvinceId],
    queryFn: () => locationApi.getDistricts(String(watchProvinceId)),
    enabled: !!watchProvinceId && open,
    staleTime: Infinity,
  });

  const { data: wards = [] } = useQuery({
    queryKey: ["wards", watchDistrictId || data?.district_id],
    queryFn: () =>
      locationApi.getWards(String(watchDistrictId || data?.district_id)),
    enabled: !!(watchDistrictId || data?.district_id) && open,
    staleTime: Infinity,
  });
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
      return;
    }

    if (type === "updateAddress" && data) {
      form.setFieldsValue({
        ...data,
        // Ép tất cả về Number để đảm bảo khớp với value của Select Option
        province_id: data.province_id ? Number(data.province_id) : undefined,
        district_id: data.district_id ? Number(data.district_id) : undefined,
        ward_id: data.ward_id ? Number(data.ward_id) : undefined,
      });
    }
  }, [open, type, data, form]);

  // 2. Xử lý (Tỉnh -> Huyện -> Xã)
  const handleProvinceChange = () => {
    form.setFieldsValue({ district_id: undefined, ward_id: undefined });
  };

  const handleDistrictChange = () => {
    form.setFieldsValue({ ward_id: undefined });
  };

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: (values: UpdateProfileReq) => updateUserProfile(values),
      onSuccess: () => {
        toast.success("Cập nhật thông tin thành công");
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        onClose();
      },
      onError: (error: any) =>
        toast.error(error?.message || "Cập nhật thất bại"),
    });

  const { mutateAsync: updatePass, isPending: isUpdatingPass } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công");
      onClose();
    },
    onError: (err: any) => toast.error(err?.message || "Đổi mật khẩu thất bại"),
  });

  const { mutateAsync: saveAddress, isPending: isSavingAddr } = useMutation({
    mutationFn: (payload: any) =>
      type === "addAddress"
        ? addressService.create(payload)
        : addressService.updateAddress(data._id, payload),
    onSuccess: () => {
      toast.success(
        type === "addAddress"
          ? "Thêm địa chỉ thành công"
          : "Cập nhật thành công"
      );
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      onClose();
    },
    onError: (err: any) => {
      const errorMsg = err?.response?.data?.message || "Thao tác thất bại";
      toast.error(errorMsg);
    },
  });

  // 4. Xử lý Submit chung
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (type === "addAddress" || type === "updateAddress") {
        const pName = provinces.find(
          (p) => String(p.province_id) === String(values.province_id)
        )?.province_name;
        const dName = districts.find(
          (d) => String(d.district_id) === String(values.district_id)
        )?.district_name;
        const wName = wards.find(
          (w) => String(w.ward_id) === String(values.ward_id)
        )?.ward_name;

        const payload: CreateAddressDto = {
          ...values,
          type: +values.type,
          province_id: +values.province_id,
          district_id: +values.district_id,
          ward_id: +values.ward_id,
          full_address: `${values.address}, ${wName}, ${dName}, ${pName}`,
        };
        await saveAddress(payload);
      }
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
        const fields: (keyof UpdateProfileReq)[] = [
          "name",
          "phone",
          "address",
          "bio",
        ];
        fields.forEach((field) => {
          if (values[field] !== data[field]) {
            updatePayload[field] = values[field];
          }
        });

        // So sánh ngày sinh (Dayjs)
        const isDateChanged =
          values.dateOfBirth &&
          (!data.dateOfBirth ||
            !dayjs(values.dateOfBirth).isSame(dayjs(data.dateOfBirth), "day"));

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
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {drawerTitleMap[type].title}
            </h3>

            {type === "addAddress" && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isMaxAddress
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
                  }`}
              >
                {currentCount}/10 địa chỉ
              </span>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {type === "addAddress" && isMaxAddress ? (
              <span className="text-red-500 font-medium italic">
                ⚠️ Bạn đã đạt giới hạn tối đa 10 địa chỉ
              </span>
            ) : (
              <div className="flex justify-between items-center">
                <span>{drawerTitleMap[type].desc}</span>
                {type === "addAddress" && (
                  <Badge variant="info">Tối đa 10 địa chỉ</Badge>
                )}
              </div>
            )}
          </div>
        </div>
      }
      footer={
        <div className="flex gap-3 w-full py-2">
          <Button danger size="large" className="flex-1" onClick={onClose}>
            Hủy
          </Button>
          <Button
            size="large"
            type="primary"
            className="flex-1"
            loading={isUpdatingProfile || isUpdatingPass || isSavingAddr}
            onClick={handleSubmit}
            disabled={type === "addAddress" && isMaxAddress}
          >
            {type === "addAddress" && isMaxAddress
              ? "Đã đạt giới hạn"
              : "Lưu thay đổi"}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" className="space-y-4">
        {(type === "addAddress" || type === "updateAddress") && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Tên gợi nhớ</Label>
              <Form.Item
                name="title"
                rules={[
                  { required: true, message: "Vui lòng nhập tên gợi nhớ" },
                ]}
              >
                <Input size="large" placeholder="Ví dụ: Nhà mẹ, Chung cư..." />
              </Form.Item>
            </div>

            <div className="space-y-1">
              <Label>Tỉnh/Thành phố</Label>
              <Form.Item name="province_id" rules={[{ required: true }]}>
                <Select
                  size="large"
                  placeholder="Chọn tỉnh"
                  onChange={handleProvinceChange}
                >
                  {provinces.map((p) => (
                    // Ép p.province_id về Number ở đây
                    <Option key={p.province_id} value={Number(p.province_id)}>
                      {p.province_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="space-y-1">
              <Label>Quận/Huyện</Label>
              <Form.Item name="district_id" rules={[{ required: true }]}>
                <Select
                  size="large"
                  placeholder="Chọn huyện"
                  onChange={handleDistrictChange}
                >
                  {districts.map((d) => (
                    <Option key={d.district_id} value={Number(d.district_id)}>
                      {d.district_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="space-y-1">
              <Label>Phường/Xã</Label>
              <Form.Item name="ward_id" rules={[{ required: true }]}>
                <Select size="large" placeholder="Chọn xã">
                  {wards.map((w) => (
                    <Option key={w.ward_id} value={Number(w.ward_id)}>
                      {w.ward_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="space-y-1">
              <Label>Địa chỉ chi tiết</Label>
              <Form.Item name="address" rules={[{ required: true }]}>
                <Input size="large" placeholder="Số nhà, tên đường..." />
              </Form.Item>
            </div>

            {/* Loại địa chỉ: Nhà riêng / Công ty */}
            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap">Loại địa chỉ</Label>

              <Form.Item name="type" initialValue={AddressType.HOME} noStyle>
                <Radio.Group className="flex gap-6">
                  <Radio value={AddressType.HOME}>Nhà</Radio>
                  <Radio value={AddressType.OFFICE}>Công ty</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Label>Đặt làm mặc định</Label>
              <Form.Item name="is_default" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>
          </div>
        )}

        {type === "updateUser" && (
          <>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Nhập họ tên" }]}
            >
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

            <Form.Item label="Số điện thoại" name="phone">
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input size="large" disabled />
            </Form.Item>
            <Form.Item label="Bio" name="bio">
              <Input size="large" placeholder="Giới thiệu ngắn" />
            </Form.Item>

            <Form.Item label="Địa chỉ mặc định" name="address">
              <Select size="large">
                <Option value={data?.address}>{data?.address}</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {type === "updatePassword" && (
          <div className="space-y-4">
            <Form.Item
              label="Mật khẩu hiện tại"
              name="currentPassword"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
            >
              <Input.Password size="large" placeholder="Nhập mật khẩu cũ của bạn" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              extra={<span className="text-[12px] text-muted-foreground">Mật khẩu phải từ 8-20 ký tự, bao gồm chữ và số.</span>}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" }
              ]}
            >
              <Input.Password size="large" placeholder="Thiết lập mật khẩu mới" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["newPassword"]}
              extra={<span className="text-[12px] text-muted-foreground">Nhập lại chính xác mật khẩu mới bên trên.</span>}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
          </div>
        )}
      </Form>
    </Drawer>
  );
}
