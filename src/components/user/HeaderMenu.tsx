"use client";
import { headerData } from "@/constants/data";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";

const HeaderMenu = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="hidden md:flex flex-1 items-center justify-center gap-6 text-sm capitalize font-semibold px-4">
      {headerData?.map((item) => (
        <Link
          key={item.titleKey}
          to={item.href}
          className={`text-base whitespace-nowrap !text-foreground hover:!text-primary transition-colors relative group ${isActive(item.href) && "!text-primary"
            }`}
        >
          {t(item.titleKey)}

          <span
            className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary group-hover:w-1/2 group-hover:left-0 transition-all duration-300 ${isActive(item.href) ? "w-1/2 left-0" : ""
              }`}
          />
          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-primary group-hover:w-1/2 group-hover:right-0 transition-all duration-300 ${isActive(item.href) ? "w-1/2 right-0" : ""
              }`}
          />
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;