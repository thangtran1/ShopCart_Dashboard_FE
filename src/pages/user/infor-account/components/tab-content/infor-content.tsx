"use client";

import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import AddressSection from "../infor-content/AddressSection";
import LinkedAccountSection from "../infor-content/LinkedAccountSection";
import PasswordSection from "../infor-content/PasswordSection";
import ProfileDrawer from "../infor-content/ProfileDrawer";
import UserInfoSection from "../infor-content/UserInfoSection";
import { useAddressActions } from "@/hooks/useAddresses";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

export type DrawerType =
  | "updateUser"
  | "addAddress"
  | "updateAddress"
  | "updatePassword";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const { addresses, isFetching, deleteAddress } = useAddressActions();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>("updateUser");
  const [drawerData, setDrawerData] = useState<any>(null);

  const openDrawer = (type: DrawerType, data?: any) => {
    setDrawerType(type);
    setDrawerData(data || null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerData(null);
  };

  const reminders = [];

  // 1. Kiểm tra thiếu thông tin cá nhân
  const missingInfoKeys = [];
  if (!profile?.dateOfBirth) missingInfoKeys.push(t("profile.reminders.fields.dob"));
  if (!profile?.phone) missingInfoKeys.push(t("profile.reminders.fields.phone"));
  if (profile?.gender === undefined || profile?.gender === null || profile?.gender === "") {
    missingInfoKeys.push(t("profile.reminders.fields.gender"));
  }

  if (missingInfoKeys.length > 0) {
    reminders.push({
      key: "missing_user_info",
      color: "bg-blue-50 border-blue-200 text-blue-600",
      icon: "ℹ️",
      message: t("profile.reminders.missing_fields", { 
        fields: missingInfoKeys.join(", ") 
      }),
      btnText: t("profile.reminders.update_now"),
      action: () => openDrawer("updateUser", profile),
    });
  }

  // 2. Kiểm tra nếu chưa có địa chỉ
  if (!isFetching && addresses?.length === 0) {
    reminders.push({
      key: "missing_address",
      color: "bg-amber-50 border-amber-200 text-amber-600",
      icon: "📍",
      message: t("profile.reminders.no_address"),
      btnText: t("profile.reminders.add_now"),
      action: () => openDrawer("addAddress"),
    });
  }

  return (
    <div>
      <div className="space-y-3">
        {reminders.map((item) => (
          <div
            key={item.key}
            className={`${item.color} border mb-4 rounded-lg p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500`}
          >
            <div className="flex items-center gap-3">
              <div className="text-lg shrink-0">{item.icon}</div>
              <span className="text-sm font-medium">{item.message}</span>
            </div>
            <Button
              type="link"
              className="!text-inherit font-bold !text-sm hover:underline shrink-0"
              onClick={item.action}
            >
              {item.btnText}
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <UserInfoSection
          addresses={addresses}
          profile={profile}
          onEdit={() => openDrawer("updateUser", profile)}
        />

        <AddressSection
          addresses={addresses}
          isFetching={isFetching}
          onAdd={() => openDrawer("addAddress")}
          onEdit={(address) => openDrawer("updateAddress", address)}
          onDelete={deleteAddress}
        />

        <PasswordSection onChange={() => openDrawer("updatePassword")} />

        <LinkedAccountSection />

        <ProfileDrawer
          open={drawerOpen}
          type={drawerType}
          data={drawerData}
          onClose={closeDrawer}
        />
      </div>
    </div>
  );
}