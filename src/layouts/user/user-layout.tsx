import { ThemeProvider } from "@/theme/theme-provider";
import { AntdAdapter } from "@/theme/adapter/antd.adapter";
import { Outlet } from "react-router";

import clsx from "clsx";
import { contentWrapper } from "@/utils/use-always";

import ScrollToTop from "@/utils/ScrollToTop";
import Logo from "@/ui/logo";
import LocalePicker from "@/components/common/locale-picker";

import Footer from "@/pages/user/public/footer";

import SettingButton from "../dashboard/components/setting-button";
import Header from "@/components/user/Header";

export default function UserLayout() {
  return (
    <ThemeProvider adapters={[AntdAdapter]}>
      <ScrollToTop />
      <div className="sticky top-0 left-0 z-50 py-1 bg-muted shadow">
        <div
          className={clsx(
            "flex flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-0 mx-auto",
            contentWrapper
          )}
        >
          <div className="flex items-center gap-2 font-medium cursor-pointer">
            <Logo />
          </div>

          <div className="flex items-center">
            <LocalePicker />
            <SettingButton />
          </div>
        </div>
      </div>

      <div className="bg-background text-foreground">
        <Header />

        <main
          className={`${contentWrapper} p-4 sm:px-6 lg:px-0 border-t mx-auto`}>
          <Outlet />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
