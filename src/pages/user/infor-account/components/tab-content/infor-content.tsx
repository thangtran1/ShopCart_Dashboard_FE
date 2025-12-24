import { useState } from "react";
import { Drawer, Button, Input, Radio, Divider, Tag, Form } from "antd";
import { toast } from "sonner";
import { Label } from "@/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Badge } from "@/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/services/profileApi";

export default function InforContent() {
  const { profile } = useUserProfile();
  const [form] = Form.useForm();

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "aa",
      name: "Lê Hồng Quang",
      phone: "0389215396",
      address: "Admin123@, Thị trấn Núi Sập, Huyện Thoại Sơn, An Giang",
      type: "home",
    },
    {
      id: 2,
      label: "haonam",
      name: "Lê Hồng Quang",
      phone: "0389215396",
      address:
        "Admin123@, Phường Nguyễn Thị Minh Khai, Thành phố Bắc Kạn, Bắc Kạn",
      type: "company",
      isDefault: true,
    },
  ]);

  const [linkedAccounts, setLinkedAccounts] = useState({
    google: true,
    zalo: false,
  });

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState<
    "updateUser" | "addAddress" | "updateAddress" | "updatePassword"
  >("updateUser");

  const [formData, setFormData] = useState<any>({});

  const openDrawer = (type: typeof drawerType, data?: any) => {
    setDrawerType(type);
    setFormData(data || {});
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setFormData({});
  };


  const { mutateAsync: submitChangePassword, isPending } = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      form.resetFields();
      toast.success("Đổi mật khẩu thành công");
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi khi đổi mật khẩu");
    },
  });


  const handleSave = async () => {
    if (drawerType === "updateUser") {
      toast.success("Cập nhật thông tin thành công");
    }

    if (drawerType === "updatePassword") {
      try {
        const values = await form.validateFields();
        await submitChangePassword(values);
      } catch (err) {
        console.log("Validation failed", err);
        return;
      }
    }


    if (drawerType === "addAddress") {
      toast.success("Thêm địa chỉ thành công");
    }

    if (drawerType === "updateAddress") {
      toast.success("Cập nhật địa chỉ thành công");
    }

    closeDrawer();
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter((item) => item.id !== id));
    toast.success("Xóa địa chỉ thành công");
  };

  const drawerTitleMap = {
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
  return (
    <div className="space-y-6">
      <div className="rounded-xl border shadow-sm bg-background p-4">
        {/* ===== Header ===== */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Thông tin cá nhân
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý thông tin hồ sơ của bạn
            </p>
          </div>

          <Button
            type="link"
            danger
            onClick={() => openDrawer("updateUser", profile)}
          >
            Cập nhật
          </Button>
        </div>

        {/* ===== Content ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">Họ và tên</p>
            <p className="font-medium text-foreground mt-0.5">
              {profile?.name}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Số điện thoại</p>
            <p className="font-medium text-foreground mt-0.5">{profile?.phone}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Vai trò</p>
            <p className="font-medium text-foreground mt-0.5">{profile?.role}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium text-foreground mt-0.5">{profile?.email}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Bio</p>
            <p className="font-medium text-foreground mt-0.5">{profile?.bio}</p>
          </div>

          <div>
            <p className="text-muted-foreground mb-2">Trạng thái</p>
            <Badge variant={'success'} className="uppercase">{profile?.status}</Badge>
          </div>

          <div>
            <p className="text-muted-foreground">Ngày sinh</p>
            <p className="font-medium text-foreground mt-0.5">
              {profile?.dateOfBirth
                ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")
                : "-"}
            </p>
          </div>

          {/* Địa chỉ mặc định – full row */}
          <div className="md:col-span-2">
            <p className="text-muted-foreground">Địa chỉ mặc định</p>
            <p className="font-medium text-foreground mt-0.5 leading-relaxed">
              {profile?.address}
            </p>
          </div>
        </div>
      </div>

      <div className=" rounded-xl border shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Sổ địa chỉ</h2>
          <Button
            type="primary"
            ghost
            danger
            onClick={() => openDrawer("addAddress")}
          >
            + Thêm địa chỉ
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{item.label}</span>
                {item.isDefault && <Tag color="red">Mặc định</Tag>}
              </div>

              <p className="text-sm">
                {item.name} | {item.phone}
              </p>
              <p className="text-xs text-foreground">{item.address}</p>

              <Divider className="my-2" />

              <div className="flex gap-4">
                <Button
                  type="link"
                  size="small"
                  danger
                  onClick={() => handleDeleteAddress(item.id)}
                >
                  Xóa
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => openDrawer("updateAddress", item)}
                >
                  Cập nhật
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className=" rounded-xl border shadow-sm p-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg">Mật khẩu</h2>
          </div>
          <Button
            type="link"
            danger
            onClick={() => openDrawer("updatePassword")}
          >
            Thay đổi mật khẩu
          </Button>
        </div>
      </div>

      <div className=" rounded-xl border shadow-sm p-5">
        <h2 className="font-semibold text-lg mb-4">Tài khoản liên kết</h2>

        <div className="space-y-4">
          {/* Google */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5"
              />
              <span>Google</span>
              {linkedAccounts.google && <Tag color="green">Đã liên kết</Tag>}
            </div>

            <Button
              type="link"
              danger={linkedAccounts.google}
              onClick={() =>
                setLinkedAccounts({
                  ...linkedAccounts,
                  google: !linkedAccounts.google,
                })
              }
            >
              {linkedAccounts.google ? "Hủy liên kết" : "Liên kết"}
            </Button>
          </div>

          {/* Zalo */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png"
                className="w-5"
              />
              <span>Zalo</span>
            </div>

            <Button
              type="link"
              onClick={() =>
                setLinkedAccounts({
                  ...linkedAccounts,
                  zalo: !linkedAccounts.zalo,
                })
              }
            >
              {linkedAccounts.zalo ? "Hủy liên kết" : "Liên kết"}
            </Button>
          </div>
        </div>
      </div>

      <Drawer
        open={drawerVisible}
        onClose={closeDrawer}
        width={440}
        closable={false}
        title={
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              {drawerTitleMap[drawerType].title}
            </h3>
            <p className="text-sm text-foreground">
              {drawerTitleMap[drawerType].desc}
            </p>
          </div>
        }
        footer={
          <div className="flex gap-3 w-full py-4">
            <Button
              danger
              size="large"
              className="flex-1"
              onClick={closeDrawer}
            >
              Hủy
            </Button>
            <Button
              size="large"
              type="primary"
              className="flex-1"
              loading={isPending}
              onClick={handleSave}
            >
              Lưu thay đổi
            </Button>
          </div>
        }
      >
        <div className="!space-y-4">
          {drawerType === "updatePassword" ? (
            <Form form={form} layout="vertical">
              <Form.Item
                label="Mật khẩu hiện tại"
                name="currentPassword"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
              >
                <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
              >
                <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                label="Nhập lại mật khẩu mới"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
            </Form>
          ) : (
            <>
              <div className="space-y-1">
                <Label className="text-md font-medium text-foreground">
                  Họ và tên
                </Label>
                <Input
                  size="large"
                  placeholder="Họ và tên"
                  value={formData.fullName || formData.name || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label className="text-md font-medium text-foreground">
                  Số điện thoại
                </Label>
                <Input
                  size="large"
                  placeholder="Số điện thoại"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              {drawerType !== "updateAddress" && (
                <div className="space-y-1">
                  <Label className="text-md font-medium text-foreground">
                    Email
                  </Label>
                  <Input
                    size="large"
                    placeholder="Email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-md font-medium text-foreground">
                  Địa chỉ
                </Label>
                <Input.TextArea
                  size="large"
                  placeholder="Địa chỉ"
                  rows={3}
                  value={formData.address || formData.defaultAddress || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                      defaultAddress: e.target.value,
                    })
                  }
                />
              </div>

              {drawerType !== "updateUser" && (
                <div className="space-y-1">
                  <Label className="text-md font-medium text-foreground">
                    Loại địa chỉ
                  </Label>
                  <Radio.Group
                    size="large"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="flex gap-6"
                  >
                    <Radio value="home">Nhà riêng</Radio>
                    <Radio value="company">Công ty</Radio>
                  </Radio.Group>
                </div>
              )}
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
}
