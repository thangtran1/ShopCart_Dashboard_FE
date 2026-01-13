import LocalePicker from "@/components/common/locale-picker";
import { cn } from "@/utils";
import type { ReactNode } from "react";
import AccountDropdown from "./components/account-dropdown";
import SearchBar from "./components/search-bar";
import SettingButton from "./components/setting-button";
import { useUserInfo } from "@/store/userStore";

interface HeaderProps {
  headerLeftSlot?: ReactNode;
}

export default function Header({ headerLeftSlot }: HeaderProps) {
  const { role } = useUserInfo();

  return (
    <header
      data-slot="TVT-layout-admin"
      className={cn(
        "sticky top-0 right-0 left-auto flex items-center bg-background justify-between px-2 ml-[1px]",
        "h-[var(--layout-header-height)] grow-0 shrink-0 z-50 shadow-sm"
      )}
    >
      {role === "user" ? (
        <div className="flex items-center">{headerLeftSlot}</div>
      ) : (
        <SearchBar /> // Admin search bar
      )}

      <div className="flex w-full justify-end items-center gap-2">
        <LocalePicker />
        <SettingButton />
        <AccountDropdown />
      </div>
    </header>
  );
}
