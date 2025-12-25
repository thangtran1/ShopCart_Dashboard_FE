import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function PasswordSection({ onChange }: any) {
  return (
    <div className="rounded-xl border p-5 shadow-sm flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Mật khẩu</h2>
        <p className="text-sm text-muted-foreground">
          Cập nhật mật khẩu đăng nhập
        </p>
      </div>

      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={onChange}
      >
        Thay đổi mật khẩu
      </Button>
    </div>
  );
}