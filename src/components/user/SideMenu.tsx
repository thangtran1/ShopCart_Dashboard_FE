import { FC } from "react";
import Logo from "@/ui/logo";
import { X } from "lucide-react";
import { headerData } from "@/constants/data";
import { Link } from "react-router";
import { useLocation } from "react-router";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks/index-fake";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50  shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } `}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-background h-screen p-6 border-r border-primary/40 justify-between flex flex-col gap-6"
      >
        <div>
          <div className="flex items-center justify-between gap-5">
            <Logo />
            <button onClick={onClose} className="hover:text-primary opacity-70 border border-primary/40 rounded-full p-1 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <div className="flex mt-6 flex-col space-y-5 font-semibold">
            {headerData?.map((item) => (
              <Link
                to={item?.href}
                key={item?.title}
                className={`relative pl-3 !text-foreground hover:!text-primary ${
                  pathname === item?.href && "!text-primary"
                }`}
              >
                {pathname === item?.href && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-primary rounded-full" />
                )}

                {item?.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-20">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent my-6" />

          <div className="pt-8 flex flex-col items-start">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-5">
            Kết nối với chúng tôi
            </p>
            <div className="flex justify-start items-center space-x-4">
              <SocialMedia />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
