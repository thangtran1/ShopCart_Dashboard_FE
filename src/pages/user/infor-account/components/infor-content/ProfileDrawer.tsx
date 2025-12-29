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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  UpdateProfileReq,
  updateUserProfile,
} from "@/api/services/profileApi";
import { toast } from "sonner";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const watchProvinceId = Form.useWatch("province_id", form);
  const watchDistrictId = Form.useWatch("district_id", form);
  const { data: addresses } = useQuery<AddressListResponse>({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAll(),
  });
  const addressList = addresses?.data ?? [];
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
      const currentDefaultId = addresses?.data?.find((a) => a.is_default)?._id;

      form.setFieldsValue({
        ...data,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : undefined,
        address_id: currentDefaultId,
      });
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
  }, [open, type, data, form, addresses?.data]);

  // 2. Xử lý (Tỉnh -> Huyện -> Xã)
  const handleProvinceChange = () => {
    form.setFieldsValue({ district_id: undefined, ward_id: undefined });
  };

  const handleDistrictChange = () => {
    form.setFieldsValue({ ward_id: undefined });
  };

  // 4. Xử lý Submit chung
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (type === "updateUser") {
        const tasks = [];
        const updatePayload: Partial<UpdateProfileReq> = {};
      
        const fields: (keyof UpdateProfileReq)[] = ["name", "phone", "bio", "gender"];
        fields.forEach((field) => {
          if (values[field] !== data[field]) {
            updatePayload[field] = values[field] || "";
          }
        });
      
        if (values.dateOfBirth && (!data.dateOfBirth || !dayjs(values.dateOfBirth).isSame(dayjs(data.dateOfBirth), "day"))) {
          updatePayload.dateOfBirth = values.dateOfBirth.format("YYYY-MM-DD");
        }
      
        if (Object.keys(updatePayload).length > 0) {
          tasks.push(updateUserProfile(updatePayload as UpdateProfileReq));
        }
      
        // 2. Chỉ update địa chỉ nếu người dùng THỰC SỰ chọn một địa chỉ mới
        const currentDefaultId = addresses?.data?.find((a) => a.is_default)?._id;
        
        // Điều kiện: Có chọn ID mới VÀ ID đó khác với ID mặc định hiện tại
        if (values.address_id && values.address_id !== currentDefaultId) {
          tasks.push(
            addressService.updateAddress(values.address_id, {
              is_default: true,
            } as any)
          );
        }
      
        if (tasks.length === 0) {
          toast.info("Không có thông tin nào thay đổi");
          setLoading(false);
          return onClose();
        }
      
        await Promise.all(tasks);
        toast.success("Cập nhật thông tin thành công");
      } else if (type === "addAddress" || type === "updateAddress") {
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

        if (type === "addAddress") {
          await addressService.create(payload);
          toast.success("Thêm địa chỉ thành công");
        } else {
          await addressService.updateAddress(data._id, payload);
          toast.success("Cập nhật địa chỉ thành công");
        }
      } else if (type === "updatePassword") {
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        toast.success("Đổi mật khẩu thành công");
      }

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      onClose();
    } catch (error: any) {
      if (error?.errorFields) {
        console.log("Validation failed:", error);
      } else {
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Thao tác thất bại";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
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
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isMaxAddress
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
            loading={loading}
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

            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
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

            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold text-primary">
                  Địa chỉ giao hàng mặc định
                </Label>
                <Badge variant="outline" className="text-xs">
                  Sổ địa chỉ
                </Badge>
              </div>

              {/* Nếu CÓ địa chỉ → hiện Select */}
              {currentCount > 0 ? (
                <Form.Item
                  name="address_id"
                  help="Địa chỉ này sẽ được dùng làm mặc định khi giao hàng"
                >
                  <Select
                    size="large"
                    placeholder="Chọn địa chỉ từ sổ địa chỉ"
                    className="w-full"
                    optionLabelProp="label"
                  >
                    {addressList.map((addr: any) => (
                      <Select.Option
                        key={addr._id}
                        value={addr._id}
                        label={addr.full_address}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium line-clamp-2">
                              {addr.full_address}
                            </span>

                            {addr.is_default && (
                              <span className="text-[11px] text-muted-foreground mt-0.5">
                                Đang là địa chỉ mặc định
                              </span>
                            )}
                          </div>

                          {addr.is_default && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 text-[10px]"
                            >
                              Mặc định
                            </Badge>
                          )}
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <div className="mt-3 rounded-lg border border-dashed bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground italic">
                    Bạn chưa có địa chỉ nào trong sổ địa chỉ. Vui lòng thêm địa
                    chỉ ở mục <b>“Sổ địa chỉ”</b> để sử dụng tính năng này.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {type === "updatePassword" && (
          <div className="space-y-4">
            <Form.Item
              label="Mật khẩu hiện tại"
              name="currentPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Nhập mật khẩu cũ của bạn"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              extra={
                <span className="text-[12px] text-muted-foreground">
                  Mật khẩu phải từ 8-20 ký tự, bao gồm chữ và số.
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Thiết lập mật khẩu mới"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["newPassword"]}
              extra={
                <span className="text-[12px] text-muted-foreground">
                  Nhập lại chính xác mật khẩu mới bên trên.
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
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
              <Input.Password
                size="large"
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Item>
          </div>
        )}
      </Form>
    </Drawer>
  );
}
