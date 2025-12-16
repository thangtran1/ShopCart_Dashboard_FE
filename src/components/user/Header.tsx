import Logo from "@/ui/logo";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import HeaderMenu from "./HeaderMenu";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "@/pages/user/public/SignIn";
import { contentWrapper } from "@/utils/use-always";
import OrderIcon from "./OrderIcon";
import { useUserInfo } from "@/store/userStore";

const Header = () => {
  const userInfo = useUserInfo();

  return (
    <header    className={`${contentWrapper} mx-auto p-4 sm:px-6 lg:px-0 sticky top-0 z-50 py-5 px-4 backdrop-blur-md`}>
      <div className="flex items-center justify-between mx-auto">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />
          <OrderIcon />
            {userInfo  && <SignIn />}
        </div>
      </div>
    </header>
  );
};

export default Header;
