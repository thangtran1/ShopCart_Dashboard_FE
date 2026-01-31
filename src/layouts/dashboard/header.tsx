import LocalePicker from "@/components/common/locale-picker";
import { cn } from "@/utils";
import type { ReactNode } from "react";
import AccountDropdown from "./components/account-dropdown";
import SearchBar from "./components/search-bar";
import SettingButton from "./components/setting-button";
import { useUserInfo } from "@/store/userStore";
import { useSettings } from "@/store/settingStore";
import { ScrollArea } from "@/ui/scroll-area";

interface HeaderProps {
  headerLeftSlot?: ReactNode;
}

export default function Header({ headerLeftSlot }: HeaderProps) {
  const { role } = useUserInfo();
  const { themeStretch } = useSettings();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "bg-background/80 backdrop-blur-md",
        "shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_1px_4px_0_rgba(0,0,0,0.05)]",
        "border-b border-border/40",
        "h-[var(--layout-header-height)]"
      )}
    >
      <ScrollArea className="h-full w-full">
        <div
          className={cn(
            "flex items-center justify-between p-2 h-full transition-all duration-300 ease-in-out",
            themeStretch ? "w-full" : "xl:max-w-screen-2xl mx-auto"
          )}
        >
          <div className="flex items-center flex-1 min-w-0 mr-4">
            {role === "user" ? (
              <div className="flex items-center gap-2">{headerLeftSlot}</div>
            ) : (
              <div className="w-full max-w-[400px]">
                <SearchBar />
              </div>
            )}
          </div>

          <div className="flex items-center shrink-0">
            <div className="flex items-center hover:bg-accent p-1 rounded-full transition-colors">
              <LocalePicker />
            </div>
            <div className="flex items-center hover:bg-accent p-1 rounded-full transition-colors">
              <SettingButton />
            </div>
            <div className="ml-1 border-l pl-3 border-border/60">
              <AccountDropdown />
            </div>
          </div>
        </div>
      </ScrollArea>
    </header>
  );
}