import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import AddressSection from "../infor-content/AddressSection";
import LinkedAccountSection from "../infor-content/LinkedAccountSection";
import PasswordSection from "../infor-content/PasswordSection";
import ProfileDrawer from "../infor-content/ProfileDrawer";
import UserInfoSection from "../infor-content/UserInfoSection";
import { useAddressActions } from "@/hooks/useAddresses";

export type DrawerType =
  | "updateUser"
  | "addAddress"
  | "updateAddress"
  | "updatePassword";

export default function ProfilePage() {
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

  return (
    <div className="space-y-6">
      <UserInfoSection profile={profile} onEdit={() => openDrawer("updateUser", profile)} />

      <AddressSection
        addresses={addresses}     // Danh sách từ API
        isFetching={isFetching}   // Trạng thái loading
        onAdd={() => openDrawer("addAddress")}
        onEdit={(address) => openDrawer("updateAddress", address)}
        onDelete={deleteAddress}  // Truyền hàm xóa trực tiếp
      />

      <PasswordSection onChange={() => openDrawer("updatePassword")} />

      <LinkedAccountSection />

      {/* DRAWER TỔNG */}
      <ProfileDrawer
        open={drawerOpen}
        type={drawerType}
        data={drawerData}
        onClose={closeDrawer}
      />
    </div>
  );
}
