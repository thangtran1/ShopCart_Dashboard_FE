export interface Image {
  asset: {
    url: string;
  };
}

export interface Slug {
  current: string;
}

export interface Category {
  _id: string;
  _ref?: string;
  name: string;
  slug: Slug;
  description?: string;
  productCount?: number;
  image?: Image;
}

export interface Brand {
  _id: string;
  _ref?: string;
  name: string;
  slug: Slug;
  description?: string;
  image?: Image;
}

export interface Product {
  _id: string;
  name: string;
  slug: Slug;
  price: number;
  discount?: number;
  description?: string;
  image?: string;
  images?: Image[];
  category?: Category;
  brand?: Brand;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  specifications?: string[];
}

export interface Author {
  name: string;
  image?: Image;
}

export interface ShippingAddress {
  address: string;
  city: string;
  phone: string
  fullName: string
}

export interface OrderConfig {
  userId: string
  customerName: string;
  customerEmail: string;
  items: OrderItem[]
  orderNumber: string;
  totalAmount: number; // tổng tiền sau khi giảm
  subTotal: number // tổng tiền khi chưa giảm
  discountAmount: number // số tiền giảm
  couponCode: string // mã giảm giá
  shippingAddress: ShippingAddress
  status: string;
  paymentMethod: string;
  _id: string;
  createdAt: string;
}

export interface OrderItem {
  product: string; 
  name: string;
  price: number;
  image: string;
  quantity: number;
  _id: string;
}
