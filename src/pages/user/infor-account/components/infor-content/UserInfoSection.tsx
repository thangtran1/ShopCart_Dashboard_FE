"use client";

import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Gender } from "@/types/enum";
import { Badge } from "@/ui/badge";
import { useTranslation } from "react-i18next";

export default function UserInfoSection({ profile, onEdit, addresses }: any) {
  const { t } = useTranslation();
  const defaultAddress = addresses?.find((addr: any) => addr.is_default === true);

  const genderConfigs: Record<string, { label: string; variant: any }> = {
    [Gender.MALE]: {
      label: t("profile_drawer.form.gender_options.male"),
      variant: "info"
    },
    [Gender.FEMALE]: {
      label: t("profile_drawer.form.gender_options.female"),
      variant: "destructive"
    },
    [Gender.OTHER]: {
      label: t("profile_drawer.form.gender_options.other"),
      variant: "secondary"
    },
  };

  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            {t("profile_drawer.section.user_info_title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("profile_drawer.section.user_info_desc")}
          </p>
        </div>
        <Button
          type="text"
          danger
          icon={<EditOutlined />}
          onClick={onEdit}
          className="flex items-center font-medium"
        >
          {t("profile_drawer.section.btn_update")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
        <InfoItem label={t("profile_drawer.form.labels.name")} value={profile?.name} />
        <InfoItem label={t("profile_drawer.form.labels.phone")} value={profile?.phone} />

        <InfoItem label={t("profile_drawer.form.labels.gender")}>
          {profile?.gender && genderConfigs[profile.gender] && (
            <Badge variant={genderConfigs[profile.gender].variant} className="uppercase text-[10px]">
              {genderConfigs[profile.gender].label}
            </Badge>
          )}
        </InfoItem>

        <InfoItem label={t("profile_drawer.form.labels.email")} value={profile?.email} />

        <InfoItem
          label={t("profile_drawer.form.labels.dob")}
          value={
            profile?.dateOfBirth
              ? new Date(profile.dateOfBirth).toLocaleDateString(
                t("profile_drawer.section.date_locale")
              )
              : undefined
          }
        />

        <InfoItem
          label={t("profile_drawer.form.labels.default_shipping")}
          value={defaultAddress?.full_address}
        />
      </div>
    </div>
  );
}

function InfoItem({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  const { t } = useTranslation();
  const fallback = (
    <span className="text-foreground italic font-normal">
      {t("profile_drawer.section.not_updated")}
    </span>
  );

  return (
    <div className="border-b border-border pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-end min-h-[50px]">
      <p className="text-foreground text-sm mb-1 sm:mb-0 whitespace-nowrap">
        {label}:
      </p>
      <div className="text-foreground font-medium text-sm text-left sm:text-right break-words max-w-full sm:max-w-[300px]">
        {children || (value ? value : fallback)}
      </div>
    </div>
  );
}