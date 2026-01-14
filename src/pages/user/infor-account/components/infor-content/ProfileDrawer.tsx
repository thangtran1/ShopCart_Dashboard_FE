"use client";

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
import {
  AddressListResponse,
  addressService,
  CreateAddressDto,
} from "@/api/services/addressesApi";
import { AddressType } from "@/types/enum";
import { Badge } from "@/ui/badge";
import { useLocation } from "@/hooks/useLocation";
import { useTranslation } from "react-i18next";

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

export default function ProfileDrawer({ open, type, data, onClose }: Props) {
  const { t } = useTranslation();
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

  const { provinces, districts, wards } = useLocation(
    watchProvinceId,
    watchDistrictId
  );
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
        province_id: data.province_id ? String(data.province_id) : undefined,
        district_id: data.district_id ? String(data.district_id) : undefined,
        ward_id: data.ward_id ? String(data.ward_id) : undefined,
      });
    }
  }, [open, type, data, form, addresses?.data]);

  const handleProvinceChange = () => {
    form.setFieldsValue({ district_id: undefined, ward_id: undefined });
  };

  const handleDistrictChange = () => {
    form.setFieldsValue({ ward_id: undefined });
  };

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

        if (
          values.dateOfBirth &&
          (!data.dateOfBirth ||
            !dayjs(values.dateOfBirth).isSame(dayjs(data.dateOfBirth), "day"))
        ) {
          updatePayload.dateOfBirth = values.dateOfBirth.format("YYYY-MM-DD");
        }

        if (Object.keys(updatePayload).length > 0) {
          tasks.push(updateUserProfile(updatePayload as UpdateProfileReq));
        }

        const currentDefaultId = addresses?.data?.find((a) => a.is_default)?._id;
        if (values.address_id && values.address_id !== currentDefaultId) {
          tasks.push(
            addressService.updateAddress(values.address_id, {
              is_default: true,
            } as any)
          );
        }

        if (tasks.length === 0) {
          toast.info(t("profile_drawer.form.no_change"));
          setLoading(false);
          return onClose();
        }

        await Promise.all(tasks);
        toast.success(t("profile_drawer.form.success_profile"));
      } else if (type === "addAddress" || type === "updateAddress") {
        const pName = provinces.find((p) => String(p.province_id) === String(values.province_id))?.province_name;
        const dName = districts.find((d) => String(d.district_id) === String(values.district_id))?.district_name;
        const wName = wards.find((w) => String(w.ward_id) === String(values.ward_id))?.ward_name;

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
          toast.success(t("profile_drawer.form.success_add_addr"));
        } else {
          await addressService.updateAddress(data._id, payload);
          toast.success(t("profile_drawer.form.success_update_addr"));
        }
      } else if (type === "updatePassword") {
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        toast.success(t("profile_drawer.form.success_password"));
      }

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      onClose();
    } catch (error: any) {
      if (!error?.errorFields) {
        const errorMsg = error?.response?.data?.message || error?.message || t("profile_drawer.form.fail");
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
              {t(`profile_drawer.titles.${type}`)}
            </h3>

            {type === "addAddress" && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isMaxAddress ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                {t("profile_drawer.address_limit", { current: currentCount })}
              </span>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {type === "addAddress" && isMaxAddress ? (
              <span className="text-red-500 font-medium italic">
                {t("profile_drawer.max_address_warning")}
              </span>
            ) : (
              <div className="flex justify-between items-center">
                <span>{t(`profile_drawer.descriptions.${type}`)}</span>
                {type === "addAddress" && <Badge variant="info">{t("profile_drawer.max_badge")}</Badge>}
              </div>
            )}
          </div>
        </div>
      }
      footer={
        <div className="flex gap-3 w-full py-2">
          <Button danger size="large" className="flex-1" onClick={onClose}>
            {t("profile_drawer.form.cancel")}
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
              ? t("profile_drawer.form.limit_reached") 
              : t("profile_drawer.form.save")}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" className="space-y-4">
        {(type === "addAddress" || type === "updateAddress") && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>{t("profile_drawer.form.labels.addr_title")}</Label>
              <Form.Item
                name="title"
                rules={[{ required: true, message: t("profile_drawer.form.rules.required_title") }]}
              >
                <Input size="large" placeholder={t("profile_drawer.form.placeholders.addr_title")} />
              </Form.Item>
            </div>

            <div className="space-y-1">
              <Label>{t("profile_drawer.form.labels.province")}</Label>
              <Form.Item name="province_id" rules={[{ required: true }]}>
                <Select
                  size="large"
                  placeholder={t("profile_drawer.form.placeholders.province")}
                  onChange={handleProvinceChange}
                >
                  {provinces.map((p) => (
                    <Option key={p.province_id} value={p.province_id}>{p.province_name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="space-y-1">
              <Label>{t("profile_drawer.form.labels.district")}</Label>
              <Form.Item name="district_id" rules={[{ required: true }]}>
                <Select
                  size="large"
                  placeholder={t("profile_drawer.form.placeholders.district")}
                  onChange={handleDistrictChange}
                  disabled={!watchProvinceId}
                >
                  {districts.map((d) => (
                    <Option key={d.district_id} value={d.district_id}>{d.district_name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="space-y-1">
              <Label>{t("profile_drawer.form.labels.ward")}</Label>
              <Form.Item name="ward_id" rules={[{ required: true }]}>
                <Select
                  size="large"
                  placeholder={t("profile_drawer.form.placeholders.ward")}
                  disabled={!watchDistrictId}
                >
                  {wards.map((w) => (
                    <Option key={w.ward_id} value={w.ward_id}>{w.ward_name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="space-y-1">
              <Label>{t("profile_drawer.form.labels.detail")}</Label>
              <Form.Item name="address" rules={[{ required: true }]}>
                <Input size="large" placeholder={t("profile_drawer.form.placeholders.detail")} />
              </Form.Item>
            </div>

            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap">{t("profile_drawer.form.labels.addr_type")}</Label>
              <Form.Item name="type" initialValue={AddressType.HOME} noStyle>
                <Radio.Group className="flex gap-6">
                  <Radio value={AddressType.HOME}>{t("profile_drawer.form.address_types.home")}</Radio>
                  <Radio value={AddressType.OFFICE}>{t("profile_drawer.form.address_types.office")}</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Label>{t("profile_drawer.form.labels.set_default")}</Label>
              <Form.Item name="is_default" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>
          </div>
        )}

        {type === "updateUser" && (
          <>
            <Form.Item
              label={t("profile_drawer.form.labels.name")}
              name="name"
              rules={[{ required: true, message: t("profile_drawer.form.rules.required_name") }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label={t("profile_drawer.form.labels.gender")}
              name="gender"
              rules={[{ required: true, message: t("profile_drawer.form.rules.required_gender") }]}
            >
              <Select size="large" placeholder={t("profile_drawer.form.placeholders.gender")}>
                <Option value="male">{t("profile_drawer.form.gender_options.male")}</Option>
                <Option value="female">{t("profile_drawer.form.gender_options.female")}</Option>
                <Option value="other">{t("profile_drawer.form.gender_options.other")}</Option>
              </Select>
            </Form.Item>

            <Form.Item label={t("profile_drawer.form.labels.dob")} name="dateOfBirth">
              <DatePicker size="large" className="w-full" format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item label={t("profile_drawer.form.labels.phone")} name="phone">
              <Input size="large" />
            </Form.Item>
            <Form.Item label={t("profile_drawer.form.labels.email")} name="email">
              <Input size="large" disabled />
            </Form.Item>
            <Form.Item label={t("profile_drawer.form.labels.bio")} name="bio">
              <Input size="large" placeholder={t("profile_drawer.form.placeholders.bio")} />
            </Form.Item>

            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold text-primary">
                  {t("profile_drawer.form.labels.default_shipping")}
                </Label>
                <Badge variant="outline" className="text-xs">
                  {t("profile_drawer.form.labels.address_book")}
                </Badge>
              </div>

              {currentCount > 0 ? (
                <Form.Item
                  name="address_id"
                  help={t("profile_drawer.form.labels.address_hint")}
                >
                  <Select
                    size="large"
                    placeholder={t("profile_drawer.form.placeholders.address_book")}
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
                                {t("profile_drawer.form.address_types.currently_default")}
                              </span>
                            )}
                          </div>

                          {addr.is_default && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 text-[10px]"
                            >
                              {t("profile_drawer.form.address_types.is_default")}
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
                    {t("profile_drawer.form.labels.empty_address")}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {type === "updatePassword" && (
          <div className="space-y-4">
            <Form.Item
              label={t("profile_drawer.form.labels.current_pass")}
              name="currentPassword"
              rules={[
                { required: true, message: t("profile_drawer.form.rules.required_pass") },
              ]}
            >
              <Input.Password
                size="large"
                placeholder={t("profile_drawer.form.placeholders.current_pass")}
              />
            </Form.Item>

            <Form.Item
              label={t("profile_drawer.form.labels.new_pass")}
              name="newPassword"
              extra={
                <span className="text-[12px] text-muted-foreground">
                  {t("profile_drawer.form.rules.pass_extra")}
                </span>
              }
              rules={[
                { required: true, message: t("profile_drawer.form.rules.required_pass") },
                { min: 8, message: t("profile_drawer.form.rules.pass_min") },
              ]}
            >
              <Input.Password
                size="large"
                placeholder={t("profile_drawer.form.placeholders.new_pass")}
              />
            </Form.Item>

            <Form.Item
              label={t("profile_drawer.form.labels.confirm_pass")}
              name="confirmPassword"
              dependencies={["newPassword"]}
              extra={
                <span className="text-[12px] text-muted-foreground">
                  {t("profile_drawer.form.rules.confirm_extra")}
                </span>
              }
              rules={[
                { required: true, message: t("profile_drawer.form.rules.required_pass") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("profile_drawer.form.rules.pass_mismatch"))
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder={t("profile_drawer.form.placeholders.confirm_pass")}
              />
            </Form.Item>
          </div>
        )}
      </Form>
    </Drawer>
  );
}