export const templateData = [
  {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    password: "123456",
    role: "user",
    status: "active",
    phone: "0123456789",
    bio: "Mô tả ngắn về người dùng",
  },
  {
    name: "Trần Thị B",
    email: "tranthib@example.com",
    password: "123456",
    role: "moderator",
    status: "active",
    phone: "0987654321",
    bio: "Mô tả ngắn về người dùng",
  },
];

// Tạo sheet hướng dẫn
export const instructionData = [
  { field: "HƯỚNG DẪN ĐIỀN THÔNG TIN", description: "", example: "" },
  { field: "", description: "", example: "" },
  {
    field: "name",
    description: "Tên đầy đủ của người dùng",
    example: "Nguyễn Văn A",
  },
  {
    field: "email",
    description: "Email duy nhất, không trùng lặp",
    example: "user@example.com",
  },
  {
    field: "password",
    description: "Mật khẩu tối thiểu 6 ký tự",
    example: "123456",
  },
  {
    field: "role",
    description: "Vai trò: user, moderator, admin",
    example: "user",
  },
  {
    field: "status",
    description: "Trạng thái: active, inactive",
    example: "active",
  },
  {
    field: "phone",
    description: "Số điện thoại (tùy chọn)",
    example: "0123456789",
  },
  {
    field: "bio",
    description: "Mô tả ngắn (tùy chọn)",
    example: "Mô tả về người dùng",
  },
  { field: "", description: "", example: "" },
  { field: "LUU Ý QUAN TRỌNG:", description: "", example: "" },
  { field: "• Tất cả email phải duy nhất", description: "", example: "" },
  {
    field: "• Nếu có 1 dòng lỗi, tất cả sẽ không được tạo",
    description: "",
    example: "",
  },
  {
    field: "• Xóa sheet này trước khi upload",
    description: "",
    example: "",
  },
];
