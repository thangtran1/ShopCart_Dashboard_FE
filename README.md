## 🌐 Live Demo

- **URL**: [shop_cart_tvt.vn](https://shop-cart-dashboard-fe.vercel.app/)
- **Tài khoản dùng thử (User)**:
  - **Email**: `user1@gmail.com`
  - **Mật khẩu**: `123123`
- **Tài khoản Quản trị (Admin)**:  
  Vì lý do bảo mật, tài khoản Admin không được cung cấp công khai.  
  Vui lòng liên hệ **Quản trị viên** để được cấp quyền test các tính năng nâng cao.
- **Hỗ trợ kỹ thuật**:
  - 📧 Email: [thangtrandz04@gmail.com](mailto:thangtrandz04@gmail.com)
  - 📞 Hotline: **0389 215 396**
  - 💬 Fanpage: [vanthang.io.vn](https://vanthang.io.vn)

---

## 📸 Giao diện dự án (Screenshots)

### 👤 User Interface

| | |
|:---:|:---:|
| **🌙 Trang chủ (Dark)** | **☀️ Trang chủ (Light)** |
| ![User Dark](./src/assets/images/screenshots/UI-User1-dark.png) | ![User Light](./src/assets/images/screenshots/UI-User1-light.png) |
| **🛒 Cửa hàng** | **👤 Hồ sơ** |
| ![User Shop](./src/assets/images/screenshots/UI-User1-SHOP-dark.png) | ![User Profile](./src/assets/images/screenshots/UI-User-profile.png) |

---

### 🛠️ Admin Dashboard

| | |
|:---:|:---:|
| **📊 Quản trị viên (Dark)** | **📈 Quản trị viên (Light)** |
| ![Admin Dark](./src/assets/images/screenshots/UI-Admin-dark.png) | ![Admin Light](./src/assets/images/screenshots/UI-Admin-light.png) |
| **👨‍💼 Quản lý** | **⚙️ Hồ sơ Admin** |
| ![Admin Manager](./src/assets/images/screenshots/UI-Admin-manager.png) | ![Admin Profile](./src/assets/images/screenshots/UI-Admin-profile.png) |
---

## Installation

```bash
# Clone the repository
git clone https://github.com/thangtran1/dashboard_admin_khoahocre_FE
cd dashboard_admin

# Install dependencies
pnpm install

# Setup env
pnpm setup-env

# Check connection with BE
pnpm check-backend
```

### Development

```bash
# Start all applications
pnpm dev

```

## 📁 Project Structure

```text
dashboard_admin/
├── src/
│   ├── api/          # Hàm gọi API, service backend
│   ├── assets/       # Hình ảnh, icon, font
│   ├── components/   # Component tái sử dụng
│   ├── contexts/     # React Contexts (Auth, Theme, ...)
│   ├── hooks/        # Custom hooks
│   ├── layouts/      # Layout tổng thể (Admin, Auth, ...)
│   ├── locales/      # Đa ngôn ngữ (i18n)
│   ├── pages/        # Các trang chính của ứng dụng
│   ├── router/       # Định nghĩa router, route config
│   ├── store/        # Global state (Redux, Zustand, ...)
│   ├── styles/       # CSS/Tailwind/SCSS toàn cục
│   ├── theme/        # Cấu hình màu sắc, typography
│   ├── types/        # Khai báo interface/type chung
│   ├── ui/           # Bộ UI cơ bản (Button, Input, Card, ...)
│   └── utils/        # Hàm tiện ích (formatDate, debounce, ...)
│
├── App.tsx           # Thành phần gốc của ứng dụng
├── main.tsx          # Điểm vào chính, khởi tạo React DOM
└── global.css        # CSS toàn cục áp dụng cho dự án

```

## 🛠️ Available Scripts

### Development Commands

```bash
pnpm dev              # Start all apps in development mode
```

## 🏗️ Technology Stack

### Core Technologies

- **Framework**: React.js 19
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS, Antd

### UI & Components

- **UI Library**: Antd (React)
- **State Management**: Zustand, React Query (TanStack Query)
- **Form Handling**: React Hook Form
- **Data Tables**: Antd Table

## 🔧 Configuration

### Port Configuration

- **User Web**: <http://localhost:3000>
- **Admin Web**: <http://localhost:3000/dashboard/workbench>

### Code Style

- Follow the existing code style
- Use TypeScript for all new code

### Commit Convention

This project uses conventional commits:

```bash
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update build process
```

## Sự cố thường gặp – system-admin failed

Khi clone code mới về cập nhật env và kiểm tra kết nối với Backend

Cách xử lý nhanh (khuyến nghị):

Test connection trực tiếp terminal với lệnh:

```bash
pnpm check-backend
```

Mẹo: Hãy liên hệ qua email: thangtrandz04@gmail để biết thêm thông tin or liên hệ trực tiếp qua hotline: 0389215396 hoặc thông qua fanpage: vanthang.io.vn để được hỗ trợ

# 👨‍💻 We are 👨‍💻 The System Admins! 🖥️
