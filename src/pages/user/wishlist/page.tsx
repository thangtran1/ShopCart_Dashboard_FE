import NoAccess from "@/components/user/NoAccess";
import WishListProducts from "@/components/user/WishListProducts";
import { useUserInfo } from "@/store/userStore";
const WishListPage = () => {
  const userInfo = useUserInfo();
  return (
    <>
      {userInfo?.id ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Đăng nhập để xem danh sách yêu thích của bạn. Không bỏ lỡ sản phẩm trong giỏ hàng để thanh toán!" />
      )}
    </>
  );
};

export default WishListPage;
