"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Typography, Select } from "antd";
import { useLocation } from "@/hooks/useLocation";

const { Title } = Typography;
const { Option } = Select;

interface ShippingAddressFormProps {
  onChange: (data: any) => void;
}

const ShippingAddressForm = ({ onChange }: ShippingAddressFormProps) => {
  const [formData, setFormData] = useState({
    address: "",
    state: "",    
    district: "", 
    city: "",     
    notes: "",
  });

  const { provinces, districts, wards } = useLocation(formData.state, formData.district);
  
  const lastDataRef = useRef("");

  useEffect(() => {
    const provinceName = provinces.find((p) => p.province_id === formData.state)?.province_name || "";
    const districtName = districts.find((d) => d.district_id === formData.district)?.district_name || "";
    const wardName = wards.find((w) => w.ward_id === formData.city)?.ward_name || "";

    const isValid = !!(formData.address && formData.state && formData.district && formData.city);

    const payload = {
      address: formData.address,
      provinceName,
      districtName,
      wardName,
      fullAddress: `${formData.address}, ${wardName}, ${districtName}, ${provinceName}`,
      notes: formData.notes,
      isValid
    };

    const dataString = JSON.stringify(payload);
    if (lastDataRef.current !== dataString) {
      lastDataRef.current = dataString;
      onChange(payload);
    }
  }, [formData, provinces, districts, wards, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { district: "", city: "" } : {}),
      ...(name === "district" ? { city: "" } : {}),
    }));
  };

  return (
    <div className="space-y-4">
      <Title level={4}>Địa Chỉ Giao Hàng</Title>
      <div className="space-y-4 border border-border rounded-lg p-4 bg-card">
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ cụ thể *</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Số nhà, tên đường"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tỉnh/Thành *</Label>
            <Select
              showSearch
              placeholder="Chọn Tỉnh/Thành"
              className="w-full"
              value={formData.state || undefined}
              onChange={(val) => handleSelectChange("state", val)}
              optionFilterProp="children"
            >
              {provinces.map((p) => (
                <Option key={p.province_id} value={p.province_id}>{p.province_name}</Option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quận/Huyện *</Label>
            <Select
              showSearch
              placeholder="Chọn Quận/Huyện"
              className="w-full"
              disabled={!formData.state}
              value={formData.district || undefined}
              onChange={(val) => handleSelectChange("district", val)}
              optionFilterProp="children"
            >
              {districts.map((d) => (
                <Option key={d.district_id} value={d.district_id}>{d.district_name}</Option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Phường/Xã *</Label>
            <Select
              showSearch
              placeholder="Chọn Phường/Xã"
              className="w-full"
              disabled={!formData.district}
              value={formData.city || undefined}
              onChange={(val) => handleSelectChange("city", val)}
              optionFilterProp="children"
            >
              {wards.map((w) => (
                <Option key={w.ward_id} value={w.ward_id}>{w.ward_name}</Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Ghi chú thêm cho shipper..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;