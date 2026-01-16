"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Typography, Select } from "antd";
import { useLocation } from "@/hooks/useLocation";
import { useTranslation } from "react-i18next";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";
import { useAddressActions } from "@/hooks/useAddresses";
import { Badge } from "@/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

const { Title } = Typography;
const { Option } = Select;

const ShippingAddressForm = ({
  onChange,
}: {
  onChange: (data: any) => void;
}) => {
  const { t } = useTranslation();
  const { addresses } = useAddressActions();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState({
    address: "",
    state: "",
    district: "",
    city: "",
    notes: "",
  });

  const { provinces, districts, wards } = useLocation(
    formData.state,
    formData.district
  );
  const lastDataRef = useRef("");

  // Tự động chọn địa chỉ mặc định khi danh sách addresses tải xong
  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddressId) {
      const defaultAddr =
        addresses.find((a: any) => a.is_default) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [addresses]);

  // Xử lý khi chọn địa chỉ có sẵn
  useEffect(() => {
    if (!isAddingNew && selectedAddressId && addresses) {
      const addr = addresses.find((a: any) => a._id === selectedAddressId);
      if (!addr) return;

      const parts = addr.full_address
        ? addr.full_address.split(",").map((p: string) => p.trim())
        : [];

      const pName =
        provinces.find(
          (p) => String(p.province_id) === String(addr.province_id)
        )?.province_name ||
        parts[parts.length - 1] ||
        "";
      const dName =
        districts.find(
          (d) => String(d.district_id) === String(addr.district_id)
        )?.district_name ||
        parts[parts.length - 2] ||
        "";
      const wName =
        wards.find((w) => String(w.ward_id) === String(addr.ward_id))
          ?.ward_name || (parts.length > 3 ? parts[parts.length - 3] : "");

      const payload = {
        fullName: addr.member_id?.name || "",
        phone: addr.member_id?.phone || "",
        address: addr.address || "",
        wardName: wName,
        districtName: dName,
        provinceName: pName,
        fullAddress: addr.full_address,
        notes: formData.notes,
        isValid: !!(pName && dName),
        isExisting: true,
      };

      updateParent(payload);
    }
  }, [
    selectedAddressId,
    isAddingNew,
    formData.notes,
    addresses,
    provinces,
    districts,
    wards,
  ]);

  // Xử lý khi nhập địa chỉ mới
  useEffect(() => {
    if (isAddingNew) {
      const provinceName =
        provinces.find((p) => p.province_id === formData.state)
          ?.province_name || "";
      const districtName =
        districts.find((d) => d.district_id === formData.district)
          ?.district_name || "";
      const wardName =
        wards.find((w) => w.ward_id === formData.city)?.ward_name || "";

      const isValid = !!(
        formData.address &&
        formData.state &&
        formData.district &&
        formData.city
      );

      const payload = {
        address: formData.address,
        provinceName,
        districtName,
        wardName,
        fullAddress: `${formData.address}, ${wardName}, ${districtName}, ${provinceName}`,
        notes: formData.notes,
        isValid,
      };
      updateParent(payload);
    }
  }, [formData, isAddingNew, provinces, districts, wards]);

  const updateParent = (payload: any) => {
    const dataString = JSON.stringify(payload);
    if (lastDataRef.current !== dataString) {
      lastDataRef.current = dataString;
      onChange(payload);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between w-full">
        <Title level={4} className="!mb-0 !text-foreground">
          {t("checkout.shipping.title")}
        </Title>
        <button
          type="button"
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="text-primary text-sm font-bold cursor-pointer flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          {isAddingNew ? (
            t("Sử dụng địa chỉ đã lưu")
          ) : (
            <>
              <Plus size={16} /> {t("Thêm địa chỉ mới")}
            </>
          )}
        </button>
      </div>

      <div className="space-y-4 border border-border rounded-3xl p-4 shadow-[0_10px_40px_rgb(0,0,0,0.03)] transition-all">
        {!isAddingNew && addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {addresses.map((addr: any) => (
              <div
                key={addr._id}
                onClick={() => setSelectedAddressId(addr._id)}
                className={`relative p-4 border rounded-2xl cursor-pointer transition-all flex gap-4 items-start
                  ${
                    selectedAddressId === addr._id
                      ? "border-primary/60 bg-primary/[0.02] ring-1 ring-primary"
                      : "border-primary/40 hover:border-primary"
                  }`}
              >
                <div
                  className={`mt-1 p-2.5 rounded-xl border ${
                    selectedAddressId === addr._id
                      ? "bg-primary text-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <MapPin size={20} />
                </div>
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[15px] text-foreground">
                      {addr.title}
                    </span>
                    {addr.is_default && (
                      <Badge variant={"info"}>
                        {t("addresses.types.default")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {addr.full_address}
                  </p>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${
                      selectedAddressId === addr._id
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {selectedAddressId === addr._id && (
                      <CheckCircle2 size={14} className="text-foreground" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isAddingNew && (
            <EmptyState
              height="sm"
              title="Trống"
              description="Bạn chưa có địa chỉ nào được lưu."
            />
          )
        )}

        {/* FORM NHẬP ĐỊA CHỈ MỚI */}
        {isAddingNew && (
          <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-sm font-bold text-foreground ml-1"
              >
                {t("checkout.shipping.address_label")} *
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder={t("checkout.shipping.address_placeholder")}
                className="h-10 rounded-xl border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-foreground ml-1">
                  {t("checkout.shipping.province")} *
                </Label>
                <Select
                  size="large"
                  showSearch
                  placeholder={t("checkout.shipping.select_province")}
                  className="w-full h-12 rounded-xl"
                  value={formData.state || undefined}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      state: val,
                      district: "",
                      city: "",
                    }))
                  }
                >
                  {provinces.map((p) => (
                    <Option key={p.province_id} value={p.province_id}>
                      {p.province_name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-foreground ml-1">
                  {t("checkout.shipping.district")} *
                </Label>
                <Select
                  size="large"
                  showSearch
                  placeholder={t("checkout.shipping.select_district")}
                  className="w-full h-12 rounded-xl"
                  disabled={!formData.state}
                  value={formData.district || undefined}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      district: val,
                      city: "",
                    }))
                  }
                >
                  {districts.map((d) => (
                    <Option key={d.district_id} value={d.district_id}>
                      {d.district_name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-foreground ml-1">
                  {t("checkout.shipping.ward")} *
                </Label>
                <Select
                  showSearch
                  size="large"
                  placeholder={t("checkout.shipping.select_ward")}
                  className="w-full h-12 rounded-xl"
                  disabled={!formData.district}
                  value={formData.city || undefined}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, city: val }))
                  }
                >
                  {wards.map((w) => (
                    <Option key={w.ward_id} value={w.ward_id}>
                      {w.ward_name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-4 border-t border-border">
          <Label
            htmlFor="notes"
            className="text-[13px] font-bold text-foreground ml-1 uppercase tracking-wider"
          >
            {t("Ghi chú đơn hàng")}
          </Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder={t("Ví dụ: Chuyển hàng vào giờ hành chính...")}
            rows={2}
            className="rounded-xl border-border  transition-colors resize-none p-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
