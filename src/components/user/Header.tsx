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
    <header className={`${contentWrapper} mx-auto sticky top-0 z-50 py-5 backdrop-blur-md border-b`}>
      <div className="flex items-center justify-between mx-auto gap-4 px-4">
      <div className="flex items-center gap-1 md:gap-0 flex-shrink-0">
          <MobileMenu />
          <Logo />
        </div>

        <HeaderMenu />

        <div className="flex items-center justify-end gap-3 flex-shrink-0">
          <SearchBar />
            <CartIcon />
            <FavoriteButton />
            <OrderIcon />
          {userInfo && <SignIn />}
        </div>
      </div>
    </header>
  );
};
export default Header;
