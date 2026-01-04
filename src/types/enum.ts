export enum BasicStatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  DISABLE = 0,
}

export enum ResultEnum {
  SUCCESS = 0,
  ERROR = -1,
  TIMEOUT = 401,
}

export enum AddressType {
  HOME = 1,   // Nhà riêng
  OFFICE = 2, // Văn phòng
}

export enum BrandStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum StorageEnum {
  UserInfo = "userInfo",
  UserToken = "userToken",
  Settings = "settings",
  I18N = "i18nextLng",
}

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

export enum ThemeLayout {
  Vertical = "vertical",
  Horizontal = "horizontal",
  Mini = "mini",
}

export enum ThemeColorPresets {
  Default = "default",
  Cyan = "cyan",
  Purple = "purple",
  Blue = "blue",
  Orange = "orange",
  Red = "red",
}

export enum LocalEnum {
  en = "en",
  vi = "vi",
}

export enum MultiTabOperation {
  FULLSCREEN = "fullscreen",
  REFRESH = "refresh",
  CLOSE = "close",
  CLOSEOTHERS = "closeOthers",
  CLOSEALL = "closeAll",
  CLOSELEFT = "closeLeft",
  CLOSERIGHT = "closeRight",
}

export enum PermissionType {
  CATALOGUE = 0,
  MENU = 1,
  BUTTON = 2,
}

export enum HtmlDataAttribute {
  ColorPalette = "data-color-palette",
  ThemeMode = "data-theme-mode",
}

export enum NotificationType {
  SYSTEM = "system",
  NEWS = "news",
  MAINTENANCE = "maintenance",
}

export enum AuthSessionStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
}

export enum ProductType {
  IPHONE = 'iPhone',
  MACBOOK = 'MacBook',
  ANDROID = 'Android',
  LAPTOP = 'Laptop',
  CAMERA = 'Camera',
  TABLET = 'Tablet',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export const ORDER_STATUS_MAP: Record<string, { label: string; className: string }> = {
  [OrderStatus.PENDING]: { 
    label: "Chờ xử lý", 
    className: "bg-amber-100 text-amber-700",
  },
  [OrderStatus.PROCESSING]: { 
    label: "Đang xử lý", 
    className: "bg-blue-100 text-blue-700",
  },
  [OrderStatus.DELIVERED]: { 
    label: "Đã giao hàng", 
    className: "bg-green-100 text-green-700",
  },
  [OrderStatus.CANCELLED]: { 
    label: "Đã hủy", 
    className: "bg-red-100 text-red-700",
  },
};