import { useEffect, useState } from "react";
import { Card, Avatar, Tabs, Upload, Button } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Separator } from "@/ui/separator";
import { Icon } from "@/components/icon";
import PersonalInfoTab from "./components/PersonalInfoTab";
import SecurityTab from "./components/SecurityTab";
import { useTranslation } from "react-i18next";
import { uploadAvatar, updateUserProfile } from "@/api/services/profileApi";
import { toast } from "sonner";

export default function UserProfile() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile, error, updateProfile } = useUserProfile();
  const [isUploading, setIsUploading] = useState(false);

  const loading = !profile && !error;
  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (tab: string) => setSearchParams({ tab });

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      if (event.detail) updateProfile(event.detail);
    };
    window.addEventListener("profileUpdated", handleProfileUpdate as EventListener);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate as EventListener);
  }, [updateProfile]);

  const avatarUrl = profile?.avatar ? `${import.meta.env.VITE_API_URL}${profile.avatar}` : undefined;

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadAvatar(file); // upload file, trả về URL
      const updated = await updateUserProfile({ avatar: url }); // update profile
      updateProfile(updated);
      window.dispatchEvent(new CustomEvent("avatarUpdated", { detail: updated }));
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err: any) {
      toast.error(err.message || "Upload thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">{t("profile.loading")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold mb-2">{t("profile.error")}</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          {t("profile.try-again")}
        </button>
      </Card>
    );
  }

  const tabItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:user" className="h-4 w-4" />
          {t("profile.title")}
        </span>
      ),
      children: <PersonalInfoTab profile={profile} onProfileUpdate={updateProfile} />,
    },
    {
      key: "security",
      label: (
        <span className="flex items-center gap-2">
          <Icon icon="lucide:shield" className="h-4 w-4" />
          {t("profile.security")}
        </span>
      ),
      children: <SecurityTab />,
    },
  ];

  return (
    <div className="bg-card text-card-foreground px-6 pb-6 flex flex-col gap-6 rounded-xl border shadow-sm">
      {/* Header */}
      <div className="pt-4 flex items-center">
        <div className="relative">
          <Avatar size={64} icon={<UserOutlined />} src={avatarUrl} className="border-2 border-border" />
          <Upload
            showUploadList={false}
            customRequest={({ file }) => handleAvatarUpload(file as File)}
            accept="image/*"
          >
             <Button
                shape="circle"
                size="middle"
                icon={<CameraOutlined />}
                className="absolute -bottom-6 right-6 shadow-lg bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                loading={isUploading}
              />
          </Upload>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{profile?.name || t("profile.user")}</h1>
            {profile?.role && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/30">
                {profile.role === "admin" ? "👑 Admin" : profile.role === "moderator" ? "🛡️ Mod" : "👤 User"}
              </span>
            )}
            {profile?.isEmailVerified && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">✅ Verified</span>
            )}
          </div>
          <p className="text-muted-foreground">{profile?.email || "example@email.com"}</p>
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </div>
  );
}
