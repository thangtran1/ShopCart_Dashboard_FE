import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import Logo from "@/ui/logo";
import { Separator } from "@/ui/separator";
import {
  LoginStateEnum,
  useLoginStateContext,
} from "@/pages/admin/auth/login/providers/login-provider";
import { Button } from "@/ui/button";

type NoAccessProps = {
  details?: string;
  hidden?: boolean; // 👈 thêm prop
};

const NoAccess = ({
  details = "Đăng nhập để xem sản phẩm trong giỏ hàng và thanh toán. Không bỏ lỡ sản phẩm yêu thích của bạn!",
  hidden = false,
}: NoAccessProps) => {
  const { setLoginState } = useLoginStateContext();

  return (
    <div className="mx-auto">
      <Card className="w-full p-5">
        <CardHeader className="flex items-center flex-col">
          <Logo />
          <CardTitle className="text-2xl font-bold text-center">
            Chào mừng trở lại!
          </CardTitle>
        </CardHeader>

        <Separator />

        {/* ✅ LUÔN HIỆN DETAILS */}
        <CardContent className="space-y-4">
          <p className="text-center font-medium">{details}</p>

          {/* ❌ Chỉ ẩn nút Login */}
          {!hidden && (
            <Button
              onClick={() => setLoginState(LoginStateEnum.LOGIN)}
              className="w-full cursor-pointer"
              size="lg"
            >
              Đăng nhập
            </Button>
          )}
        </CardContent>

        {/* ❌ Chỉ ẩn footer khi hidden */}
        {!hidden && (
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Bạn không có tài khoản?
            </div>
            <Button
              onClick={() => setLoginState(LoginStateEnum.REGISTER)}
              variant="outline"
              className="w-full cursor-pointer"
              size="lg"
            >
              Tạo tài khoản
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default NoAccess;
